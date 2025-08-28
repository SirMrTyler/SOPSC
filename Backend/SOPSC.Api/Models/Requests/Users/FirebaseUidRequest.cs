using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Users
{
    public class FirebaseUidRequest
    {
        [Required]
        public string FirebaseUid { get; set; }
    }
}