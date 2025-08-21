using System.Collections.Generic;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Requests.Reports;

namespace SOPSC.Api.Models.Interfaces.Reports
{
    /// <summary>
    /// Provides operations for managing reports.
    /// </summary>
    public interface IReportsService
    {
        int Add(int userId, ReportAddRequest model);
        void Update(int modifiedBy, ReportUpdateRequest model);
        void Delete(int reportId);
        void DeleteByIds(List<int> reportIds);
        Report GetById(int reportId);
        Paged<Report> GetAllPaged(int pageIndex, int pageSize);
        Paged<Report> GetByDivisionId(int divisionId, int pageIndex, int pageSize);
        Paged<Report> GetByUserId(int userId, int pageIndex, int pageSize);
        Paged<Report> Search(ReportSearchRequest model);
        void TransferOwnership(int fromUserId, int toUserId, List<int> reportIds);
    }
}
