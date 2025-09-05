using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SOPSC.Api.Models.Interfaces.Notifications;

namespace SOPSC.Api.Services.Notifications
{
    /// <summary>
    /// Background service that listens for new Firestore messages and sends push notifications.
    /// </summary>
    public class FirestoreMessageListener : BackgroundService, IFirestoreMessageListener
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FirestoreMessageListener> _logger;
        private FirestoreChangeListener _listener;

        public FirestoreMessageListener(IServiceProvider serviceProvider, ILogger<FirestoreMessageListener> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        /// <inheritdoc />
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var db = _serviceProvider.GetService<FirestoreDb>();
            if (db == null)
            {
                _logger.LogWarning("Firestore is not configured; message listener disabled.");
                return;
            }

            _listener = db.CollectionGroup("messages").Listen(snapshot =>
            {
                foreach (var change in snapshot.Changes)
                {
                    if (change.ChangeType == DocumentChange.Type.Added)
                    {
                        try
                        {
                            if (change.Document.TryGetValue<Dictionary<string, object>>("recipients", out var recipientsMap))
                            {
                                List<int> userIds = new();
                                foreach (var key in recipientsMap.Keys)
                                {
                                    if (int.TryParse(key, out var id))
                                    {
                                        userIds.Add(id);
                                    }
                                }

                                if (userIds.Count > 0)
                                {
                                    string title = change.Document.TryGetValue("senderName", out string senderName) ? senderName : "New message";
                                    string body = change.Document.TryGetValue("messageContent", out string content) ? content : string.Empty;

                                    using var scope = _serviceProvider.CreateScope();
                                    var pushService = scope.ServiceProvider.GetService<IExpoPushService>();
                                    if (pushService != null)
                                    {
                                        _ = pushService.SendPushNotificationsAsync(userIds, title, body);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to process Firestore message {Path}", change.Document.Reference.Path);
                        }
                    }
                }
            });

            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // expected when stopping
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_listener != null)
            {
                try
                {
                    await _listener.StopAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to stop Firestore listener");
                }
            }

            await base.StopAsync(cancellationToken);
        }
    }
}
