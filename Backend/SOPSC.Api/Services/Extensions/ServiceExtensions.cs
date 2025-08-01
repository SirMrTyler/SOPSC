﻿using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Interfaces.Emails;
using SOPSC.Api.Models.Interfaces.Messages;
using SOPSC.Api.Models.Interfaces.GroupChats;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Services.Auth;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Services;

namespace SOPSC.Api.Services.Extensions
{
    /// <summary>
    /// Provides extension methods for registering custom services in the dependency injection container.
    /// </summary>
    public static class ServiceExtensions
    {
        /// <summary>
        /// Registers custom services required by the application into the dependency injection container.
        /// </summary>
        /// <param name="services">The <see cref="IServiceCollection"/> to add services to.</param>
        /// <param name="configuration">The application configuration to retrieve settings like connection strings.</param>
        /// <returns>The updated <see cref="IServiceCollection"/> with custom services registered.</returns>
        public static IServiceCollection RegisterCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Retrieve the default connection string from configuration or environment variables
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("DefaultConnection string is not configured. Set 'ConnectionStrings__DefaultConnection' or define it in appsettings.Development.json.");
            }
            // Register services
            services.AddHttpClient<IEmailService, SendInBlueEmailService>();
            /// <summary>
            /// Registers authentication service with user identifier as <c>int</c>.
            /// </summary>
            services.AddScoped<IAuthenticationService<int>, AuthenticationService>();

            /// <summary>
            /// Registers the data provider with a scoped lifetime and passes the connection string.
            /// </summary>
            services.AddScoped<IDataProvider, DataProvider>(provider => new DataProvider(connectionString));

            /// <summary>
            /// Registers user service to manage user-related operations.
            /// </summary>
            services.AddScoped<IUserService, UserService>();

            /// <summary>
            /// Registers lookup service to handle lookup operations.
            /// </summary>
            services.AddScoped<ILookUpService, LookUpService>();
            // Creates a new instance of the <see cref="TokenService"/> class. 
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IMessagesService, MessagesService>();
            services.AddScoped<IGroupChatsService, GroupChatsService>();
            services.AddScoped<ICalendarService, CalendarService>();
            /// <summary>
            /// Adds HTTP context accessor for accessing the current HTTP context.
            /// </summary>
            services.AddHttpContextAccessor();

            // Placeholder for registering the email service
            // services.AddScoped<IEmailService, IEmailService>();

            return services;
        }
    }
}
