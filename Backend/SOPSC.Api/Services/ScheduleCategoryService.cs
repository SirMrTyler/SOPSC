using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Data.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;

namespace SOPSC.Api.Services;

public class ScheduleCategoriesService : IScheduleCategoriesService
{
    private readonly IDataProvider _data;

    public ScheduleCategoriesService(IDataProvider data)
    {
        _data = data;
    }

    public int Add(ScheduleCategoryAddRequest model)
    {
        int id = 0;
        string procName = "[dbo].[ScheduleCategories_Insert]";
        _data.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Name", model.Name);
                col.AddWithValue("@ColorValue", model.ColorValue);
                col.AddWithValue("@UserIds", (object?)model.UserIds ?? DBNull.Value);
                SqlParameter idOut = new SqlParameter("@CategoryId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                col.Add(idOut);
            },
            delegate (SqlParameterCollection returnCols)
            {
                int.TryParse(returnCols["@CategoryId"].Value.ToString(), out id);
            });
        return id;
    }

    public ScheduleCategory Get(int id)
    {
        ScheduleCategory cat = null;
        string procName = "[dbo].[ScheduleCategories_SelectById]";
        _data.ExecuteCmd(procName,
            delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CategoryId", id);
            },
            delegate (IDataReader reader, short set)
            {
                cat = Map(reader);
            });
        return cat;
    }

    public List<ScheduleCategory> GetAll()
    {
        List<ScheduleCategory> list = new();
        string procName = "[dbo].[ScheduleCategories_SelectAll]";
        _data.ExecuteCmd(procName, null,
            delegate (IDataReader reader, short set)
            {
                list.Add(Map(reader));
            });
        return list;
    }

    public void Update(ScheduleCategoryUpdateRequest model)
    {
        string procName = "[dbo].[ScheduleCategories_Update]";
        _data.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CategoryId", model.CategoryId);
                col.AddWithValue("@Name", model.Name);
                col.AddWithValue("@ColorValue", model.ColorValue);
                col.AddWithValue("@UserIds", (object?)model.UserIds ?? DBNull.Value);
            }, null);
    }

    public void Delete(int id)
    {
        string procName = "[dbo].[ScheduleCategories_Delete]";
        _data.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CategoryId", id);
            }, null);
    }

    private static ScheduleCategory Map(IDataReader reader)
    {
        int index = 0;
        ScheduleCategory cat = new();
        cat.CategoryId = reader.GetSafeInt32(index++);
        cat.Name = reader.GetSafeString(index++);
        cat.ColorValue = reader.GetSafeString(index++);
        cat.UserIds = reader.GetSafeString(index++);
        return cat;
    }
}