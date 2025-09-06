using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Services
{
    public interface IDevicesService
    {
        Task UpsertAsync(int userId, string deviceId, string platform, string expoPushToken);
        Task<IEnumerable<string>> ListExpoTokensAsync(int[] userIds);
    }
}
