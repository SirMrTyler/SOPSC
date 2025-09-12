using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Interfaces.Notifications;
using System.Data;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Service responsible for persisting notification tokens.
    /// </summary>
    public class NotificationService : INotificationService
    {
        private readonly IDataProvider _data;

        public NotificationService(IDataProvider data)
        {
            _data = data;
        }

        /// <inheritdoc />
        public void SaveNotificationToken(int userId, string expoPushToken, string deviceToken, string platform)
        {
            string procName = "[dbo].[NotificationTokens_Upsert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@ExpoPushToken", (object)expoPushToken ?? DBNull.Value);
                    param.AddWithValue("@DeviceToken", (object)deviceToken ?? DBNull.Value);
                    param.AddWithValue("@Platform", platform);
                });
        }

        /// <inheritdoc />
        public void AddNotification(int notificationTypeId, int userId, string content, int? messageId = null)
        {
            string procName = "[dbo].[Notifications_Insert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@NotificationTypeId", notificationTypeId);
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@NotificationContent", (object)content ?? DBNull.Value);
                    param.AddWithValue("@MessageId", (object)messageId ?? DBNull.Value);

                    SqlParameter idOut = new SqlParameter("@NotificationId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    param.Add(idOut);
                });
        }
    }
}
