﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Controllers;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Models.Requests;
using SOPSC.Api.Models.Requests.Users;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Models.Domains.Users;
using SOPSC.Api.Data;

/// <summary>
/// Handles all user-related operations such as creating, retrieving, updating, and deleting users.
/// </summary>
/// <remarks>
/// <para>
/// This controller inherits from <see cref="BaseApiController"/> to leverage common HTTP response methods. 
/// It acts as the entry point for user-related API requests, implementing endpoints for user management.
/// </para>
/// <para>
/// The controller relies on <see cref="IUserService"/> for handling business logic related to user operations.
/// </para>
/// </remarks>
[ApiController]
[Route("api/[controller]")]
public class UsersController : BaseApiController
{
    private IUserService _userService = null;
    private ITokenService _tokenService = null;
    private IAuthenticationService<int> _authenticationService = null;

    /// <summary>
    /// Initializes a new instance of the <see cref="UsersController"/> class.
    /// </summary>
    /// <param name="userService">The user service providing access to user management operations.</param>
    /// <param name="logger">The logger instance for capturing logs and errors.</param>
    public UsersController(
        IUserService userService,
        ITokenService tokenService,
        ILogger<UsersController> logger,
        IAuthenticationService<int> authService) : base(logger)
    {
        _userService = userService;
        _tokenService = tokenService;
        _authenticationService = authService;
    }

#region POST

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<ItemResponse<UserTokenResponse>>> Login(UserLogInRequest tryUser)
    {
        int iCode = 200;
        BaseResponse response = null;
        try
        {
            // Get deviceId from the request headers
            string deviceId = HttpContext.Request.Headers["DeviceId"].ToString();
            if (string.IsNullOrEmpty(deviceId))
            {
                deviceId = Guid.NewGuid().ToString();
            }

            // Delete any existing tokens for this user and device
            UserToken existingToken = _tokenService.GetTokenByDeviceId(deviceId);
            if (existingToken != null)
            {
                _tokenService.DeleteTokenByToken(existingToken.Token); // Delete the token
            }

            // If no valid token is found, attempt to log in the user
            var token = await _userService.LogInAsync(tryUser.Email, tryUser.Password, deviceId);
            if (string.IsNullOrEmpty(token))
            {
                iCode = 401;
                response = new ErrorResponse("Invalid credentials.");
            }
            else
            {
                response = new ItemResponse<UserTokenResponse>
                {
                    Item = new UserTokenResponse
                    {
                        Token = token,
                        DeviceId = deviceId
                    }
                };
            }
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            iCode = 500; // Internal Server Error
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(iCode, response);
    }


    /// <summary>
    /// Creates a new user in the system.
    /// </summary>
    /// <remarks>
    /// This endpoint accepts a user model containing required fields like name, email, and password.
    /// </remarks>
    /// <param name="model">The user details provided for creating a new user.</param>
    /// <returns>An HTTP 200 OK response if successful and an error code otherwise.</returns>
    [AllowAnonymous]
    [HttpPost("register")]
    public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
    {
        ObjectResult result = null;

        try
        {
            int id = _userService.Create(model);
            ItemResponse<int> response = new ItemResponse<int>();
            response.Item = id;

            var requestUrl = HttpContext.Request.Headers["Referer"].ToString();
            _userService.UserAccountValidation(id, model, requestUrl);

            result = Ok200(response);
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            ErrorResponse response = new ErrorResponse(ex.Message);
            result = StatusCode(500, response);
        }
        return result;
    }

    [AllowAnonymous]
    [HttpPost("google")]
    public ActionResult<ItemResponse<object>> GoogleSignIn(GoogleSignInRequest model)
    {
        int iCode = 200;
        BaseResponse response = null;
        try
        {
            
            // Log the first portion of idToken for debugging purposes
            var tokenPreview = model.IdToken != null && model.IdToken.Length > 10
                ? model.IdToken.Substring(0, 10) + "..."
                : model.IdToken;
           base.Logger.LogError($"GoogleSignIn called with IdToken: {tokenPreview}");

            string token;
            string deviceId;

            int userId = _userService.GoogleSignIn(model, out token, out deviceId);

            if (userId == 0)
            {
                iCode = 400;
                response = new ErrorResponse("Google Sign-In failed.");
            }
            else
            {
                response = new ItemResponse<object>
                {
                    Item = new
                    {
                        token = token,
                        deviceId = deviceId,
                        userId = userId
                    }
                };
            }
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            iCode = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }

        return StatusCode(iCode, response);
    }

    [AllowAnonymous]
    [HttpPost("confirm/{token}")]
    public ActionResult<ItemResponse<bool>> ConfirmNewUser(string token)
    {
        int iCode = 200;
        BaseResponse response = null;

        try
        {
            UserToken userToken = _tokenService.GetTokenByToken(token);
            if (userToken == null)
            {
                iCode = 404;
                response = new ErrorResponse("Token not found.");
            }
            else
            {
                _userService.ConfirmUser(userToken.UserId);
                _tokenService.DeleteTokenByToken(token);
                response = new SuccessResponse();
            }
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            iCode = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(iCode, response);
    }

#endregion

#region GET    
    [AllowAnonymous]
    [HttpGet("logout")]
    public async Task<ActionResult<ItemResponse<bool>>> LogOut()
    {
        int statusCode = 200;
        BaseResponse response = null;

        try
        {
            string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            string deviceId = HttpContext.Request.Headers["DeviceId"];

            if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(deviceId))
            {
                UserLogOutRequest logOutRequest = new UserLogOutRequest
                {
                    Token = token,
                    DeviceId = deviceId
                };

                // Call the logout function from UserService
                await _userService.LogOutAsync(logOutRequest);
            }
            response = new SuccessResponse();
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            statusCode = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(statusCode, response);
    }

    [Authorize]
    [HttpGet("current")]
    public ActionResult<ItemResponse<UserWithRole>> GetCurrentUser()
    {
        int statusCode = 200;
        BaseResponse response = null;

        try
        {
            IUserAuthData currentUser = _authenticationService.GetCurrentUser();
            if (currentUser == null)
            {
                Console.WriteLine("[UsersController: 57]: Current User is null");
                statusCode = 404; // Not found
                response = new ErrorResponse("Unauthorized: Current User not found.");
                return StatusCode(statusCode, response);
            }

            UserWithRole user = _userService.GetUserWithRoleById(currentUser.UserId);
            if (user == null)
            {
                Console.WriteLine("[UsersController: 178]: User not found");
                statusCode = 404; // Not found
                response = new ErrorResponse("User not found.");
                return StatusCode(statusCode, response);
            }
            else 
            { 
                response = new ItemResponse<UserWithRole>() { Item = user };
            }
        }
        catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            statusCode = 500; // Internal Server Error
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
            return StatusCode(statusCode, response);
        }
        return StatusCode(statusCode, response);
    }

    /// <summary>
    /// Retrieves a paginated list of users.
    /// </summary>
    /// <remarks>
    /// <para>
    /// This endpoint allows the client to retrieve users in a paginated format using page index and page size. 
    /// If no users are found, a 404 status code is returned with an error message.
    /// </para>
    /// <para>
    /// If an unexpected error occurs, a 500 status code is returned with the corresponding error details.
    /// </para>
    /// </remarks>
    /// <param name="pageIndex">The index of the page to retrieve (0-based).</param>
    /// <param name="pageSize">The number of users to retrieve per page.</param>
    /// <returns>
    /// An <see cref="ActionResult"/> containing an <see cref="ItemResponse{T}"/> of paged users if successful, 
    /// or an <see cref="ErrorResponse"/> if no users are found or an error occurs.
    /// </returns>
    [Authorize(Roles = "Admin")]
    [HttpGet("paginate")]
    public ActionResult<ItemResponse<Paged<User>>> GetAllUsers(int pageIndex, int pageSize)
    {
        int sCode = 200;
        BaseResponse response = null;
        try
        {
            Paged<User> paged = _userService.GetAllUsers(pageIndex, pageSize);
            if (paged != null)
                response = new ItemResponse<Paged<User>>() { Item = paged };
            else
            {
                response = new ErrorResponse("Found no records of users");
                sCode = 404;
            }
        } catch (Exception ex)
        {
            base.Logger.LogError(ex.ToString());
            response = new ErrorResponse(ex.Message);
            sCode = 500;
        }
        return StatusCode(sCode, response);
    }

#endregion

#region UPDATE

#endregion

#region DELETE

#endregion
}
