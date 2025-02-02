using Microsoft.Data.SqlClient;
using System.Data;
using SOPSC.Api.Models.Requests.Users;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Data.Interfaces;

namespace SOPSC.Api.Services.Auth
{
    public class TokenService :ITokenService
    {
        private readonly IAuthenticationService<int> _authenticationService;
        private readonly IDataProvider _dataProvider;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        public TokenService(
            IAuthenticationService<int> authService,
            IDataProvider dataProvider,
            IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _authenticationService = authService;
            _dataProvider = dataProvider;
        }
        public void CreateToken(string token, int userId, DateTime? expiryDate, string deviceId, bool isNonExpiring = false)
        {
            string procName = "[dbo].[UserTokens_Insert]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
                paramCollection.AddWithValue("@Token", token);
                paramCollection.AddWithValue("@DeviceId", deviceId);
                paramCollection.AddWithValue("@ExpiryDate", expiryDate);
                paramCollection.AddWithValue("@IsNonExpiring", isNonExpiring);
            });
        }
        public UserToken GetTokenByDeviceId(string deviceId)
        {
            UserToken token = null;
            string procName = "[dbo].[UserTokens_SelectByDeviceId]";
            _dataProvider.ExecuteCmd(
                storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection inputParamCollection)
                {
                    inputParamCollection.AddWithValue("@DeviceId", deviceId);
                }, delegate (IDataReader reader, short set)
                {
                    token = new UserToken
                    {
                        TokenId = reader.GetSafeInt32(0),
                        UserId = reader.GetSafeInt32(1),
                        Token = reader.GetSafeString(2),
                        DeviceId = reader.GetSafeString(3),
                        ExpiryDate = reader.GetSafeDateTimeNullable(4),
                        IsNonExpiring = reader.GetSafeBool(6)
                    };
                });
            return token;
        }
        public UserToken GetTokenByUserId(int userId)
        {
            UserToken validToken = null;
            string procName = "[dbo].[UserTokens_SelectValidByUserId]";

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
                paramCollection.AddWithValue("@CurrentDate", DateTime.UtcNow);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                validToken = new UserToken
                {
                    TokenId = reader.GetSafeInt32(startingIndex++),
                    UserId = reader.GetSafeInt32(startingIndex++),
                    Token = reader.GetSafeString(startingIndex++),
                    DateCreated = reader.GetSafeDateTime(startingIndex++),
                    ExpiryDate = reader.GetSafeDateTimeNullable(startingIndex++),
                    IsNonExpiring = reader.GetSafeBool(startingIndex++)
                };
            });
            return validToken;
        }
        public UserToken GetTokenByToken(string token)
        {
            UserToken thisToken = new UserToken();
            string procName = "[dbo].[UserTokens_SelectByToken]";
            
            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Token", token);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                thisToken.TokenId = reader.GetSafeInt32(startingIndex++);
                thisToken.UserId = reader.GetSafeInt32(startingIndex++);
                thisToken.Token = reader.GetSafeString(startingIndex++);
                thisToken.DeviceId = reader.GetSafeString(startingIndex++);
                thisToken.ExpiryDate = reader.GetSafeDateTimeNullable(startingIndex++);
            });
            Console.WriteLine($"[TokenService: 116] Token: {thisToken.Token}");
            return thisToken;
        }
        public void UpdateTokenExpiry(string token, DateTime? newExpiryDate)
        {
            string procName = "[dbo].[UserTokens_UpdateExpiryByToken]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Token", token);
                paramCollection.AddWithValue("@ExpiryDate", newExpiryDate);
            });
        }
        public void DeleteUnneededTokens(int userId)
        {
            string procName = "[dbo].[UserTokens_DeleteOldTokensByUserId]";
            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
            });
        }

        public void DeleteTokenAndDeviceId(string token, string deviceId)
        {
            token = token.Trim();
            deviceId = deviceId.Trim();

            string procName = "[dbo].[UserTokens_DeleteByTokenAndDeviceId]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.Add("@Token", SqlDbType.NVarChar, -1).Value = token;
                paramCollection.Add("@DeviceId", SqlDbType.NVarChar, -1).Value = deviceId;
            });
        }
        public void DeleteTokenByToken(string token)
        {
            string procName = "[dbo].[UserTokens_DeleteByToken]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Token", token);
            }, null);
        }
        public void DeleteExpiredTokens(int userId)
        {
            string procName = "[dbo].[UserTokens_DeleteExpiredByUserId]";
            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
                paramCollection.AddWithValue("@CurrentDate", DateTime.UtcNow);
            });
        }
    }
}
