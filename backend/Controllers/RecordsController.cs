using HealthcareAPI.Data;
using HealthcareAPI.Models;
using HealthcareAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthcareAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecordsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EncryptionService _encryptionService;
        private readonly BlockchainService _blockchainService;

        public RecordsController(ApplicationDbContext context, EncryptionService encryptionService, BlockchainService blockchainService)
        {
            _context = context;
            _encryptionService = encryptionService;
            _blockchainService = blockchainService;
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string category = "General")
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var patientId = int.Parse(patientIdClaim!);

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var encryptedData = _encryptionService.Encrypt(fileBytes);

            var record = new MedicalRecord
            {
                PatientId = patientId,
                FileName = file.FileName,
                EncryptedData = encryptedData,
                Category = string.IsNullOrWhiteSpace(category) ? "General" : category
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new { message = "File uploaded successfully.", recordId = record.Id });
        }
        
        [HttpGet("mine")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyRecords()
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var records = await _context.MedicalRecords
                .Where(r => r.PatientId == int.Parse(patientIdClaim!))
                .Select(r => new { r.Id, r.FileName, r.Category, r.UploadDate })
                .ToListAsync();
            return Ok(records);
        }

        [HttpGet("audit")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var patientId = int.Parse(patientIdClaim!);

            var logs = await _context.AccessLogs
                .Where(a => a.PatientId == patientId)
                .Join(_context.Users, 
                      log => log.DoctorId, 
                      doc => doc.Id, 
                      (log, doc) => new { log, doc })
                .Join(_context.MedicalRecords,
                      combined => combined.log.RecordId,
                      rec => rec.Id,
                      (combined, rec) => new {
                          Id = combined.log.Id,
                          DoctorName = "Dr. " + combined.doc.Email.Split('@', StringSplitOptions.None)[0],
                          DoctorWallet = combined.doc.WalletAddress,
                          FileName = rec.FileName,
                          AccessTime = combined.log.AccessTime,
                          Status = combined.log.Status
                      })
                .OrderByDescending(l => l.AccessTime)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpGet("audit/stats")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetAuditStats()
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientIdClaim)) return Unauthorized("User session expired or invalid ID.");
            var patientId = int.Parse(patientIdClaim!);

            var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-7);

            var rawStats = await _context.AccessLogs
                .Where(a => a.PatientId == patientId && a.AccessTime >= sevenDaysAgo)
                .GroupBy(a => a.AccessTime.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Accesses = g.Count()
                })
                .OrderBy(s => s.Date)
                .ToListAsync();

            var stats = rawStats.Select(s => new {
                Date = s.Date.ToString("MMM dd"),
                Accesses = s.Accesses
            }).ToList();

            // Fill missing days
            var result = new List<object>();
            for (int i = -6; i <= 0; i++)
            {
                var d = DateTime.UtcNow.Date.AddDays(i).ToString("MMM dd");
                var existing = stats.FirstOrDefault(s => s.Date == d);
                result.Add(new
                {
                    date = d,
                    accesses = existing != null ? existing.Accesses : 0
                });
            }

            return Ok(result);
        }

        [HttpGet("{recordId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Download(int recordId)
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doctor = await _context.Users.FindAsync(int.Parse(doctorIdClaim!));
            if (doctor == null) return Unauthorized("Physician not found in registry.");
            
            var record = await _context.MedicalRecords.Include(r => r.Patient).FirstOrDefaultAsync(r => r.Id == recordId);
            if (record == null) return NotFound("Record not found.");

            // Smart Contract Check
            bool hasAccess = await _blockchainService.CheckAccessAsync(record.Patient!.WalletAddress, doctor!.WalletAddress);
            
            _context.AccessLogs.Add(new AccessLog
            {
                DoctorId = doctor.Id,
                PatientId = record.PatientId,
                RecordId = record.Id,
                Status = hasAccess ? "Granted" : "Denied"
            });
            await _context.SaveChangesAsync();

            if (!hasAccess) return StatusCode(403, "Access to this record is denied by the patient.");

            var decryptedData = _encryptionService.Decrypt(record.EncryptedData);

            return File(decryptedData, "application/octet-stream", record.FileName);
        }
        
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetPatientRecords(int patientId)
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doctor = await _context.Users.FindAsync(int.Parse(doctorIdClaim!));
            if (doctor == null) return Unauthorized("Physician not found in registry.");
            var patient = await _context.Users.FindAsync(patientId);
            if (patient == null) return NotFound("Patient not found.");
            
            bool hasAccess = await _blockchainService.CheckAccessAsync(patient.WalletAddress, doctor!.WalletAddress);
            if (!hasAccess) return StatusCode(403, "Access Denied by Patient");
            
            var records = await _context.MedicalRecords
                .Where(r => r.PatientId == patientId)
                .Select(r => new { r.Id, r.FileName, r.Category, r.UploadDate })
                .ToListAsync();
            return Ok(records);
        }
    }
}
