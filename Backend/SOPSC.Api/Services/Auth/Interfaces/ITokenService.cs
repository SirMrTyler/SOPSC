using SOPSC.Api.Models.Requests.Users;

namespace SOPSC.Api.Services.Auth.Interfaces
{
    public interface ITokenService
    {
        void CreateToken(string token, int userId, string deviceId);
        UserToken GetTokenByDeviceId(string deviceId);
        UserToken GetTokenByToken(string token);
        void DeleteTokenAndDeviceId(string token, string deviceId);
        void DeleteTokenByToken(string token);
    }
}
