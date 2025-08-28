using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    public class UserLogInRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters.")]
        public string Email { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "Password cannot exceed 100 characters.")]
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the Firebase UID associated with the user.
        /// </summary>
        public string? FirebaseUid { get; set; }
    }
}
