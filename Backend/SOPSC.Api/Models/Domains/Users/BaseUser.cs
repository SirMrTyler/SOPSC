namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents a base user within the application.
    /// </summary>
    public class BaseUser
    {
        // Gets or sets the unique identifier for the user.
        public int UserId { get; set; }

        // Gets or sets the email address of the user.
        public string Email { get; set; }

        // Gets or sets the phone number of the user.
        public string Phone { get; set; }

        // Gets or sets the password of the user.
        public string Password { get; set; }

        // Gets or sets the first name of the user.
        public string FirstName { get; set; }

        // Gets or sets the last name of the user.
        public string LastName { get; set; }

        // Gets or sets the file path to the user's profile picture.
        public string ProfilePicturePath { get; set; }

        // Gets or sets the role identifier associated with the user.
        public int RoleId { get; set; }
    }
}
