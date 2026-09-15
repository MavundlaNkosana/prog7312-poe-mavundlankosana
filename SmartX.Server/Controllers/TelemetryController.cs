using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartX.Server.Models;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace SmartX.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TelemetryController : ControllerBase
    {
        private readonly TelemetryIngestionBuffer _buffer;
        private static DeploymentNode _rootFacility;

        static TelemetryController()
        {
            _rootFacility = new DeploymentNode("Main Facility");
            var zoneA = new DeploymentNode("Greenhouse Alpha");
            var zoneB = new DeploymentNode("Utility Grid");
            var pumpStation = new DeploymentNode("Pump Station 1");

            zoneA.Children.Add(new DeploymentNode("Sub-Zone 1"));
            _rootFacility.Children.Add(zoneA);
            _rootFacility.Children.Add(zoneB);
            _rootFacility.Children.Add(pumpStation);
        }

        public TelemetryController(TelemetryIngestionBuffer buffer)
        {
            _buffer = buffer;
        }

        [HttpPost("ingest")]
        public IActionResult IngestTelemetry([FromBody] TelemetryPacket<float> packet)
        {
            if (packet == null || string.IsNullOrEmpty(packet.MacAddress))
                return BadRequest("Invalid telemetry packet.");

            float[] burst = new float[] { packet.PayloadValue, packet.PayloadValue * 1.05f };

            _buffer.ReceiveBatch(0, burst);

            return Ok(new
            {
                Status = "Ingested",
                Device = packet.MacAddress,
                Timestamp = packet.Timestamp
            });
        }

        [HttpGet("validate-zone/{zoneName}")]
        public IActionResult ValidateZone(string zoneName)
        {
            bool isValid = _rootFacility.ValidateDeploymentPath(zoneName);

            if (isValid)
                return Ok(new { Status = "Zone Validated", Zone = zoneName });

            return NotFound(new { Status = "Invalid Deployment Zone", Zone = zoneName });
        }

        [HttpPost("sensors/{macAddress}/upload-log")]
        public async Task<IActionResult> UploadLog([FromRoute] string macAddress, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);

            var filePath = Path.Combine(uploadsDir, $"{macAddress}_{file.FileName}.enc");

         
            using Aes aes = Aes.Create();
            aes.KeySize = 256;
            aes.GenerateKey();
            aes.GenerateIV();
            

            
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {

                using (var cryptoStream = new CryptoStream(fileStream, aes.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    await file.CopyToAsync(cryptoStream);
                }
            }

            return Ok(new
            {
                Status = "File securely encrypted and attached to sensor profile",
                FileName = file.FileName + ".enc",
                OriginalSize = file.Length,
                EncryptionAlgorithm = "AES-256"
            });
        }
    }
}