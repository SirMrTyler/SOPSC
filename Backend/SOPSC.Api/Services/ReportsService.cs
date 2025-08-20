using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Interfaces.Reports;
using SOPSC.Api.Models.Requests.Reports;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SOPSC.Api.Services
{
    public class ReportsService : IReportsService
    {
        private static readonly List<Report> _reports = new();
        private static int _nextId = 1;

        public List<Report> Get(int pageIndex, int pageSize)
        {
            return _reports
                .OrderByDescending(r => r.DateCreated)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToList();
        }

        public Report GetById(int id)
        {
            return _reports.FirstOrDefault(r => r.Id == id);
        }

        public int Add(ReportAddRequest model)
        {
            var report = new Report
            {
                Id = _nextId++,
                Division = model.Division,
                CreatedByName = model.CreatedByName,
                CreatedByEmail = model.CreatedByEmail,
                CreatedByPhone = model.CreatedByPhone,
                DateCreated = DateTime.UtcNow,
                Description = model.Description,
                PrimaryAgencyServed = model.PrimaryAgencyServed,
                OtherAgenciesServed = model.OtherAgenciesServed,
                PocName = model.PocName,
                PocPhone = model.PocPhone,
                ServiceType = model.ServiceType,
                HoursServed = model.HoursServed,
                CommuteTime = model.CommuteTime,
                DispatchAddress = model.DispatchAddress,
                ClientName = model.ClientName,
                ClientPhone = model.ClientPhone,
                ClientAddress = model.ClientAddress,
                TimeServed = model.TimeServed,
                MilesDriven = model.MilesDriven,
                DispatchStartTime = model.DispatchStartTime,
                DispatchEndTime = model.DispatchEndTime,
                TimeChaplainLeft = model.TimeChaplainLeft,
                TimeChaplainReturned = model.TimeChaplainReturned
            };
            _reports.Insert(0, report);
            return report.Id;
        }
    }
}
