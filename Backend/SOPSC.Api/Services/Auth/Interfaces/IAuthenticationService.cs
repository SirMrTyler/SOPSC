using System.Security.Claims;

namespace SOPSC.Api.Services.Auth.Interfaces
{
    public interface IAuthenticationService<T> : IIdentityProvider<T>
    {
        /// <summary>Generates a JWT token for the given user with the claims "NameIdentifier, Name, and Roles". Based on user.</summary>
        /// <remarks>Definition Location: SOPSC.Api.Services.Auth</remarks>
        /// <param name="user"></param><param name="extraClaims"></param>
        /// <returns>JSON Web Token as a string</returns>
        /// <exception cref="ArgumentNullException"></exception>
        Task<string> GenerateJwtToken(IUserAuthData user, string deviceId, params Claim[] extraCliams);

        /// <summary>
        /// Checks if the user is logged in by checking if the JWT token is present in the request cookies.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        /// 
        bool IsLoggedIn();
        /// <summary>
        /// Gets the current user from the JWT token in the request cookies.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        IUserAuthData GetCurrentUser();
    }
}
