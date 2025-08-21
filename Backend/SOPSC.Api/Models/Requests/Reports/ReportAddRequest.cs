using System;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Reports
{
    /// <summary>
    /// Request model for creating a report.
    /// </summary>
    public class ReportAddRequest
    {
        [Required]
        public int DivisionId { get; set; }

        [Required]
        [StringLength(100)]
        public string PrimaryAgency { get; set; }

        [StringLength(100)]
        public string SecondaryAgency { get; set; }

        [StringLength(100)]
        public string OtherAgency { get; set; }

        [Required]
        [StringLength(255)]
        public string TypeOfService { get; set; }

        [Required]
        public DateTime DateDispatchStarted { get; set; }

        [Required]
        public DateTime DateDispatchEnded { get; set; }

        [Required]
        public TimeSpan TimeDispatchStarted { get; set; }

        [Required]
        public TimeSpan TimeDispatchEnded { get; set; }

        [Required]
        public TimeSpan TimeChaplainLeft { get; set; }

        [Required]
        public TimeSpan TimeChaplainReturned { get; set; }

        [Required]
        [StringLength(100)]
        public string ContactName { get; set; }

        [StringLength(20)]
        public string ContactPhone { get; set; }

        [StringLength(100)]
        public string ContactEmail { get; set; }

        [Required]
        [StringLength(255)]
        public string AddressDispatch { get; set; }

        [StringLength(255)]
        public string AddressLine2Dispatch { get; set; }

        [Required]
        [StringLength(100)]
        public string CityDispatch { get; set; }

        [Required]
        [StringLength(50)]
        public string StateDispatch { get; set; }

        [StringLength(20)]
        public string PostalCodeDispatch { get; set; }

        [Required]
        public string Narrative { get; set; }
    }
}
