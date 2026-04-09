using HealthcareAPI.Data;
using HealthcareAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthcareAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccessController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly BlockchainService _blockchainService;

        public AccessController(ApplicationDbContext context, BlockchainService blockchainService)
        {
            _context = context;
            _blockchainService = blockchainService;
        }

        public class AccessRequestDto
        {
            public required string DoctorWalletAddress { get; set; }
        }

        [HttpPost("grant")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GrantAccess([FromBody] AccessRequestDto request)
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var patient = await _context.Users.FindAsync(int.Parse(patientIdClaim!));
            if (patient == null) return Unauthorized("User session expired or user not found.");

            try
            {
                await _blockchainService.GrantAccessAsync(patient!.WalletPrivateKey, request.DoctorWalletAddress);
                return Ok(new { message = "Access granted successfully on blockchain." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to grant access: {ex.Message}");
            }
        }

        [HttpPost("revoke")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> RevokeAccess([FromBody] AccessRequestDto request)
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var patient = await _context.Users.FindAsync(int.Parse(patientIdClaim!));
            if (patient == null) return Unauthorized("User session expired or user not found.");

            try
            {
                await _blockchainService.RevokeAccessAsync(patient!.WalletPrivateKey, request.DoctorWalletAddress);
                return Ok(new { message = "Access revoked successfully on blockchain." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to revoke access: {ex.Message}");
            }
        }

        [HttpGet("doctors")]
        [Authorize(Roles = "Patient")]
        public IActionResult GetDoctors()
        {
            var doctors = _context.Users.Where(u => u.Role == "Doctor").Select(d => new { d.Id, d.FullName, d.Email, d.WalletAddress }).ToList();
            return Ok(doctors);
        }

        [HttpGet("authorized-doctors")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetAuthorizedDoctors()
        {
            var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var patient = await _context.Users.FindAsync(int.Parse(patientIdClaim!));
            if (patient == null) return Unauthorized("User session expired or user not found.");

            var doctors = _context.Users.Where(u => u.Role == "Doctor").ToList();
            var authorizedDoctors = new List<object>();

            foreach (var doctor in doctors)
            {
                bool hasAccess = await _blockchainService.CheckAccessAsync(patient!.WalletAddress, doctor.WalletAddress);
                if (hasAccess)
                {
                    authorizedDoctors.Add(new { doctor.Id, doctor.FullName, doctor.Email, doctor.WalletAddress });
                }
            }

            return Ok(authorizedDoctors);
        }

        [HttpGet("authorized-patients")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetAuthorizedPatients()
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doctorId = int.Parse(doctorIdClaim!);
            var doctor = await _context.Users.FindAsync(doctorId);
            if (doctor == null) return Unauthorized("User session expired or user not found.");

            var patients = await _context.Users.Where(u => u.Role == "Patient").ToListAsync();
            var pinnedPatientIds = await _context.PinnedPatients
                .Where(p => p.DoctorId == doctorId)
                .Select(p => p.PatientId)
                .ToListAsync();

            var authorizedPatients = new List<object>();

            foreach (var patient in patients)
            {
                bool hasAccess = await _blockchainService.CheckAccessAsync(patient.WalletAddress, doctor!.WalletAddress);
                if (hasAccess)
                {
                    authorizedPatients.Add(new { 
                        patient.Id, 
                        patient.FullName,
                        patient.Email, 
                        patient.WalletAddress,
                        IsPinned = pinnedPatientIds.Contains(patient.Id)
                    });
                }
            }

            return Ok(authorizedPatients);
        }

        [HttpPost("pin/{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> PinPatient(int patientId)
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doctorId = int.Parse(doctorIdClaim!);

            if (!await _context.PinnedPatients.AnyAsync(p => p.DoctorId == doctorId && p.PatientId == patientId))
            {
                _context.PinnedPatients.Add(new Models.PinnedPatient { DoctorId = doctorId, PatientId = patientId });
                await _context.SaveChangesAsync();
            }
            return Ok(new { message = "Patient pinned successfully." });
        }

        [HttpDelete("pin/{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UnpinPatient(int patientId)
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var doctorId = int.Parse(doctorIdClaim!);

            var pin = await _context.PinnedPatients.FirstOrDefaultAsync(p => p.DoctorId == doctorId && p.PatientId == patientId);
            if (pin != null)
            {
                _context.PinnedPatients.Remove(pin);
                await _context.SaveChangesAsync();
            }
            return Ok(new { message = "Patient unpinned successfully." });
        }
    }
}
