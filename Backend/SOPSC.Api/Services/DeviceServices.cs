using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Services
{
    public class DevicesService : IDevicesService
    {
        public Task UpsertAsync(int userId, string deviceId, string platform, string expoPushToken)
        {
            // TODO: Persist device registration
            return Task.CompletedTask;
        }
        public Task<IEnumerable<string>> ListExpoTokensAsync(int[] userIds)
        {
            // TODO: Retrieve Expo push tokens for the given users
            return Task.FromResult<IEnumerable<string>>(Array.Empty<string>());
        }
    }
}
