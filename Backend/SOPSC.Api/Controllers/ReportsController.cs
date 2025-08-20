using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Interfaces.Reports;
using SOPSC.Api.Models.Requests.Reports;
using SOPSC.Api.Models.Responses;

namespace SOPSC.Api.Controllers
{
    [Route("api/reports")]
    public class ReportsController : BaseApiController
    {
        private readonly IReportsService _service;

        public ReportsController(IReportsService service, ILogger<ReportsController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemsResponse<Report>> Get(int pageIndex = 0, int pageSize = 10)
        {
            var items = _service.Get(pageIndex, pageSize);
            var response = new ItemsResponse<Report> { Items = items };
            return Ok200(response);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Report>> GetById(int id)
        {
            var report = _service.GetById(id);
            if (report == null)
            {
                return NotFound404(new ErrorResponse("Report not found"));
            }
            var response = new ItemResponse<Report> { Item = report };
            return Ok200(response);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create([FromBody] ReportAddRequest model)
        {
            int id = _service.Add(model);
            var response = new ItemResponse<int> { Item = id };
            return Created201(response);
        }
    }
}
