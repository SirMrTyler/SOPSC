using Microsoft.Data.SqlClient;
using System.Data;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Models.Requests.Emails;
using SOPSC.Api.Models.Requests.Users;
using SOPSC.Api.Models.Domains.Users;
using SOPSC.Api.Models.Interfaces.Emails;
using SOPSC.Api.Data.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<UserService> _logger;

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
            IEmailService emailService,
            ILogger<UserService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _authenticationService = authService;
            _dataProvider = dataProvider;
            _configuration = configuration;
            _tokenService = tokenService;
            _emailService = emailService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

#region CREATE
        public async Task<string> LogInAsync(string email, string password, string? deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                return "Device ID is required.";
            }

            // Step 1: Get user data from the database (including hashed password)
            UserToken existingToken = _tokenService.GetTokenByDeviceId(deviceId);
            
            if (existingToken != null)
            {
                // Ensure the token is still valid in the database
                UserToken checkToken = _tokenService.GetTokenByToken(existingToken.Token);

                if (checkToken != null)
                {
                    return "Already logged in"; // Token is still valid, deny login
                }
                else
                {
                    // The token is invalid but still in memory, remove it
                    _tokenService.DeleteTokenAndDeviceId(existingToken.Token, deviceId);
                }
            }

            // Step 2: Authenticate user credentials
            UserBase user = null;
            string hashedPassword = null;
            int roleId = 3;

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
                    roleId = reader.GetSafeInt32(startingIndex++);
                });

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, hashedPassword))
            {
                return null; // Invalid credentials
            }

            // Map RoleId -> RoleName
            string roleName = roleId switch
            {
                1 => "Developer",
                2 => "Admin",
                3 => "Member",
                4 => "Guest",
                _ => "Guest"
            };

            user.Roles = new List<string> { roleName };

            // Step 3: Generate a new token for the device
            string newToken = await _authenticationService.GenerateJwtToken(user, deviceId);

            // Step 4: Store the token in the database
            _tokenService.CreateToken(newToken, user.UserId, deviceId);

            // Update `IsActive` to true
            SetActiveStatus(true, user.UserId, _dataProvider);

            return newToken;
        }

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
                paramCollection.AddWithValue("@RoleId", 4);
                paramCollection.AddWithValue("@AgencyId", (object?)userModel.AgencyId ?? DBNull.Value);

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

        public int GoogleSignIn(GoogleSignInRequest model, out string token, out string deviceId)
        {
            _logger.LogInformation($"GoogleSignIn request: {JsonConvert.SerializeObject(model)}");

            int userId = 0;
            token = null;
            deviceId = model.DeviceId ?? Guid.NewGuid().ToString();

            try
            {
                var audience = new List<string>
                {
                    _configuration["GoogleOAuth:WebClientId"]
                };
                var androidClientIds = _configuration.GetSection("GoogleOAuth:AndroidClientIds").Get<string[]>();
                if (androidClientIds != null)
                {
                    audience.AddRange(androidClientIds);
                }

                // Validate the Google IdToken
                GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature
                    .ValidateAsync(model.IdToken, new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = audience
                    }).GetAwaiter().GetResult();

                // Extract user info from the payload
                string email = payload.Email;
                string firstName = payload.GivenName;
                string lastName = payload.FamilyName;

                // Fallback to the full name if given/family names are missing
                if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
                {
                    var nameParts = (payload.Name ?? string.Empty)
                        .Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (string.IsNullOrWhiteSpace(firstName) && nameParts.Length > 0)
                    {
                        firstName = nameParts[0];
                    }
                    if (string.IsNullOrWhiteSpace(lastName) && nameParts.Length > 1)
                    {
                        lastName = string.Join(" ", nameParts.Skip(1));
                    }
                }

                firstName ??= string.Empty;
                lastName ??= string.Empty;
                string avatarUrl = payload.Picture;
                // Look up user by email
                string procName = "[dbo].[Users_SelectByEmail]";
                _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Email", email);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    userId = reader.GetSafeInt32(startingIndex++);
                });
                // If user not found/does not exist, create a new user
                if (userId == 0 || userId == 1)
                {
                    string insertProc = "[dbo].[Users_InsertGoogle]";
                    _dataProvider.ExecuteNonQuery(insertProc, inputParamMapper: delegate (SqlParameterCollection paramCollection)
                    {
                        paramCollection.AddWithValue("@FirstName", firstName);
                        paramCollection.AddWithValue("@LastName", lastName);
                        paramCollection.AddWithValue("@Email", email);
                        paramCollection.AddWithValue("@ProfilePicturePath", avatarUrl);
                        paramCollection.AddWithValue("@IsGoogleUser", true);
                        SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                        idOut.Direction = ParameterDirection.Output;
                        paramCollection.Add(idOut);
                    },
                    returnParameters: delegate (SqlParameterCollection returnCollection)
                    {
                        object oId = returnCollection["@Id"].Value;
                        int.TryParse(oId.ToString(), out userId);
                    });
                }
                else
                {
                    // Existing user — update profile + active + last login
                    _dataProvider.ExecuteNonQuery("[dbo].[Users_UpdateGoogle]", inputParamMapper: delegate (SqlParameterCollection paramCollection)
                    {
                        paramCollection.AddWithValue("@UserId", userId);
                        paramCollection.AddWithValue("@FirstName", firstName);
                        paramCollection.AddWithValue("@LastName", lastName);
                        paramCollection.AddWithValue("@ProfilePicturePath", avatarUrl);
                        paramCollection.AddWithValue("@IsGoogleUser", true);
                    });
                }
                // Determine the user's role from the database to ensure the
                // JWT reflects the current permissions. Default to "Guest" if
                // no role is found or an error occurs.
                string roleName = "Guest";
                try
                {
                    UserWithRole roleInfo = GetUserWithRoleById(userId);
                    if (!string.IsNullOrWhiteSpace(roleInfo?.RoleName))
                    {
                        roleName = roleInfo.RoleName;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error retrieving role during Google sign in.");
                }

                // Generate a JWT token for the user with the resolved role
                IUserAuthData userAuth = new UserBase
                {
                    UserId = userId,
                    Name = email,
                    Roles = new List<string> { roleName }
                };

                token = _authenticationService.GenerateJwtToken(userAuth, deviceId).GetAwaiter().GetResult();

                // Save token to UserTokens table
                _tokenService.CreateToken(token, userId, deviceId);

                return userId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during GoogleSignIn.");
                throw;
            }
        }

        #endregion

