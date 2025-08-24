using Microsoft.IdentityModel.Tokens;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Models.Domains.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Data;
using System.Security.Claims;
using System.Text;
using Microsoft.Data.SqlClient;
using SOPSC.Api.Data.Interfaces;

namespace SOPSC.Api.Services.Auth
{
    /// <summary>
    /// Provides authentication services, such as generating JWT tokens and managing user sessions.
    /// Implements <see cref="IAuthenticationService{T}"/> with <c>int</c> as the user identifier type.
    /// </summary>
    public class AuthenticationService : IAuthenticationService<int>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly IDataProvider _dataProvider;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationService"/> class.
        /// </summary>
        /// <param name="httpContextAccessor">Provides access to the current HTTP context.</param>
        /// <param name="configuration">Provides application configuration values.</param>
        public AuthenticationService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, IDataProvider dataProvider)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _dataProvider = dataProvider;
        }

        /// <summary>
        /// Generates a JWT token for the given user with the claims "NameIdentifier, Name, and Roles". Based on user.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <param name="user"></param>
        /// <param name="extraClaims"></param>
        /// <returns>JSON Web Token as a string</returns>
        /// <exception cref="ArgumentNullException"></exception>
        public async Task<string> GenerateJwtToken(IUserAuthData user, string deviceId, params Claim[] extraClaims)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            // Define user the claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
            };

            // Include roles
            if (user.Roles != null)
            {
                foreach (var role in user.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            // Add extra claims
            if (extraClaims != null && extraClaims.Length > 0)
            {
                claims.AddRange(extraClaims);
            }

            // Generate signing credentials
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create token descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            // Generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Return the token as a string
            return await Task.FromResult(tokenHandler.WriteToken(token));
        }

        /// <summary>
        /// Validates the provided JWT and returns the claims principal.
        /// </summary>
        /// <param name="token">The JWT to validate.</param>
        /// <returns>The <see cref="ClaimsPrincipal"/> extracted from the token.</returns>
        /// <exception cref="SecurityTokenException">Thrown when validation fails.</exception>
        public ClaimsPrincipal ValidateToken(string token)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }

        /// <summary>
        /// Checks if current user is logged in by validating the Authorization header token.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        public bool IsLoggedIn()
        {
            var authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return false;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var tokenHandler = new JwtSecurityTokenHandler();

                // Validate the token
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    IssuerSigningKey = key
                }, out var validatedToken);

                // Check the DeviceId claim
                var deviceIdClaim = principal.FindFirst("DeviceId")?.Value;
                if (string.IsNullOrEmpty(deviceIdClaim))
                {
                    return false;
                }

                // Verify the token is valid in the database
                return IsTokenValid(deviceIdClaim);
            }
            catch (Exception ex)
            {
                return false;
            }
            return false;
        }
        private bool IsTokenValid(string deviceId)
        {
            bool isValid = false;
            string procName = "[dbo].[UserTokens_SelectByDeviceId]";

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@DeviceId", deviceId);
            }, delegate (IDataReader reader, short set)
            {
                isValid = true; // Token is valid if the query returns a result
            });
            return isValid;
        }

        /// <summary>
        /// Gets the current user from the HttpContextAccessor.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        public IUserAuthData GetCurrentUser()
        {
            var claims = _httpContextAccessor.HttpContext.User;
            if (claims.Identity != null && claims.Identity.IsAuthenticated)
            {
                var userIdClaim = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var name = claims.Identity.Name;

                // Extract all role claims
                var roles = claims.FindAll(ClaimTypes.Role)
                                  .Select(r => r.Value)
                                  .ToList();
                if (int.TryParse(userIdClaim, out int userId))
                {
                    return new UserBase
                    {
                        UserId = userId,
                        Name = claims.Identity.Name,
                        Roles = roles
                    };
                }
            }
            return null;
        }

        /// <summary>
        /// Retrieves the current user's ID.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        public int GetCurrentUserId()
        {
            var user = GetCurrentUser();
            return user?.UserId ?? 0;
        }
    }
}