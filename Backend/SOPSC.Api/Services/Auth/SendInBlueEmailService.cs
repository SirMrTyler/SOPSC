using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using SOPSC.Api.Models.Interfaces.Emails;
using SOPSC.Api.Models.Requests.Emails;

public class SendInBlueEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _senderEmail;
    private readonly string _senderName;

    public SendInBlueEmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["AppKeys:SendInBlueAppKey"];
        _senderEmail = configuration["EmailSettings:SenderEmail"];
        _senderName = configuration["EmailSettings:SenderName"];
    }

    public async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlContent)
    {
        var request = new
        {
            sender = new { email = _senderEmail, name = _senderName },
            to = new[] { new { email = toEmail, name = toName } },
            subject = subject,
            htmlContent = htmlContent
        };

        var jsonRequest = JsonSerializer.Serialize(request);
        var httpContent = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _httpClient.PostAsync("https://api.sendinblue.com/v3/smtp/email", httpContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error sending email: {response.StatusCode} - {errorContent}");
        }
    }

    public async Task SendTestEmail(SendEmailRequest request)
    {
        await SendEmailAsync(request.To.Email, request.To.Name, request.Subject, "This is a test email.");
    }

    public async Task SendAdminMessage(SendEmailRequest request)
    {
        string adminEmail = "admin@example.com"; // Replace with your admin email
        await SendEmailAsync(adminEmail, "Admin", request.Subject, request.HtmlContent);
    }

    public async Task NewUserEmail(SendEmailRequest request, string confirmUrl)
    {
        string htmlContent = $"Welcome! Please confirm your account by clicking <a href='{confirmUrl}'>here</a>.";
        await SendEmailAsync(request.To.Email, request.To.Name, request.Subject, htmlContent);
    }
}
