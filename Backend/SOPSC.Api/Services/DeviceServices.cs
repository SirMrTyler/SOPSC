using System.Collections.Generic;
using System.Threading.Tasks;
using SOPSC.Api.Data.Interfaces;

namespace SOPSC.Api.Services
{
    public class DevicesService : IDevicesService
    {
        private readonly IDataProvider _data;

        public DevicesService(IDataProvider data)
        {
            _data = data;
        }

        public Task UpsertAsync(int userId, string deviceId, string platform, string expoPushToken)
        {
            const string procName = "[dbo].[UserDevices_Upsert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@DeviceId", deviceId);
                    param.AddWithValue("@Platform", platform);
                    param.AddWithValue("@ExpoPushToken", expoPushToken);
                });
            return Task.CompletedTask;
        }

        public Task<IEnumerable<string>> ListExpoTokensAsync(int[] userIds)
        {
            List<string> tokens = null;
            const string procName = "[dbo].[UserDevices_SelectTokensByUserIds]";
            _data.ExecuteCmd(procName,
                param => param.AddWithValue("@UserIds", string.Join(",", userIds)),
                (reader, set) =>
                {
                    string token = reader.GetSafeString(0);
                    if (!string.IsNullOrWhiteSpace(token))
                    {
                        tokens ??= new List<string>();
                        tokens.Add(token);
                    }
                });
            return Task.FromResult<IEnumerable<string>>(tokens ?? Array.Empty<string>());
        }
    }
}
