using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using SOPSC.Api.Models.Requests;
using System.Data;
using SOPSC.Api.Data;
using System.Security.Claims;
using BCrypt.Net;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Models.Requests.Emails;
using SOPSC.Api.Models.Requests.Users;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using SOPSC.Api.Models.Domains.Users;
using SOPSC.Api.Models.Interfaces.Emails;
using SOPSC.Api.Data.Interfaces;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Provides services related to user management, including CRUD operations, login, and authentication.
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IAuthenticationService<int> _authenticationService;
        private readonly IDataProvider _dataProvider;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly string _connectionString;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserService"/> class.
        /// </summary>
        /// <param name="authService">The authentication service for managing user login.</param>
        /// <param name="dataProvider">The data provider for interacting with the database.</param>
        /// <param name="configuration">The application configuration for retrieving the connection string.</param>
        public UserService(
            IAuthenticationService<int> authService, 
            IDataProvider dataProvider, 
            IConfiguration configuration,
            ITokenService tokenService,
            IEmailService emailService)
        {
            _authenticationService = authService;
            _dataProvider = dataProvider;
            _configuration = configuration;
            _tokenService = tokenService;
            _emailService = emailService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

#region CREATE
        
        /// <summary>
        /// Creates a new user in the database.
        /// </summary>
        /// <param name="userModel">The <see cref="UserAddRequest"/> containing user data.</param>
        /// <returns>The ID of the newly created user.</returns>
        public int Create(UserAddRequest userModel)
        {
            int userId = 0;
            string procName = "[dbo].[Users_Insert]";

            string password = userModel.Password;
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@FirstName", userModel.FirstName);
                paramCollection.AddWithValue("@LastName", userModel.LastName);
                paramCollection.AddWithValue("@Email", userModel.Email);
                paramCollection.AddWithValue("@Password", hashedPassword);
                paramCollection.AddWithValue("@IsActive", true);
                paramCollection.AddWithValue("@RoleId", 3);

                SqlParameter idOut = new SqlParameter("@UserId", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                paramCollection.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@UserId"].Value;
                int.TryParse(oId.ToString(), out userId);
            });
            return userId;
        }

#endregion

#region READ
        public async Task LogOutAsync(UserLogOutRequest request)
        {
            if (!string.IsNullOrEmpty(request.Token) && !string.IsNullOrEmpty(request.DeviceId))
            {
                // Delete the token from the database
                _tokenService.DeleteTokenAndDeviceId(request.Token, request.DeviceId);
            }

            await Task.CompletedTask;
        }

        /// <summary>
        /// Logs in a user by validating their credentials and generating a token.
        /// </summary>
        /// <param name="email">The user's email address.</param>
        /// <param name="password">The user's password.</param>
        /// <returns>Returns <c>true</c> if login is successful; otherwise, <c>false</c>.</returns>
        public async Task<string> LogInAsync(string email, string password, string deviceId)
        {
            // Step 1: Get user data from the database (including hashed password)
            UserBase user = null;
            string hashedPassword = null;
            _dataProvider.ExecuteCmd("[dbo].[Users_Select_AuthData]",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Email", email);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    hashedPassword = reader.GetSafeString(startingIndex++);
                    user = new UserBase
                    {
                        UserId = reader.GetSafeInt32(startingIndex++),
                        Name = email
                    };
                });

            // Step 2: Verify the password using BCrypt
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, hashedPassword))
            {
                return null; // Invalid credentials
            }

            // Step 3: Generate a new token for the device
            string newToken = await _authenticationService.GenerateJwtToken(user, deviceId);

            // Step 4: Store the token in the database
            _tokenService.CreateToken(newToken, user.UserId, DateTime.UtcNow.AddDays(7), deviceId);

            // Update `IsActive` to true
            _dataProvider.ExecuteNonQuery("[dbo].[Users_SetIsActive]",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", user.UserId);
                    paramCollection.AddWithValue("@IsActive", true);
                });

            _tokenService.DeleteExpiredTokens(user.UserId);

            return newToken;
        }

        /// <summary>
        /// Retrieves a user by their unique ID.
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve.</param>
        /// <returns>A <see cref="User"/> object containing user details.</returns>
        public User GetById(int userId)
        {
            User user = null;
            string procName = "[dbo].[Users_SelectById]";

            _dataProvider.ExecuteCmd(
                storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection inColl)
                {
                    inColl.AddWithValue("@UserId", userId);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    user = MapSingleUser(reader, ref startingIndex);
                });
            return user;
        }
        public UserWithRole GetUserWithRoleById(int userId)
        {
            UserWithRole thisUser = null;
            string procName = "[dbo].[Users_SelectRoleById]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                thisUser = new UserWithRole
                {
                    UserId = reader.GetSafeInt32(startingIndex++),
                    FirstName = reader.GetSafeString(startingIndex++),
                    LastName = reader.GetSafeString(startingIndex++),
                    Email = reader.GetSafeString(startingIndex++),
                    ProfilePicturePath = reader.GetSafeString(startingIndex++),
                    IsActive = reader.GetSafeBool(startingIndex++),
                    RoleName = reader.GetSafeString(startingIndex++)
                };
            });
            return thisUser;
        }
        /// <summary>
        /// Retrieves all users with pagination support.
        /// </summary>
        /// <param name="pageIndex">The current page index.</param>
        /// <param name="pageSize">The number of users per page.</param>
        /// <returns>A paginated list of users.</returns>
        public Paged<User> GetAllUsers(int pageIndex, int pageSize)
        {
            Paged<User> pagedUserList = null;
            List<User> userList = null;
            int totalCount = 0;
            string procName = "[dbo].[Users_SelectAll]";

            _dataProvider.ExecuteCmd(
                storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection inColl)
                {
                    inColl.AddWithValue("@PageIndex", pageIndex);
                    inColl.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    User user = new User();
                    int startingIndex = 0;
                    user = MapSingleUser(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (userList == null)
                        userList = new List<User>();
                    userList.Add(user);
                });

            if (userList != null && userList.Count > 0)
                pagedUserList = new Paged<User>(userList, pageIndex, pageSize, totalCount);

            return pagedUserList;
        }
