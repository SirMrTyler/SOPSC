using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    /// <summary>
    /// Represents a request to add a new user, including personal details, email, and password.
    /// </summary>
    public class UserAddRequest
    {
        /// <summary>
        /// Gets or sets the first name of the user.
        /// </summary>
        /// <remarks>
        /// This property is required and cannot exceed 100 characters.
        /// </remarks>
        [Required]
        [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters.")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name of the user.
        /// </summary>
        /// <remarks>
        /// This property is required and cannot exceed 100 characters.
        /// </remarks>
        [Required]
        [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters.")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the email address of the user.
        /// </summary>
        /// <remarks>
        /// This property is required, must be a valid email address, and cannot exceed 255 characters.
        /// </remarks>
        [Required]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters.")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the agency the user belongs to.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// Gets or sets the Firebase UID associated with the user.
        /// </summary>
        public string? FirebaseUid { get; set; }

        /// <summary>
        /// The Password field for user registration.
        /// </summary>
        /// <remarks>
        /// The password must meet the following criteria:
        /// <list type="bullet">
        ///   <item>Contain at least one uppercase letter</item>
        ///   <item>Contain at least one lowercase letter</item>
        ///   <item>Contain at least one number</item>
        ///   <item>Contain at least one special character (#?!@$%^&*-)</item>
        ///   <item>Be at least 8 characters long</item>
        /// </list>
        /// </remarks>
        [Required]
        [StringLength(100, ErrorMessage = "Password cannot exceed 100 characters.")]
        [RegularExpression("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", ErrorMessage = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-).")]
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the confirmation password.
        /// </summary>
        /// <remarks>
        /// This property must match the <see cref="Password"/> field.
        /// </remarks>
        [Required]
        [StringLength(100, ErrorMessage = "Password confirmation cannot exceed 100 characters.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string PasswordConfirm { get; set; }
    }
}
