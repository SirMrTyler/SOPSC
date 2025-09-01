using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Interfaces.Notifications;
using Microsoft.Extensions.Logging;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Service for sending push notifications through Expo and checking delivery receipts.
    /// </summary>
    public class ExpoPushService : IExpoPushService
    {
        private const string SEND_ENDPOINT = "https://exp.host/--/api/v2/push/send";
        private const string RECEIPTS_ENDPOINT = "https://exp.host/--/api/v2/push/getReceipts";
        private readonly HttpClient _httpClient;
        private readonly IDataProvider _dataProvider;
        private readonly ILogger<ExpoPushService> _logger;

        public ExpoPushService(HttpClient httpClient, IDataProvider dataProvider, ILogger<ExpoPushService> logger)
        {
            _httpClient = httpClient;
            _dataProvider = dataProvider;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task<List<string>> SendPushNotificationsAsync(IEnumerable<int> userIds, string title, string body, object data = null)
        {
            var tokens = GetTokens(userIds);
            var messages = tokens.Select(t => new ExpoPushMessage { To = t, Title = title, Body = body, Data = data }).ToList();
            List<string> ticketIds = new();

            foreach (var batch in messages.Chunk(100))
            {
                var payload = JsonSerializer.Serialize(batch);
                using var content = new StringContent(payload, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(SEND_ENDPOINT, content);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<ExpoPushResponse>();
                if (result?.Data != null)
                {
                    foreach (var ticket in result.Data)
                    {
                        if (!string.IsNullOrWhiteSpace(ticket.Id))
                        {
                            ticketIds.Add(ticket.Id);
                            _logger.LogInformation("Expo ticket {TicketId} sent.", ticket.Id);
                        }
                        else if (ticket.Status == "error" && ticket.Details?.Error == "DeviceNotRegistered" && !string.IsNullOrWhiteSpace(ticket.Details?.ExpoPushToken))
                        {
                            RemoveToken(ticket.Details.ExpoPushToken);
                        }
                    }
                }
            }

            return ticketIds;
        }

        /// <inheritdoc />
        public async Task CheckReceiptsAsync(IEnumerable<string> ticketIds)
        {
            foreach (var batch in ticketIds.Chunk(100))
            {
                var payload = JsonSerializer.Serialize(new { ids = batch });
                using var content = new StringContent(payload, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(RECEIPTS_ENDPOINT, content);
                response.EnsureSuccessStatusCode();

                using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
                if (doc.RootElement.TryGetProperty("data", out var dataElement))
                {
                    foreach (var receipt in dataElement.EnumerateObject())
                    {
                        var status = receipt.Value.GetProperty("status").GetString();
                        if (status == "error")
                        {
                            var details = receipt.Value.GetProperty("details");
                            var error = details.GetProperty("error").GetString();
                            _logger.LogWarning("Expo receipt {TicketId} error: {Error}", receipt.Name, error);
                            if (error == "DeviceNotRegistered" && details.TryGetProperty("expoPushToken", out var tokenEl))
                            {
                                var token = tokenEl.GetString();
                                RemoveToken(token);
                            }
                        }
                    }
                }
            }
        }

        private List<string> GetTokens(IEnumerable<int> userIds)
        {
            List<string> tokens = new();
            string ids = string.Join(',', userIds);
            if (string.IsNullOrWhiteSpace(ids))
            {
                return tokens;
            }

            _dataProvider.ExecuteCmd("[dbo].[NotificationTokens_SelectByUserIds]",
                param =>
                {
                    param.AddWithValue("@UserIds", ids);
                },
                (reader, set) =>
                {
                    int index = 0;
                    string token = reader.GetSafeString(index++);
                    if (!string.IsNullOrWhiteSpace(token))
                    {
                        tokens.Add(token);
                    }
                });

            return tokens;
        }

        private void RemoveToken(string expoPushToken)
        {
            if (string.IsNullOrWhiteSpace(expoPushToken))
            {
                return;
            }

            _dataProvider.ExecuteNonQuery("[dbo].[NotificationTokens_DeleteByToken]",
                param =>
                {
                    param.AddWithValue("@ExpoPushToken", expoPushToken);
                });
        }

        private class ExpoPushMessage
        {
            public string To { get; set; }
            public string Title { get; set; }
            public string Body { get; set; }
            public object Data { get; set; }
        }

        private class ExpoPushResponse
        {
            public List<ExpoPushTicket> Data { get; set; }
        }

        private class ExpoPushTicket
        {
            public string Status { get; set; }
            public string Id { get; set; }
            public ExpoPushTicketDetails Details { get; set; }
        }

        private class ExpoPushTicketDetails
        {
            public string Error { get; set; }
            public string ExpoPushToken { get; set; }
        }
    }
}
