using FirebaseAdmin.Messaging;
using Google.Cloud.Firestore;
using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Interfaces.Reports;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Mirrors report metadata in Firestore and emits FCM notifications.
    /// </summary>
    public class ReportRealtimeService : IReportRealtimeService
    {
        private readonly FirestoreDb _db;
        private readonly FirebaseMessaging _messaging;

        public ReportRealtimeService(FirestoreDb db, FirebaseMessaging messaging)
        {
            _db = db;
            _messaging = messaging;
        }

        public async Task UpsertAsync(Report report, int divisionId, int createdById)
        {
            if (_db == null) return;

            var doc = _db.Collection("reports").Document(report.ReportId.ToString());
            var data = new Dictionary<string, object>
            {
                ["reportId"] = report.ReportId,
                ["divisionId"] = divisionId,
                ["dateCreated"] = report.DateCreated,
                ["chaplain"] = report.Chaplain,
                ["chaplainDivision"] = report.ChaplainDivision,
                ["primaryAgency"] = report.PrimaryAgency,
                ["typeOfService"] = report.TypeOfService,
                ["createdById"] = createdById
            };

            await doc.SetAsync(data, SetOptions.MergeAll);

            if (_messaging != null)
            {
                var message = new Message
                {
                    Topic = $"division_{divisionId}",
                    Notification = new Notification
                    {
                        Title = "Report Updated",
                        Body = $"Report {report.ReportId} was saved"
                    },
                    Data = new Dictionary<string, string>
                    {
                        ["reportId"] = report.ReportId.ToString(),
                        ["divisionId"] = divisionId.ToString()
                    }
                };
                try
                {
                    await _messaging.SendAsync(message);
                }
                catch
                {
                    // Ignore notification failures
                }
            }
        }

        public async Task DeleteAsync(int reportId)
        {
            if (_db == null) return;
            await _db.Collection("reports").Document(reportId.ToString()).DeleteAsync();
        }
    }
}
