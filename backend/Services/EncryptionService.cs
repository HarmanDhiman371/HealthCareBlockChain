using System.Security.Cryptography;
using System.Text;

namespace HealthcareAPI.Services
{
    public class EncryptionService
    {
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public EncryptionService(IConfiguration configuration)
        {
            var keyString = configuration["Encryption:Key"] ?? "12345678901234567890123456789012"; 
            var ivString = configuration["Encryption:IV"] ?? "1234567890123456"; 
            _key = Encoding.UTF8.GetBytes(keyString.Substring(0, 32));
            _iv = Encoding.UTF8.GetBytes(ivString.Substring(0, 16));
        }

        public byte[] Encrypt(byte[] data)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.IV = _iv;
            using var encryptor = aes.CreateEncryptor();
            return encryptor.TransformFinalBlock(data, 0, data.Length);
        }

        public byte[] Decrypt(byte[] encryptedData)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.IV = _iv;
            using var decryptor = aes.CreateDecryptor();
            return decryptor.TransformFinalBlock(encryptedData, 0, encryptedData.Length);
        }
    }
}
