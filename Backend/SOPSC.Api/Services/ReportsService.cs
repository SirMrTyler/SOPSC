using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Interfaces.Reports;
using SOPSC.Api.Models.Requests.Reports;
using System.Collections.Generic;
using System.Data;
using System;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Service for report related operations.
    /// </summary>
    public class ReportsService : IReportsService
    {
        private readonly IDataProvider _data;

        public ReportsService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(int userId, ReportAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Reports_Insert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    SqlParameter idOut = new SqlParameter("@ReportId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    param.Add(idOut);
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@DivisionId", model.DivisionId);
                    param.AddWithValue("@PrimaryAgency", model.PrimaryAgency);
                    param.AddWithValue("@SecondaryAgency", (object)model.SecondaryAgency ?? DBNull.Value);
                    param.AddWithValue("@OtherAgency", (object)model.OtherAgency ?? DBNull.Value);
                    param.AddWithValue("@TypeOfService", model.TypeOfService);
                    param.AddWithValue("@DateDispatchStarted", model.DateDispatchStarted);
                    param.AddWithValue("@DateDispatchEnded", model.DateDispatchEnded);
                    param.AddWithValue("@TimeDispatchStarted", model.TimeDispatchStarted);
                    param.AddWithValue("@TimeDispatchEnded", model.TimeDispatchEnded);
                    param.AddWithValue("@HoursOfService", DBNull.Value);
                    param.AddWithValue("@TimeChaplainLeft", model.TimeChaplainLeft);
                    param.AddWithValue("@TimeChaplainReturned", model.TimeChaplainReturned);
                    param.AddWithValue("@CommuteTime", DBNull.Value);
                    param.AddWithValue("@ContactName", model.ContactName);
                    param.AddWithValue("@ContactPhone", (object)model.ContactPhone ?? DBNull.Value);
                    param.AddWithValue("@ContactEmail", (object)model.ContactEmail ?? DBNull.Value);
                    param.AddWithValue("@AddressDispatch", model.AddressDispatch);
                    param.AddWithValue("@AddressLine2Dispatch", (object)model.AddressLine2Dispatch ?? DBNull.Value);
                    param.AddWithValue("@CityDispatch", model.CityDispatch);
                    param.AddWithValue("@StateDispatch", model.StateDispatch);
                    param.AddWithValue("@PostalCodeDispatch", (object)model.PostalCodeDispatch ?? DBNull.Value);
                    param.AddWithValue("@Narrative", model.Narrative);
                },
                returnParameters: param =>
                {
                    object oId = param["@ReportId"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void Update(int modifiedBy, ReportUpdateRequest model)
        {
            string procName = "[dbo].[Reports_UpdateById]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@ReportId", model.ReportId);
                    param.AddWithValue("@CreatedBy", model.CreatedBy);
                    param.AddWithValue("@ModifiedBy", modifiedBy);
                    param.AddWithValue("@DivisionId", model.DivisionId);
                    param.AddWithValue("@PrimaryAgency", model.PrimaryAgency);
                    param.AddWithValue("@SecondaryAgency", (object)model.SecondaryAgency ?? DBNull.Value);
                    param.AddWithValue("@OtherAgency", (object)model.OtherAgency ?? DBNull.Value);
                    param.AddWithValue("@TypeOfService", model.TypeOfService);
                    param.AddWithValue("@DateDispatchStarted", model.DateDispatchStarted);
                    param.AddWithValue("@DateDispatchEnded", model.DateDispatchEnded);
                    param.AddWithValue("@TimeDispatchStarted", model.TimeDispatchStarted);
                    param.AddWithValue("@TimeDispatchEnded", model.TimeDispatchEnded);
                    param.AddWithValue("@HoursOfService", DBNull.Value);
                    param.AddWithValue("@TimeChaplainLeft", model.TimeChaplainLeft);
                    param.AddWithValue("@TimeChaplainReturned", model.TimeChaplainReturned);
                    param.AddWithValue("@CommuteTime", DBNull.Value);
                    param.AddWithValue("@ContactName", model.ContactName);
                    param.AddWithValue("@ContactPhone", (object)model.ContactPhone ?? DBNull.Value);
                    param.AddWithValue("@ContactEmail", (object)model.ContactEmail ?? DBNull.Value);
                    param.AddWithValue("@AddressDispatch", model.AddressDispatch);
                    param.AddWithValue("@AddressLine2Dispatch", (object)model.AddressLine2Dispatch ?? DBNull.Value);
                    param.AddWithValue("@CityDispatch", model.CityDispatch);
                    param.AddWithValue("@StateDispatch", model.StateDispatch);
                    param.AddWithValue("@PostalCodeDispatch", (object)model.PostalCodeDispatch ?? DBNull.Value);
                    param.AddWithValue("@Narrative", model.Narrative);
                });
        }

        public void Delete(int reportId)
        {
            string procName = "[dbo].[Reports_DeleteById]";
            _data.ExecuteNonQuery(procName, param =>
            {
                param.AddWithValue("@ReportId", reportId);
            });
        }

        public void DeleteByIds(List<int> reportIds)
        {
            string procName = "[dbo].[Reports_DeleteByIds]";
            _data.ExecuteNonQuery(procName, param =>
            {
                DataTable tvp = new DataTable();
                tvp.Columns.Add("Id", typeof(int));
                foreach (int id in reportIds)
                {
                    tvp.Rows.Add(id);
                }
                SqlParameter ids = new SqlParameter("@ReportIds", tvp)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "dbo.IntIdList"
                };
                param.Add(ids);
            });
        }

        public Report GetById(int reportId)
        {
            Report report = null;
            string procName = "[dbo].[Reports_SelectById]";
            _data.ExecuteCmd(procName,
                param => param.AddWithValue("@ReportId", reportId),
                (reader, set) =>
                {
                    int i = 0;
                    report = new Report
                    {
                        ReportId = reader.GetSafeInt32(i++),
                        Chaplain = reader.GetSafeString(i++),
                        ChaplainDivision = reader.GetSafeString(i++),
                        HoursOfService = reader.GetSafeDecimalNullable(i++),
                        CommuteTime = reader.GetSafeDecimalNullable(i++),
                        PrimaryAgency = reader.GetSafeString(i++),
                        TypeOfService = reader.GetSafeString(i++),
                        ContactName = reader.GetSafeString(i++),
                        ContactPhone = reader.GetSafeString(i++),
                        ContactEmail = reader.GetSafeString(i++),
                        AddressDispatch = reader.GetSafeString(i++),
                        CityDispatch = reader.GetSafeString(i++),
                        Narrative = reader.GetSafeString(i++),
                        DateCreated = reader.GetSafeUtcDateTime(i++)
                    };
                });
            return report;
        }

        public Paged<Report> GetAllPaged(int pageIndex, int pageSize)
        {
            List<Report> list = null;
            Paged<Report> paged = null;
            int totalCount = 0;
            string procName = "[dbo].[Reports_SelectAll_Paginate]";
            _data.ExecuteCmd(procName,
                param =>
                {
                    param.AddWithValue("@PageNumber", pageIndex + 1);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, set) =>
                {
                    int i = 0;
                    Report r = MapReport(reader, ref i);
                    totalCount = reader.GetSafeInt32(i++);
                    if (list == null) list = new List<Report>();
                    list.Add(r);
                });
            if (list != null)
            {
                paged = new Paged<Report>(list, pageIndex, pageSize, totalCount);
            }
            return paged;
        }

        public Paged<Report> GetByDivisionId(int divisionId, int pageIndex, int pageSize)
        {
            List<Report> list = null;
            Paged<Report> paged = null;
            int totalCount = 0;
            string procName = "[dbo].[Reports_SelectAllByDivisionId_Paginate]";
            _data.ExecuteCmd(procName,
                param =>
                {
                    param.AddWithValue("@DivisionId", divisionId);
                    param.AddWithValue("@PageNumber", pageIndex + 1);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, set) =>
                {
                    int i = 0;
                    Report r = MapReport(reader, ref i);
                    totalCount = reader.GetSafeInt32(i++);
                    if (list == null) list = new List<Report>();
                    list.Add(r);
                });
            if (list != null)
            {
                paged = new Paged<Report>(list, pageIndex, pageSize, totalCount);
            }
            return paged;
        }

        public Paged<Report> GetByUserId(int userId, int pageIndex, int pageSize)
        {
            List<Report> list = null;
            Paged<Report> paged = null;
            int totalCount = 0;
            string procName = "[dbo].[Reports_SelectAllByUserId_Paginate]";
            _data.ExecuteCmd(procName,
                param =>
                {
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@PageNumber", pageIndex + 1);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, set) =>
                {
                    int i = 0;
                    Report r = MapReport(reader, ref i);
                    totalCount = reader.GetSafeInt32(i++);
                    if (list == null) list = new List<Report>();
                    list.Add(r);
                });
            if (list != null)
            {
                paged = new Paged<Report>(list, pageIndex, pageSize, totalCount);
            }
            return paged;
        }

        public Paged<Report> Search(ReportSearchRequest model)
        {
            List<Report> list = null;
            Paged<Report> paged = null;
            int totalCount = 0;
            string procName = "[dbo].[Reports_Search_Paginate]";
            _data.ExecuteCmd(procName,
                param =>
                {
                    param.AddWithValue("@DivisionId", model.DivisionId ?? (object)DBNull.Value);
                    param.AddWithValue("@UserId", model.UserId ?? (object)DBNull.Value);
                    param.AddWithValue("@FromDate", model.FromDate ?? (object)DBNull.Value);
                    param.AddWithValue("@ToDate", model.ToDate ?? (object)DBNull.Value);
                    param.AddWithValue("@Agency", string.IsNullOrEmpty(model.Agency) ? (object)DBNull.Value : model.Agency);
                    param.AddWithValue("@Text", string.IsNullOrEmpty(model.Text) ? (object)DBNull.Value : model.Text);
                    param.AddWithValue("@PageNumber", model.PageIndex + 1);
                    param.AddWithValue("@PageSize", model.PageSize);
                },
                (reader, set) =>
                {
                    int i = 0;
                    Report r = MapReport(reader, ref i);
                    totalCount = reader.GetSafeInt32(i++);
                    if (list == null) list = new List<Report>();
                    list.Add(r);
                });
            if (list != null)
            {
                paged = new Paged<Report>(list, model.PageIndex, model.PageSize, totalCount);
            }
            return paged;
        }

        public void TransferOwnership(int fromUserId, int toUserId, List<int> reportIds)
        {
            string procName = "[dbo].[Reports_TransferOwnership]";
            _data.ExecuteNonQuery(procName, param =>
            {
                param.AddWithValue("@FromUserId", fromUserId);
                param.AddWithValue("@ToUserId", toUserId);
                DataTable tvp = new DataTable();
                tvp.Columns.Add("Id", typeof(int));
                foreach (int id in reportIds)
                {
                    tvp.Rows.Add(id);
                }
                SqlParameter ids = new SqlParameter("@ReportIds", tvp)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "dbo.IntIdList"
                };
                param.Add(ids);
            });
        }

        private static Report MapReport(IDataReader reader, ref int index)
        {
            Report r = new Report
            {
                ReportId = reader.GetSafeInt32(index++),
                Chaplain = reader.GetSafeString(index++),
                ChaplainDivision = reader.GetSafeString(index++),
                HoursOfService = reader.GetSafeDecimalNullable(index++),
                CommuteTime = reader.GetSafeDecimalNullable(index++),
                PrimaryAgency = reader.GetSafeString(index++),
                TypeOfService = reader.GetSafeString(index++),
                ContactName = reader.GetSafeString(index++),
                ContactPhone = reader.GetSafeString(index++),
                ContactEmail = reader.GetSafeString(index++),
                AddressDispatch = reader.GetSafeString(index++),
                CityDispatch = reader.GetSafeString(index++),
                Narrative = reader.GetSafeString(index++),
                DateCreated = reader.GetSafeUtcDateTime(index++)
            };
            return r;
        }
    }
}
