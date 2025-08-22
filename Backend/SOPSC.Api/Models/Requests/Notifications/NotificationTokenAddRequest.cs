using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Notifications
{
    /// <summary>
    /// Represents a request to save a push notification token.
    /// </summary>
    public class NotificationTokenAddRequest
    {
        /// <summary>
        /// Expo push token provided by the client.
        /// </summary>
        public string ExpoPushToken { get; set; }

        /// <summary>
        /// Native device token provided by the client.
        /// </summary>
        public string DeviceToken { get; set; }

        /// <summary>
        /// Platform of the device submitting the token.
        /// </summary>
        [Required]
        public string Platform { get; set; }
    }
}
