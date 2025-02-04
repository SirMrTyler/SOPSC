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
            Console.WriteLine("[Middleware: 27] Endpoint is marked as AllowAnonymous. Proceeding to next middleware.");
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
                var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
                UserToken userToken = tokenService.GetTokenByToken(token);

                if (userToken == null)
                {
                    Console.WriteLine("[Middleware: 47] Token not found. Returning Unauthorized.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: Invalid Token.");
                    return;
                }

                if (userToken.DeviceId != deviceId)
                {
                    Console.WriteLine("[Middleware: 55] DeviceId mismatch. Returning Unauthorized.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: DeviceId mismatch.");
                    return;
                }

                // Add user claims to HttpContext for authorization
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, userToken.UserId.ToString())
                };

                var identity = new ClaimsIdentity(claims, "Token");
                context.User = new ClaimsPrincipal(identity);

                Console.WriteLine("[Middleware: 70] Claims added to HttpContext successfully.");
            }
        }
        else
        {
            Console.WriteLine("[Middleware: 75] Token or DeviceId is missing. Returning Unauthroized.");
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized: Missing Token/DeviceId.");
            return;
        }

        Console.WriteLine("[Middleware: 91] Proceeding to next middleware.");
        await _next(context);
    }
}
