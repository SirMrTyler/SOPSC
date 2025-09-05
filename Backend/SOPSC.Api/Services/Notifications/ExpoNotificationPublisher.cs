using System.Collections.Generic;
using System.Threading.Tasks;
using SOPSC.Api.Models.Interfaces.Notifications;

namespace SOPSC.Api.Services.Notifications
{
    /// <summary>
    /// Notification publisher that delegates to the Expo push service.
    /// </summary>
    public class ExpoNotificationPublisher : INotificationPublisher
    {
        private readonly IExpoPushService _expoPushService;

        public ExpoNotificationPublisher(IExpoPushService expoPushService)
        {
            _expoPushService = expoPushService;
        }

        /// <inheritdoc />
        public async Task PublishAsync(IEnumerable<int> userIds, string title, string body, object data)
        {
            await _expoPushService.SendPushNotificationsAsync(userIds, title, body, data);
        }
    }
}
