using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Reports;
using SOPSC.Api.Models.Interfaces.Reports;
using SOPSC.Api.Models.Requests.Reports;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Threading.Tasks;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Member, Admin, Developer, Guest")]
    public class ReportsController : BaseApiController
    {
        private readonly IReportsService _service;
        private readonly IAuthenticationService<int> _authService;
        private readonly IReportRealtimeService _realtime;

        public ReportsController(IReportsService service, IAuthenticationService<int> authService, IReportRealtimeService realtime, ILogger<ReportsController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
            _realtime = realtime;
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Report>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Report> paged = _service.GetAllPaged(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Report>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Report>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Report report = _service.GetById(id);
                if (report == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<Report> { Item = report };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("division/{divisionId:int}")]
        public ActionResult<ItemResponse<Paged<Report>>> GetByDivision(int divisionId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Report> paged = _service.GetByDivisionId(divisionId, pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Report>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("user/{userId:int}")]
        public ActionResult<ItemResponse<Paged<Report>>> GetByUser(int userId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Report> paged = _service.GetByUserId(userId, pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Report>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Report>>> Search([FromQuery] ReportSearchRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Report> paged = _service.Search(model);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Report>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public async Task<ActionResult<ItemResponse<int>>> Create(ReportAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(userId, model);
                var report = _service.GetById(id);
                await _realtime.UpsertAsync(report, model.DivisionId, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<SuccessResponse>> Update(int id, ReportUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                model.ReportId = id;
                _service.Update(userId, model);
                var report = _service.GetById(id);
                await _realtime.UpsertAsync(report, model.DivisionId, model.CreatedBy);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<SuccessResponse>> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                await _realtime.DeleteAsync(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpDelete]
        public async Task<ActionResult<SuccessResponse>> DeleteByIds(ReportIdsRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.DeleteByIds(model.ReportIds);
                foreach (var id in model.ReportIds)
                {
                    await _realtime.DeleteAsync(id);
                }
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPut("transfer")]
        public ActionResult<SuccessResponse> Transfer(ReportTransferRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.TransferOwnership(model.FromUserId, model.ToUserId, model.ReportIds);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }
    }
}
