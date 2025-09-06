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
    }
}
