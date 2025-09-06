using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SOPSC.Api.Services.Extensions;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DotNetEnv;
using SOPSC.Api.Services;

var builder = WebApplication.CreateBuilder(args);

Env.Load(); // Load environment variables from .env file if present
try
{
    builder.Configuration
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables();

    // Get JWT Key from Environment Variable
    var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
    if (string.IsNullOrWhiteSpace(jwtKey))
    {
        throw new Exception("JWT Key is required!");
    }
    builder.Configuration["Jwt:Key"] = jwtKey;    
    // Add JWT Bearer Authentication
    var jwtIssuer = builder.Configuration["Jwt:Issuer"];
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = key,
            // Enable additional validation for custom claims like DeviceId
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier
        };

        // DEBUG: Log when token is not validated
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication Failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully!");
                return Task.CompletedTask;
            }
        };
    });

    // Add services to the container.
    builder.Services
    .AddControllers(config =>
    {
        var policy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
        config.Filters.Add(new AuthorizeFilter(policy));
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        // Allow controllers to handle model validation errors manually
        options.SuppressModelStateInvalidFilter = true;
    });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddScoped<IDevicesService, DevicesService>();

    ServiceExtensions.ConfigureServices(builder.Services, builder.Configuration);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    
    // Ensure routing is initialized before authentication and custom middleware
    // so that endpoint metadata like [AllowAnonymous] can be resolved.
    app.UseRouting();

    app.UseAuthentication();
    // Custom Middleware for Token Validation
    app.UseMiddleware<TokenValidationMiddleware>();
    app.UseAuthorization();


    // Map the controllers
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Program.cs Line 107: Unexpected Error: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
}