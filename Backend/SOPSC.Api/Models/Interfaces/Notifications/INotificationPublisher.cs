using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Notifications
{
    /// <summary>
    /// Publishes notifications to users.
    /// </summary>
    public interface INotificationPublisher
    {
        /// <summary>
        /// Publishes a notification to the specified users.
        /// </summary>
        /// <param name="userIds">Identifiers of users to notify.</param>
        /// <param name="title">Notification title.</param>
        /// <param name="body">Notification body message.</param>
        /// <param name="data">Additional data payload.</param>
        Task PublishAsync(IEnumerable<int> userIds, string title, string body, object data);
    }
}
