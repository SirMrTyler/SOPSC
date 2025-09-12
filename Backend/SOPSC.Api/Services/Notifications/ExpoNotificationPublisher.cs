using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SOPSC.Api.Models.Interfaces.Notifications;

namespace SOPSC.Api.Services.Notifications
{
    /// <summary>
    /// Notification publisher that delegates to the Expo push service.
    /// </summary>
    public class ExpoNotificationPublisher : INotificationPublisher
    {
        private readonly IExpoPushService _expoPushService;
        private readonly ILogger<ExpoNotificationPublisher> _logger;

        public ExpoNotificationPublisher(IExpoPushService expoPushService, ILogger<ExpoNotificationPublisher> logger)
        {
            _expoPushService = expoPushService;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task PublishAsync(IEnumerable<int> userIds, string title, string body, object data)
        {
            try
            {
                await _expoPushService.SendPushNotificationsAsync(userIds, title, body, data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send push notification");
            }
        }
    }
}
