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
        public static User user = new User();
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public UsersController(IConfiguration configuration, DataContext context,
            IHttpContextAccessor httpContextAccessor)
        {
            this._configuration = configuration;
            this._context = context;
            this._httpContextAccessor = httpContextAccessor;
        }

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
                user.IsAdmin = false;
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


        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(IUserLogin userLogin)
        {
            try
            {
                

                //// Retrieve the user from the database.
                User userDb = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == userLogin.Email.ToLower());

                //// Return a bad request response if the user doesn't exist or the password is incorrect.
                if (userDb == null || !VerifyPasswordHash(userLogin.Password, userDb.PasswordHash, userDb.PasswordSalt))
                    return BadRequest("Invalid login credentials");

                Debug.WriteLine("1");
                // Generate a token and refresh token and return an OK response with the token.
                string token = CreateToken(userDb);
                Debug.WriteLine("2");

                var refreshToken = GenerateRefreshToken();
                Debug.WriteLine("3");

                SetRefreshToken(refreshToken);
                Debug.WriteLine("4");


                userDb.RefreshToken = refreshToken.Token;
                Debug.WriteLine("5");

                userDb.TokenCreated = refreshToken.Created;
                Debug.WriteLine("6");

                userDb.TokenExpires = refreshToken.Expires;
                Debug.WriteLine("7");


                //Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(token);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet("")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser()
        {
            try
            {
                // Check if the user is authenticated.
                var auth = string.Empty;
                if (_httpContextAccessor.HttpContext != null)
                {
                    auth = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
                }

                // If the user is authenticated, retrieve the user from the database.
                if (auth != null)
                {
                    var userDb = await _context.Products.FindAsync(user.Id);

                    // Return a not found response if the user is not found in the database.
                    if (userDb == null)
                        return NotFound();

                    // Return the user object.
                    return Ok(userDb);
                }

                // If the user is not authenticated, return an unauthorized response.
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }
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
                    var userDb = await _context.Users.FindAsync(user.Id);

                    if (user == null)
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
                    userDb.Email = userDto.Email;

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

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
            };

            Debug.WriteLine("1.1");

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            Debug.WriteLine("1.2");
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            Debug.WriteLine("1.3");
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);
            Debug.WriteLine("1.4");
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            Debug.WriteLine("1.5");
            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                Debug.WriteLine("VerifyPasswordHash2");
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}

