namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents a base user within the application.
    /// </summary>
    public class BaseUser
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the email address of the user.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the password of the user.
        /// </summary>
        /// <remarks>
        /// Ensure passwords are stored securely using hashing algorithms.
        /// </remarks>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the first name of the user.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name of the user.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the file path to the user's profile picture.
        /// </summary>
        public string ProfilePicturePath { get; set; }

        /// <summary>
        /// Gets or sets the role identifier associated with the user.
        /// </summary>
        /// <remarks>
        /// The <c>RoleId</c> determines the user's access level or permissions within the system.
        /// </remarks>
        public int RoleId { get; set; }
    }
}