#endregion

#region UPDATE

        public void ConfirmUser(int userId)
        {
            string procName = "[dbo].[Users_Confirm]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
            }, null);
        }

        /// <summary>
        /// Updates the active status of a user by their ID.
        /// </summary>
        /// <param name="userId">The ID of the user to update.</param>
        public void UpdateActiveStatus(int userId)
        {
            string procName = "[dbo].[Users_UpdateIsActive]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
            }, null);
        }

        #endregion

#region DELETE

#endregion

#region Private Methods

        /// <summary>Generates a JWT for the specified user.</summary>
        /// <returns>The generated JWT as a string.</returns>
        /// <param name="userId">The ID of the user for whom the token is generated.</param>
        /// <param name="isNonExpiring">Whether the token should expire.</param>
        public string CreateJwt(int userId, bool isNonExpiring = false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);

            // Define the token descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        }),
                Expires = isNonExpiring ? (DateTime?)null : DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JWT:ExpiryMinutes"])),
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            // Create and write the token
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
        public void UserAccountValidation(int id, UserAddRequest newUser, string requestUrl, bool isNonExpiring = false)
        {
            string guid = Guid.NewGuid().ToString();
            string deviceId = "DefaultDevice";

            // Set an expiry date for the token
            DateTime? expiryDate = isNonExpiring ? null : DateTime.UtcNow.AddDays(14);

            _tokenService.CreateToken(guid, id, expiryDate, deviceId);

            SendEmailRequest firstEmail = new SendEmailRequest()
            {
                To = new EmailInfo()
                {
                    Email = newUser.Email,
                    Name = $"{newUser.FirstName} {newUser.LastName}"
                },
                Subject = "Account Confirmation"
            };
            string confirmationUrl = $"{requestUrl}confirm?token={guid}";

            _emailService.NewUserEmail(firstEmail, confirmationUrl);
        }

        /// <summary>
        /// Maps a data reader to a <see cref="User"/> object.
        /// </summary>
        private static User MapSingleUser(IDataReader reader, ref int startingIndex)
        {
            User user = new User
            {
                UserId = reader.GetSafeInt32(startingIndex++),
                FirstName = reader.GetSafeString(startingIndex++),
                LastName = reader.GetSafeString(startingIndex++),
                Email = reader.GetSafeString(startingIndex++),
                DateCreated = reader.GetSafeDateTime(startingIndex++),
                LastLoginDate = reader.GetSafeDateTimeNullable(startingIndex++),
                ProfilePicturePath = reader.GetSafeString(startingIndex++),
                IsActive = reader.GetSafeBool(startingIndex++),
                HoursServed = reader.GetSafeDecimal(startingIndex++),
                RoleId = reader.GetSafeInt32(startingIndex++)
            };

            return user;
        }

        private IUserAuthData Get(string email, string password)
        {
            UserBase user = null;
            string passwordFromDb = "";
            string procName = "[dbo].[Users_Select_AuthData]";
            List<string> roles = new List<string>();

            bool userConfirmed = false;
            _dataProvider.ExecuteCmd(
                storedProc: procName,
                inputParamMapper: delegate (SqlParameterCollection inColl)
                {
                    inColl.AddWithValue("@Email", email);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    switch (set)
                    {
                        case (0):
                            passwordFromDb = reader.GetSafeString(startingIndex++);

                            user = new UserBase
                            {
                                UserId = reader.GetSafeInt32(startingIndex++),
                                Name = email
                            };
                            break;
                        case (1):
                            roles.Add(reader.GetSafeString(startingIndex++));
                            break;
                    }
                });
            return user;
        }

#endregion
    }
}
