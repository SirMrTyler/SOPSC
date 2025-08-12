using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using System.Collections.Generic;

namespace SOPSC.Api.Models.Interfaces.Calendar;

public interface IScheduleCategoriesService
{
    int Add(ScheduleCategoryAddRequest model);
    ScheduleCategory Get(int id);
    List<ScheduleCategory> GetAll();
    void Update(ScheduleCategoryUpdateRequest model);
    void Delete(int id);
}