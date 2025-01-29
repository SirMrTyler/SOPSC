using SOPSC.Api.Models.Requests.Users;

namespace SOPSC.Api.Services.Auth.Interfaces
{
    public interface ITokenService
    {
        void CreateToken(string token, int userId, DateTime? expiryDate, string deviceId, bool isNonExpiring = false);
        UserToken GetTokenByDeviceId(string deviceId);
        UserToken GetTokenByUserId(int userId);
        UserToken GetTokenByToken(string token);
        void DeleteTokenAndDeviceId(string token, string deviceId);
        void DeleteTokenByToken(string token);
        void DeleteExpiredTokens(int userId);
    }
}
