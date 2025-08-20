namespace SOPSC.Api.Models.Requests.Reports
{
    public class ReportAddRequest
    {
        public string Division { get; set; }
        public string CreatedByName { get; set; }
        public string CreatedByEmail { get; set; }
        public string CreatedByPhone { get; set; }
        public string Description { get; set; }
        public string PrimaryAgencyServed { get; set; }
        public string OtherAgenciesServed { get; set; }
        public string PocName { get; set; }
        public string PocPhone { get; set; }
        public string ServiceType { get; set; }
        public decimal HoursServed { get; set; }
        public decimal CommuteTime { get; set; }
        public string DispatchAddress { get; set; }
        public string ClientName { get; set; }
        public string ClientPhone { get; set; }
        public string ClientAddress { get; set; }
        public string TimeServed { get; set; }
        public decimal MilesDriven { get; set; }
        public string DispatchStartTime { get; set; }
        public string DispatchEndTime { get; set; }
        public string TimeChaplainLeft { get; set; }
        public string TimeChaplainReturned { get; set; }
    }
}
