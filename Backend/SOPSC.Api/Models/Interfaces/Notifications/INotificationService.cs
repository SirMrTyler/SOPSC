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
    }
}
