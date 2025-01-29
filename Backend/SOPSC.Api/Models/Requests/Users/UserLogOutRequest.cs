using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    public class UserLogOutRequest
    {
        /// <summary>
        /// The authentication token for the user who is logging out.
        /// </summary>
        [Required]
        [StringLength(255)]
        public string Token { get; set; }

        /// <summary>
        /// The device ID associated with the user's session.
        /// </summary>
        [Required]
        [StringLength(255)]
        public string DeviceId { get; set; }

    }
}
