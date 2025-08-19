using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    /// <summary>
    /// Represents a request to update an existing user's information.
    /// </summary>
    public class UserUpdateRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }

        public string ProfilePicturePath { get; set; }

        public int RoleId { get; set; }

        public int? AgencyId { get; set; }
    }
}