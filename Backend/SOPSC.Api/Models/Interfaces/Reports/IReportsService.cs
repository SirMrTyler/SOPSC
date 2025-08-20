using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Requests.Reports;
using System.Collections.Generic;

namespace SOPSC.Api.Models.Interfaces.Reports
{
    public interface IReportsService
    {
        List<Report> Get(int pageIndex, int pageSize);
        Report GetById(int id);
        int Add(ReportAddRequest model);
    }
}
