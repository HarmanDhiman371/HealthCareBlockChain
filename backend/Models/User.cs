namespace HealthcareAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; } // "Patient" or "Doctor"
        public required string WalletAddress { get; set; }
        public required string WalletPrivateKey { get; set; } 
    }
}
