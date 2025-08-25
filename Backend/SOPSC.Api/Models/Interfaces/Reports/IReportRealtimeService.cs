using System.Threading.Tasks;
using SOPSC.Api.Models.Domains.Reports;

namespace SOPSC.Api.Models.Interfaces.Reports
{
    /// <summary>
    /// Handles syncing report metadata to Firestore and sending push notifications.
    /// </summary>
    public interface IReportRealtimeService
    {
        Task UpsertAsync(Report report, int divisionId, int createdById);
        Task DeleteAsync(int reportId);
    }
}
