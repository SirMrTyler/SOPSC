using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Reports
{
    /// <summary>
    /// Request model for actions requiring a list of report ids.
    /// </summary>
    public class ReportIdsRequest
    {
        [Required]
        public List<int> ReportIds { get; set; }
    }
}
