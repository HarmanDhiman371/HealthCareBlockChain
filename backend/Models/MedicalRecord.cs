using System;

namespace HealthcareAPI.Models
{
    public class MedicalRecord
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public required byte[] EncryptedData { get; set; }
        public required string FileName { get; set; }
        public string Category { get; set; } = "General";
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        public User? Patient { get; set; }
    }
}
