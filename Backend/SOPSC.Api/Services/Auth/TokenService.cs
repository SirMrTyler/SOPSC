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
        
        public void CreateToken(string token, int userId, string deviceId)
        {
            string procName = "[dbo].[UserTokens_Insert]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
                paramCollection.AddWithValue("@Token", token);
                paramCollection.AddWithValue("@DeviceId", deviceId);
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
                        DateCreated = reader.GetSafeDateTime(4)
                    };
                });
            return token;
        }

        public UserToken GetTokenByToken(string token)
        {
            UserToken thisToken = null;
            string procName = "[dbo].[UserTokens_SelectByToken]";
            
            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Token", token);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                thisToken = new UserToken
                {
                    TokenId = reader.GetSafeInt32(startingIndex++),
                    UserId = reader.GetSafeInt32(startingIndex++),
                    Token = reader.GetSafeString(startingIndex++),
                    DeviceId = reader.GetSafeString(startingIndex++),
                    DateCreated = reader.GetSafeDateTime(startingIndex++)
                };
            });
            return thisToken;
        }

        public void DeleteTokenAndDeviceId(string token, string deviceId)
        {
            string procName = "[dbo].[UserTokens_DeleteByTokenAndDeviceId]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Token", token);
                paramCollection.AddWithValue("@DeviceId", deviceId);
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
    }
}
