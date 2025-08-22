using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Interfaces.Notifications;

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
    }
}
