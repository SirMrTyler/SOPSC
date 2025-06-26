using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Users;
using SOPSC.Api.Models.Requests;
using SOPSC.Api.Models.Requests.Users;

namespace SOPSC.Api.Models.Interfaces.Users
{
    /// <summary>
    /// Provides methods for managing and retrieving user-related data.
    /// </summary>
    public interface IUserService
    {
        int Create(UserAddRequest userModel);
        
        /// <summary>
        /// Retrieves a user by their unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the user.</param>
        /// <returns>
        /// Returns a <see cref="User"/> object representing the user with the specified ID.
        /// If the user is not found, returns <c>null</c>.
        /// </returns>
        User GetById(int id);

        /// <summary>
        /// Retrieves a paginated list of users.
        /// </summary>
        /// <param name="pageIndex">The index of the current page (zero-based).</param>
        /// <param name="pageSize">The number of users to include per page.</param>
        /// <returns>
        /// Returns a <see cref="Paged{User}"/> object containing the paginated list of users
        /// along with pagination metadata.
        /// </returns>
        Paged<User> GetAllUsers(int pageIndex, int pageSize);
        int GoogleSignIn(GoogleSignInRequest model, out string token, out string deviceId);
        Task<string> LogInAsync(string email, string password, string? deviceId);
        Task LogOutAsync(UserLogOutRequest request);
        void ConfirmUser(int userId);
        void UserAccountValidation(int id, UserAddRequest newUser, string requestUrl);

        UserWithRole GetUserWithRoleById(int userId);

        /// <summary>
        /// Checks whether a user account is configured for Google sign in only.
        /// </summary>
        /// <param name="email">User email to check.</param>
        /// <returns><c>true</c> if the user must authenticate with Google.</returns>
        bool IsGoogleUser(string email);
    }
}
