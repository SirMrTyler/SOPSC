using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Reports
{
    /// <summary>
    /// Request model for updating an existing report.
    /// </summary>
    public class ReportUpdateRequest : ReportAddRequest
    {
        [Required]
        public int ReportId { get; set; }

        /// <summary>
        /// User id of the original creator of the report.
        /// </summary>
        [Required]
        public int CreatedBy { get; set; }
    }
}
