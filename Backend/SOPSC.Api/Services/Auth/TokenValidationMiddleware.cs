using Microsoft.Data.SqlClient;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Security.Claims;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Requests.Users;
public class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _scopeFactory;
    public TokenValidationMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
    {
        _next = next;
        _scopeFactory = scopeFactory;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine($"[Middleware: 21] Start: {context.Request.Path}");

        // Check if endpoint is marked as AllowAnonymous
        var endpoint = context.GetEndpoint();
        if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
        {
            Console.WriteLine("[Middleware: 27] Anon endpoint detected. Skipping token validation.");
            await _next(context);
            return;
        }

        var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var deviceId = context.Request.Headers["DeviceId"].ToString();

        Console.WriteLine($"[Middleware: 35] Received Token: {token}");
        Console.WriteLine($"[Middleware: 36] Received DeviceId: {deviceId}");

        if (!string.IsNullOrWhiteSpace(token) && !string.IsNullOrWhiteSpace(deviceId))
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dataProvider = scope.ServiceProvider.GetRequiredService<IDataProvider>();
                bool isValidSession = false;

                Console.WriteLine("[Middleware: 45] Validating token and deviceId with DB.");

                // Validate both token and deviceId
                dataProvider.ExecuteCmd(
                    "[dbo].[UserTokens_CheckIfValid]",
                    delegate (SqlParameterCollection paramCollection)
                    {
                        paramCollection.AddWithValue("@Token", token);
                        paramCollection.AddWithValue("@DeviceId", deviceId);
                        Console.WriteLine("[Middleware: 54] Added @Token and @DeviceId params to stored procedure");
                    }, delegate (IDataReader reader, short set)
                    {
                        int startingIndex = 0;
                        isValidSession = reader.GetSafeBool(startingIndex++);
                        if (isValidSession)
                        { Console.WriteLine($"[Middleware: 60] Token Validation Result: {isValidSession}");
                        }
                        else
                        {
                            Console.WriteLine("[Middleware: 64] No rows returned from DB for token validation");
                        }
                    });
                Console.WriteLine($"[Middleware: 67] Token Validation Result: {isValidSession}");

                if (isValidSession)
                {
                    Console.WriteLine("[Middleware: 71] Token and DeviceId are valid.");

                    var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
                    var userToken = tokenService.GetTokenByToken(token);

                    if (userToken != null)
                    {
                        Console.WriteLine($"[Middleware: 78] Token belongs to UserId: {userToken.UserId}");
                        Console.WriteLine($"[Middleware: 79] Token Expiry Date: {userToken.ExpiryDate}");

                        // Ensure the token is not expired
                        if (userToken.ExpiryDate > DateTime.UtcNow)
                        {
                            Console.WriteLine("[Middleware: 84] Token is not expired. Adding claims to HttpContext.");

                            // Add user claims to HttpContext for authorization
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.NameIdentifier, userToken.UserId.ToString())
                            };

                            var identity = new ClaimsIdentity(claims, "Token");
                            context.User = new ClaimsPrincipal(identity);

                            Console.WriteLine("[Middleware: 95] Claims added to HttpContext successfully.");
                        }
                        else
                        {
                            Console.WriteLine("[Middleware: 99] Token is expired. Returning Unauthroized.");
                            context.Response.StatusCode = 401;
                            await context.Response.WriteAsync("101 Unauthorized: Token Expired");
                            return;
                        }
                    }
                    else
                    {
                        Console.WriteLine("[Middleware: 107] Token service could not find the token. Returning Unauthorized.");
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("109 Unauthorized: Invalid token.");
                        return;
                    }
                }
                else
                {
                    // If token or deviceId is missing, return Unauthorized
                    Console.WriteLine("[Middleware: 115] Token and DeviceId are invalid. Returning Unauthorized.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("117 Unauthorized: Invalid session");
                    return;
                }
            }
        }
        else
        {
            Console.WriteLine("[Middleware: 124] Token or DeviceId is missing. Returning Unauthorized.");
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("126 Unauthorized: Missing Token or DeviceId.");
            return;
        }

            Console.WriteLine("[Middleware: 130] Proceeding to the next middleware.");
            await _next(context);
    }
}
