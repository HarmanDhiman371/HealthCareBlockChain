using HealthcareAPI.Data;
using HealthcareAPI.Models;
using HealthcareAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HealthcareAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly BlockchainService _blockchainService;

        public AuthController(ApplicationDbContext context, IConfiguration config, BlockchainService blockchainService)
        {
            _context = context;
            _config = config;
            _blockchainService = blockchainService;
        }

        public class RegisterDto
        {
            public required string FullName { get; set; }
            public required string Email { get; set; }
            public required string Password { get; set; }
            public required string Role { get; set; }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest("User already exists.");

            var wallet = _blockchainService.GenerateWallet();
            await _blockchainService.FundAccountAsync(wallet.Address); // Give them some ETH for tx

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                WalletAddress = wallet.Address,
                WalletPrivateKey = wallet.PrivateKey
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful", walletAddress = wallet.Address });
        }

        public class LoginDto
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto request)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new { 
                token = tokenHandler.WriteToken(token), 
                id = user.Id, 
                fullName = user.FullName,
                role = user.Role, 
                walletAddress = user.WalletAddress 
            });
        }
    }
}
