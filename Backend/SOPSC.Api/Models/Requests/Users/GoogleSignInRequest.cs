using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    public class GoogleSignInRequest
    {
        [Required]
        public string IdToken { get; set; }

        // Optional: if app wants to pass deviceId (else we will generate one)
        public string? DeviceId { get; set; }

        public string? Phone { get; set; }

        public string? FirebaseUid { get; set; }
    }
}
