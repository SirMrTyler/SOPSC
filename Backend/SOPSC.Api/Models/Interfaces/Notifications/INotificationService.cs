namespace SOPSC.Api.Models.Interfaces.Notifications
{
    /// <summary>
    /// Provides methods for managing notification tokens.
    /// </summary>
    public interface INotificationService
    {
        /// <summary>
        /// Saves or updates a notification token for a user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="expoPushToken">Expo push token value.</param>
        /// <param name="deviceToken">Native device token.</param>
        /// <param name="platform">Platform of the device.</param>
        void SaveNotificationToken(int userId, string expoPushToken, string deviceToken, string platform);

        /// <summary>
        /// Adds a notification for a user.
        /// </summary>
        /// <param name="notificationTypeId">Type of notification.</param>
        /// <param name="userId">The user identifier.</param>
        /// <param name="content">Notification content.</param>
        /// <param name="messageId">Optional message identifier.</param>
        void AddNotification(int notificationTypeId, int userId, string content, int? messageId = null);
    }
}
