using System;

namespace SOPSC.Api.Models.Requests.Reports
{
    /// <summary>
    /// Request model for searching reports with pagination.
    /// </summary>
    public class ReportSearchRequest
    {
        public int? DivisionId { get; set; }
        public int? UserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Agency { get; set; }
        public string Text { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
