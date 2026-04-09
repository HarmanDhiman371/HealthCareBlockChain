using System;

namespace HealthcareAPI.Models
{
    public class AccessLog
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public int RecordId { get; set; }
        public DateTime AccessTime { get; set; } = DateTime.UtcNow;
        public required string Status { get; set; } // "Granted", "Denied"
    }
}