#region READ
        public async Task LogOutAsync(UserLogOutRequest request)
        {
            UserToken userToken = _tokenService.GetTokenByToken(request.Token);
            if (userToken != null)
            {
                // Update "IsActive" to false
                SetActiveStatus(false, userToken.UserId, _dataProvider);

                // Delete the token from the database
                _tokenService.DeleteTokenAndDeviceId(request.Token, request.DeviceId);

                // Ensure the token is actually removed
                UserToken checkToken = _tokenService.GetTokenByToken(request.Token);
                if(checkToken != null)
                {
                    throw new Exception("Logout failed: Token still exists in DB.");
                }

                // Remove the authentication cookie if present
                var httpContext = _httpContextAccessor.HttpContext;
                httpContext?.Response.Cookies.Delete("AuthToken");
            }

            await Task.CompletedTask;
        }

        /// <summary>
        /// Logs in a user by validating their credentials and generating a token.
        /// </summary>
        /// <param name="email">The user's email address.</param>
        /// <param name="password">The user's password.</param>
        /// <returns>Returns <c>true</c> if login is successful; otherwise, <c>false</c>.</returns>
        

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
                    RoleId = reader.GetSafeInt32(startingIndex++),
                    AgencyId = reader.GetSafeInt32(startingIndex++),
                    HoursServed = reader.GetSafeDecimalNullable(startingIndex++),
                    DateCreated = reader.GetSafeDateTime(startingIndex++),
                    LastLoginDate = reader.GetSafeDateTimeNullable(startingIndex++),
                    IsConfirmed = reader.GetSafeBool(startingIndex++),
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

        public Paged<User> SearchUsers(int pageIndex, int pageSize, string query)
        {
            Paged<User> paged = null;
            List<User> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Users_SelectBySearch]";

            _dataProvider.ExecuteCmd(procName,
                param =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, set) =>
                {
                    int startingIndex = 0;
                    User user = new User
                    {
                        UserId = reader.GetSafeInt32(startingIndex++),
                        FirstName = reader.GetSafeString(startingIndex++),
                        LastName = reader.GetSafeString(startingIndex++),
                        Email = reader.GetSafeString(startingIndex++),
                        ProfilePicturePath = reader.GetSafeString(startingIndex++),
                        DateCreated = reader.GetSafeDateTime(startingIndex++),
                        LastLoginDate = reader.GetSafeDateTimeNullable(startingIndex++),
                        IsActive = reader.GetSafeBool(startingIndex++),
                        RoleId = reader.GetSafeInt32(startingIndex++),
                        AgencyId = reader.GetSafeInt32(startingIndex++)
                    };
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (list == null)
                        list = new List<User>();
                    list.Add(user);
                });

            if (list != null && list.Count > 0)
            {
                paged = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }

            return paged;
        }

        public List<int> GetUserIdsByRole(int roleId)
        {
            List<int> ids = null;
            string procName = "[dbo].[Roles_SelectAllUsersByRole]";

            _dataProvider.ExecuteCmd(procName,
                param => { param.AddWithValue("@RoleId", roleId); },
                (reader, set) =>
                {
                    int id = reader.GetSafeInt32(0);
                    if (ids == null)
                        ids = new List<int>();
                    ids.Add(id);
                });

            return ids ?? new List<int>();
        }

        public bool IsGoogleUser(string email)
        {
            bool isGoogle = false;
            string procName = "[dbo].[Users_CheckIsGoogleUser]";

            _dataProvider.ExecuteCmd(procName,
                param => { param.AddWithValue("@Email", email); },
                (reader, set) => { isGoogle = reader.GetSafeBool(0); });

            return isGoogle;
        }

        #endregion

        #region UPDATE
        /// <summary>
        /// Updates an existing user's information.
        /// </summary>
        /// <param name="model">The user data to update.</param>
        public void Update(UserUpdateRequest model)
        {
            string procName = "[dbo].[Users_Update]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", model.UserId);
                paramCollection.AddWithValue("@FirstName", model.FirstName);
                paramCollection.AddWithValue("@LastName", model.LastName);
                paramCollection.AddWithValue("@Email", model.Email);
                paramCollection.AddWithValue("@ProfilePicturePath", (object?)model.ProfilePicturePath ?? DBNull.Value);
                paramCollection.AddWithValue("@RoleId", model.RoleId);
                paramCollection.AddWithValue("@AgencyId", (object?)model.AgencyId ?? DBNull.Value);
            }, null);
        }

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
        public void UserAccountValidation(int id, UserAddRequest newUser, string requestUrl)
        {
            string guid = Guid.NewGuid().ToString();
            string deviceId = "DefaultDevice";

            _tokenService.CreateToken(guid, id, deviceId);

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
                RoleId = reader.GetSafeInt32(startingIndex++),
                AgencyId = reader.GetSafeInt32(startingIndex++)
            };

            return user;
        }

        private static void SetActiveStatus(bool isActive, int userId, IDataProvider dataProvider)
        {
            dataProvider.ExecuteNonQuery("[dbo].[Users_SetIsActive]",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", userId);
                    paramCollection.AddWithValue("@IsActive", isActive);
                });
        }
#endregion
    }
}
