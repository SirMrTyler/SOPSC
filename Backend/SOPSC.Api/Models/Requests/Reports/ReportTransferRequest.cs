using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Reports
{
    /// <summary>
    /// Request model for transferring report ownership between users.
    /// </summary>
    public class ReportTransferRequest
    {
        [Required]
        public int FromUserId { get; set; }

        [Required]
        public int ToUserId { get; set; }

        [Required]
        public List<int> ReportIds { get; set; }
    }
}
