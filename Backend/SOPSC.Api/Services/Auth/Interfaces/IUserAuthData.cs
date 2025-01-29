using System.Collections.Generic;

namespace SOPSC.Api.Services.Auth.Interfaces
{
    /// <summary>
    /// Represents the authentication data for a user.
    /// </summary>
    public interface IUserAuthData
    {
        /// <summary>
        /// Gets or sets the unique identifier of the user.
        /// </summary>
        int UserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        string Name { get; set; }

        /// <summary>
        /// Gets or sets the roles associated with the user.
        /// </summary>
        /// <remarks>
        /// Roles are typically represented as a collection of role names or identifiers.
        /// </remarks>
        IEnumerable<string> Roles { get; set; }
    }
}
