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

        /// <summary>Logs in the user by generating a JWT token and adding it to the response cookies. Expires in 7 days.</summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <param name="user"></param>
        /// <param name="extraClaims"></param>
        /// <returns>No Return Value</returns>
        Task LogInAsync(IUserAuthData user, string deviceId, params Claim[] extraClaims);

        /// <summary>
        /// Logs out the user by removing the JWT token from the response cookies.
        /// </summary>
        /// <remarks>
        /// Definition Location: SOPSC.Api.Services.Auth
        /// </remarks>
        /// <returns></returns>
        Task LogOutAsync();

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
