using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using SOPSC.Api.Models.Interfaces.Calendar;

namespace SOPSC.Api.Controllers;

[Route("api/schedule/categories")]
[ApiController]
public class ScheduleCategoriesController : ControllerBase
{
    private readonly IScheduleCategoriesService _service;

    public ScheduleCategoriesController(IScheduleCategoriesService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ScheduleCategory>> GetAll()
    {
        var list = _service.GetAll();
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public ActionResult<ScheduleCategory> Get(int id)
    {
        var category = _service.Get(id);
        if (category == null)
        {
            return NotFound();
        }
        return Ok(category);
    }

    [HttpPost]
    public ActionResult<int> Create(ScheduleCategoryAddRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        int id = _service.Add(model);
        return CreatedAtAction(nameof(Get), new { id }, id);
    }

    [HttpPut("{id:int}")]
    public ActionResult Update(int id, ScheduleCategoryAddRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var updateModel = new ScheduleCategoryUpdateRequest
        {
            CategoryId = id,
            Name = model.Name,
            ColorValue = model.ColorValue,
            UserIds = model.UserIds
        };
        _service.Update(updateModel);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public ActionResult Delete(int id)
    {
        _service.Delete(id);
        return NoContent();
    }
}