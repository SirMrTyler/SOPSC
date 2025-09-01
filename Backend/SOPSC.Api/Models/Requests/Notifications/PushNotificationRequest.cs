using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Notifications
{
    /// <summary>
    /// Represents a request to send a push notification to multiple users.
    /// </summary>
    public class PushNotificationRequest
    {
        /// <summary>
        /// User identifiers that should receive the notification.
        /// </summary>
        [Required]
        public List<int> UserIds { get; set; }

        /// <summary>
        /// Title of the push notification.
        /// </summary>
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// Body text of the push notification.
        /// </summary>
        [Required]
        public string Body { get; set; }

        /// <summary>
        /// Optional additional payload.
        /// </summary>
        public object Data { get; set; }
    }
}
