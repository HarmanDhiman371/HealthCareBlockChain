using System;

namespace HealthcareAPI.Models
{
    public class PinnedPatient
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime PinnedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public User? Doctor { get; set; }
        public User? Patient { get; set; }
    }
}
