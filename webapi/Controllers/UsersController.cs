using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        private readonly DataContext _context;
        public static string CurrUserEmail ="";
        public static User user = new User();
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const bool IS_ADMIN = false;

        public UsersController(IConfiguration configuration, DataContext context,
            IHttpContextAccessor httpContextAccessor)
        {
            this._configuration = configuration;
            this._context = context;
            this._httpContextAccessor = httpContextAccessor;
        }

        /**
        * Registers a new user with the provided user data.
        * @param userDto The user data to be used for registration.
        * @return Returns the newly created user.
        */
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto userDto)
        {
            try
            {
                if (await UserExists(userDto.Email))
                {
                    return BadRequest("Email already exists");
                }

                CreatePasswordHash(userDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

                user.Name = userDto.Name;
                user.IsAdmin = IS_ADMIN;
                user.Email = userDto.Email.ToLower();
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        /**
        * Logs a user in and generates a JWT token for authentication.
        * @param {IUserLogin} userLogin - An object containing the user's email and password.
        * @returns {object} - Returns a JSON object containing a JWT token and user information.
        * @throws {Exception} - Throws an exception if there is an error while logging in.
        */
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(IUserLogin userLogin)
        {
            try
            {
                Debug.WriteLine("in Login");
                // Retrieve the user from the database.
                User userDb = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == userLogin.Email.ToLower());

                // Return a bad request response if the user doesn't exist or the password is incorrect.
                if (userDb == null || !VerifyPasswordHash(userLogin.Password, userDb.PasswordHash, userDb.PasswordSalt))
                    return BadRequest("Invalid login credentials");

                // Generate a token and refresh token.
                string token = CreateToken(userDb);
                var refreshToken = GenerateRefreshToken();
                SetRefreshToken(refreshToken);
                userDb.RefreshToken = refreshToken.Token;
                userDb.TokenCreated = refreshToken.Created;
                userDb.TokenExpires = refreshToken.Expires;

                CurrUserEmail= userLogin.Email.ToLower();

                //Save changes to the database
                await _context.SaveChangesAsync();

                // Return a JSON response with the token.
                // Return a JSON response with the token and user object.
                return new { token,
                    user = new { email = userDb.Email,
                        password = userLogin.Password,
                        name = userDb.Name,
                        isAdmin = userDb.IsAdmin} };
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /**
        * Retrieves the current user based on the JWT token passed in the header.
        * @return {Task<ActionResult<User>>} Returns an HTTP response with
        * the current user object if successful.
        * @throws {Exception} Throws an exception if there is an error while
        * processing the request.
        */
        [HttpGet]
        public async Task<ActionResult<User>> GetUser()
        {
            try
            {
                // Get the user's email from the token
                var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
                //Debug.WriteLine(HttpContext.User);
                var claims = HttpContext.User.Claims;
                foreach (var claim in claims)
                {
                    Debug.WriteLine($"{claim.Type}: {claim.Value}");
                }
                if (email == null)
                    return Unauthorized();

                Debug.WriteLine("found token"+ email);

                // Find the user in the database
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null) 
                    return NotFound();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        /**
         * (Not in use for now)
        * Updates the user's properties with the given UserDto object.
        * The user must be authorized and authenticated to make the request.
        * @param UserDto userDto The user object containing the updated properties.
        * @return ActionResult<User> Returns an Ok ActionResult with the updated user object if successful.
        * Returns a NotFound ActionResult if the user is not found in the database.
        * Returns a BadRequest ActionResult if the userDto parameter is null.
        * Returns an Unauthorized ActionResult if the user is not authorized or authenticated.
        */
        [HttpPut("{userDto}")]
        [Authorize]
        public async Task<ActionResult<User>> UpdateUser(UserDto userDto)
        {
            try
            {
                // Check if user is authorized
                var auth = string.Empty;
                if (_httpContextAccessor.HttpContext != null)
                {
                    auth = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
                }

                if (auth != null)
                {
                    // Find user in the database
                    var userDb = await _context.Users.FirstOrDefaultAsync(u => u.Email == auth);

                    if (userDb == null)
                    {
                        // Return a 404 Not Found error if user is not found in the database
                        return NotFound();
                    }

                    if (userDto == null)
                    {
                        // Return a 400 Bad Request error if userDto is null
                        return BadRequest("User cannot be null");
                    }

                    // Update user's properties
                    userDb.Name = userDto.Name;

                    // Save changes to the database
                    await _context.SaveChangesAsync();

                    // Return the updated user
                    return Ok(userDb);
                }

                // Return a 401 Unauthorized error if user is not authorized
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /**
        * Generates a new refresh token.
        * @returns {RefreshToken} The generated refresh token.
        */
        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        /**
        * Sets the refresh token in a cookie and updates the user's token information.
        * @param newRefreshToken The new refresh token to be set.
        */
        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;
        }

        /**
        * Creates a JWT token for the specified user.
        * @param user The user to create the token for.
        * @return The JWT token string.
        */
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        /**
        * Computes the password hash and salt using HMACSHA512. 
        * @param password The password to hash.
        * @param passwordHash The computed password hash.
        * @param passwordSalt The computed password salt.
        */
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        /**
        * Verifies the provided password by computing the hash using the provided salt
        * and comparing it to the provided hash. 
        * @param password The password to verify
        * @param passwordHash The hash of the password to compare against
        * @param passwordSalt The salt used to compute the hash of the password 
        * @returns true if the provided password is verified, false otherwise
        */
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                Debug.WriteLine("VerifyPasswordHash2");
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        /**
        * Checks if a user with the given email exists in the database. 
        * @param email The email address to check. 
        * @return A boolean indicating whether a user with the given email exists in the database.
        */
        private async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}

