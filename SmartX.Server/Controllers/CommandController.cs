using Microsoft.AspNetCore.Mvc;
using SmartX.Server.Services;
using System.Linq;

namespace SmartX.Server.Controllers
{
    public class CommandDto
    {
        public string MacAddress { get; set; }
        public string Command { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CommandController : ControllerBase
    {
        private readonly IoTDataService _dataService;

        public CommandController(IoTDataService dataService)
        {
            _dataService = dataService;
        }

        // POST: api/command/issue
        [HttpPost("issue")]
        public IActionResult IssueCommand([FromBody] CommandDto req)
        {
            if (string.IsNullOrEmpty(req.MacAddress) || string.IsNullOrEmpty(req.Command))
                return BadRequest("Invalid command payload.");

            // Utilizes the Stack internally
            _dataService.IssueCommand(req.MacAddress, req.Command);

            return Ok(new { Status = "Command Issued", Action = req.Command });
        }

        // POST: api/command/undo
        [HttpPost("undo")]
        public IActionResult UndoCommand()
        {
            // Pops from the Stack
            var revertedCommand = _dataService.UndoLastCommand();

            if (revertedCommand != null)
                return Ok(new { Status = "Command Reverted", RevertedAction = revertedCommand.CommandAction });

            return NotFound(new { Status = "Stack Empty. No commands to undo." });
        }

        // GET: api/command/insights
        [HttpGet("insights")]
        public IActionResult GetInsights()
        {
            // Leverages the analytical dictionary to return proactive insights
            var insights = _dataService.GeneratePredictiveInsights();
            return Ok(insights);
        }
    }
}