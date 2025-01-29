using SOPSC.Api.Services.Auth.Interfaces;
using System.Collections.Generic;

namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents the base user data for authentication and authorization purposes.
    /// Implements the <see cref="IUserAuthData"/> interface.
    /// </summary>
    public class UserBase : IUserAuthData
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <remarks>
        /// This is typically the user's full name or display name.
        /// </remarks>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the roles assigned to the user.
        /// </summary>
        /// <remarks>
        /// Roles determine the user's permissions and access levels within the system.
        /// </remarks>
        public IEnumerable<string> Roles { get; set; }
    }
}
