using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Notifications
{
    /// <summary>
    /// Provides methods for sending push notifications via Expo and checking delivery receipts.
    /// </summary>
    public interface IExpoPushService
    {
        /// <summary>
        /// Sends a push notification to the specified users.
        /// </summary>
        /// <param name="userIds">Identifiers of users to notify.</param>
        /// <param name="title">Notification title.</param>
        /// <param name="body">Notification body message.</param>
        /// <param name="data">Optional additional data payload.</param>
        /// <returns>List of push ticket identifiers returned by Expo.</returns>
        Task<List<string>> SendPushNotificationsAsync(IEnumerable<int> userIds, string title, string body, object data = null);

        /// <summary>
        /// Checks the delivery receipts for the provided ticket identifiers.
        /// </summary>
        /// <param name="ticketIds">Ticket identifiers to check.</param>
        Task CheckReceiptsAsync(IEnumerable<string> ticketIds);
    }
}
