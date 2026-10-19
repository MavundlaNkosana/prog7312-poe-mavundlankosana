using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace SmartX.Server.Controllers
{
    public class AuthRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
              private static readonly ConcurrentDictionary<string, string> _userDatabase = new ConcurrentDictionary<string, string>();
        private static readonly ConcurrentDictionary<string, string> _activeSessions = new ConcurrentDictionary<string, string>();

        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthRequest req)
        {
            if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
                return BadRequest(new { message = "Operator ID and passcode are required." });

            if (_userDatabase.ContainsKey(req.Username))
                return BadRequest(new { message = "Operator ID already exists." });

            // No raw passwords stored. Generate a secure salt and use PBKDF2 to hash the password before saving it.
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            using (var pbkdf2 = new Rfc2898DeriveBytes(req.Password, salt, 100000, HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(20);
                byte[] hashBytes = new byte[36];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 20);

                string savedPasswordHash = Convert.ToBase64String(hashBytes);
                _userDatabase[req.Username] = savedPasswordHash;
            }

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequest req)
        {
            // Verify if user exists
            if (!_userDatabase.TryGetValue(req.Username, out string savedHash))
                return Unauthorized(new { message = "Invalid credentials." });

            // Extract the salt from the stored hash string
            byte[] hashBytes = Convert.FromBase64String(savedHash);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Compute the hash of the provided password using the same salt
            using (var pbkdf2 = new Rfc2898DeriveBytes(req.Password, salt, 100000, HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(20);

                // Compare byte by byte
                for (int i = 0; i < 20; i++)
                {
                    if (hashBytes[i + 16] != hash[i])
                        return Unauthorized(new { message = "Invalid credentials." });
                }
            }

            // Generate a highly secure, cryptographic session token
            byte[] tokenBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            string secureToken = Convert.ToBase64String(tokenBytes);

            // Store the active session
            _activeSessions[secureToken] = req.Username;

            return Ok(new { token = secureToken, username = req.Username });
        }
    }
}