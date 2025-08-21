using System;

namespace SOPSC.Api.Models.Domains.Reports
{
    /// <summary>
    /// Represents a chaplain service report.
    /// </summary>
    public class Report
    {
        public int ReportId { get; set; }
        public string Chaplain { get; set; }
        public string ChaplainDivision { get; set; }
        public decimal? HoursOfService { get; set; }
        public decimal? CommuteTime { get; set; }
        public string PrimaryAgency { get; set; }
        public string TypeOfService { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public string AddressDispatch { get; set; }
        public string CityDispatch { get; set; }
        public string Narrative { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
