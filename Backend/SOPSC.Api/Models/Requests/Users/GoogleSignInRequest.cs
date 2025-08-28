using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    public class GoogleSignInRequest
    {
        [Required]
        public string IdToken { get; set; }

        // Optional: if app wants to pass deviceId (else we will generate one)
        public string? DeviceId { get; set; }

        // Optional phone number to associate with the user
        public string? Phone { get; set; }

        // Optional FIrebase UID provided by client for cross-platform linking
        public string? FirebaseUid { get; set; }
    }
}
