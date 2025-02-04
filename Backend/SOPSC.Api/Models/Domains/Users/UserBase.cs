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
        // Gets or sets the unique identifier for the user.
        public int UserId { get; set; }

        // Gets or sets the name of the user.
        public string Name { get; set; }

        // Gets or sets the roles assigned to the user.
        public IEnumerable<string> Roles { get; set; }
    }
}
