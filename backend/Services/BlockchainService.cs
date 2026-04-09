using Nethereum.Web3;
using Nethereum.Web3.Accounts;

namespace HealthcareAPI.Services
{
    public class BlockchainService
    {
        private readonly string _nodeUrl;
        private readonly string _contractAddress;
        private readonly string _adminKey;

        private readonly string _abi = @"[
            {""inputs"":[{""internalType"":""address"",""name"":""_patient"",""type"":""address""},{""internalType"":""address"",""name"":""_doctor"",""type"":""address""}],""name"":""checkAccess"",""outputs"":[{""internalType"":""bool"",""name"":"""",""type"":""bool""}],""stateMutability"":""view"",""type"":""function""},
            {""inputs"":[{""internalType"":""address"",""name"":""_doctor"",""type"":""address""}],""name"":""grantAccess"",""outputs"":[],""stateMutability"":""nonpayable"",""type"":""function""},
            {""inputs"":[{""internalType"":""address"",""name"":""_doctor"",""type"":""address""}],""name"":""revokeAccess"",""outputs"":[],""stateMutability"":""nonpayable"",""type"":""function""}
        ]";

        public BlockchainService(IConfiguration config)
        {
            _nodeUrl = config["Blockchain:NodeUrl"]!;
            _contractAddress = config["Blockchain:SmartContractAddress"]!;
            _adminKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Default Hardhat account 0
        }

        public (string Address, string PrivateKey) GenerateWallet()
        {
            var ecKey = Nethereum.Signer.EthECKey.GenerateKey();
            return (ecKey.GetPublicAddress(), ecKey.GetPrivateKey());
        }

        public async Task FundAccountAsync(string address)
        {
            var adminAccount = new Account(_adminKey);
            var web3 = new Web3(adminAccount, _nodeUrl);
            await web3.Eth.GetEtherTransferService().TransferEtherAndWaitForReceiptAsync(address, 1.0m);
        }

        public async Task<bool> CheckAccessAsync(string patientAddress, string doctorAddress)
        {
            var web3 = new Web3(_nodeUrl);
            var contract = web3.Eth.GetContract(_abi, _contractAddress);
            var checkAccessFunction = contract.GetFunction("checkAccess");
            return await checkAccessFunction.CallAsync<bool>(patientAddress, doctorAddress);
        }

        public async Task GrantAccessAsync(string patientPrivateKey, string doctorAddress)
        {
            var account = new Account(patientPrivateKey);
            var web3 = new Web3(account, _nodeUrl);
            
            // JIT Funding for Dev environments
            var balance = await web3.Eth.GetBalance.SendRequestAsync(account.Address);
            if (balance.Value < Nethereum.Web3.Web3.Convert.ToWei(0.01m))
            {
                await FundAccountAsync(account.Address);
            }

            var contract = web3.Eth.GetContract(_abi, _contractAddress);
            var grantFunction = contract.GetFunction("grantAccess");
            var gas = new Nethereum.Hex.HexTypes.HexBigInteger(500000);
            var receipt = await grantFunction.SendTransactionAndWaitForReceiptAsync(account.Address, gas, null, null, doctorAddress);
            if (receipt.Status.Value == 0) throw new Exception("Transaction reverted");
        }

        public async Task RevokeAccessAsync(string patientPrivateKey, string doctorAddress)
        {
            var account = new Account(patientPrivateKey);
            var web3 = new Web3(account, _nodeUrl);
            
            // JIT Funding for Dev environments
            var balance = await web3.Eth.GetBalance.SendRequestAsync(account.Address);
            if (balance.Value < Nethereum.Web3.Web3.Convert.ToWei(0.01m))
            {
                await FundAccountAsync(account.Address);
            }

            var contract = web3.Eth.GetContract(_abi, _contractAddress);
            var revokeFunction = contract.GetFunction("revokeAccess");
            var gas = new Nethereum.Hex.HexTypes.HexBigInteger(500000);
            var receipt = await revokeFunction.SendTransactionAndWaitForReceiptAsync(account.Address, gas, null, null, doctorAddress);
            if (receipt.Status.Value == 0) throw new Exception("Transaction reverted");
        }
    }
}
