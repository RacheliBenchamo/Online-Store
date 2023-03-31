using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
            if (await UserExists(userDto.Email))
            {
                return BadRequest("Email already exists");
            }

            CreatePasswordHash(userDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.IsAdmin = false;
            user.Email = userDto.Email.ToLower();
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(IUserLogin userLogin)
        {
            if (!await UserExists(userLogin.Email))
            {
                return BadRequest("Email does not exists");
            }

            if (!VerifyPasswordHash(userLogin.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            string token = CreateToken(user);

            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken);

            return Ok(token);
        }

        [HttpGet("")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser()
        {
            var auth = CheckToken();

            if (auth != null)
            {
                var userDb = await _context.Products.FindAsync(user.Id);
                if (userDb == null)
                    return NotFound();

                return Ok(userDb);
            }
            return Unauthorized();
        }

        [HttpPut("{userDto}")]
        [Authorize]
        public async Task<ActionResult<User>> UpdateUser(UserDto userDto)
        {
            var auth = CheckToken();

            if (auth != null)
            {
                var userDb = await _context.Users.FindAsync(user.Id);

                if (user == null)
                {
                    return NotFound();
                }
                if(userDto == null)
                {
                    return BadRequest("User have to be no null");
                }
                userDb.FirstName = userDto.FirstName;
                userDb.LastName = userDto.LastName;
                userDb.Email = userDto.Email;

                await _context.SaveChangesAsync();

                return Ok(userDb);
            }
            return Unauthorized();           
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
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email.ToLower());
        }

        public string CheckToken()
        {
            var auth = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                auth = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            }
            return auth;
        }
    }
}

