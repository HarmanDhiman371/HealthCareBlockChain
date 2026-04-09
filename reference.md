# HealthCare Blockchain Reference

This document explains the architecture, flow, and usage of the HealthCare-BlockChain application.

## How to Run the Blockchain

The project uses a local Hardhat node for the Ethereum blockchain testing environment.

1. **Open a terminal** in the `blockchain` directory.
2. **Start the local Hardhat node**:
   ```bash
   npx hardhat node
   ```
   *This starts the local Ethereum network and creates 20 test accounts with test ETH.*
3. **Deploy the Smart Contract**:
   Open a separate terminal in the `blockchain` directory and run:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   *This compiles the `AccessControl.sol` contract and deploys it to your local node. Ensure the output address matches your backend configuration in `appsettings.json`.*

## How Access is Stored in the Blockchain

Access control is entirely managed on-chain via a smart contract. The contract (`AccessControl.sol`) uses a nested Ethereum `mapping` to securely store Boolean permissions:

```solidity
// patient Address => doctor Address => boolean
mapping(address => mapping(address => bool)) private permissions;
```

- When a patient grants access to a doctor, they submit a transaction to the Smart Contract which sets `permissions[patientAddress][doctorAddress] = true;`. 
- When revoked, it sets the boolean to `false`.
- Every grant or revoke action emits public events (`AccessGranted` and `AccessRevoked`) that can be listened to by off-chain indexers or UI audit logs.
- The off-chain backend relies entirely on the read-only query `checkAccess(patient, doctor)` to decide whether to decrypt and serve the patient's medical record file.

## Wallet Address Usage

Cryptographic wallet addresses (Ethereum Addresses, e.g., `0x71...`) act as the primary identities for both Patients and Doctors in the system.

- **Patient Wallets**: 
  - Patients act as the "owners" of their data. 
  - They use their wallet's private key to digitally **sign** state-changing transactions (like `grantAccess` and `revokeAccess`). 
  - By requiring a cryptographic signature, no administrative party (not even the backend system admin) can grant access on their behalf without possessing their private key.
- **Doctor Wallets**: 
  - Doctors act as the "target subjects".
  - Their public wallet address is maintained by the backend and passed as the target argument to the smart contract functions. 
  - When a doctor tries to download a file, the backend checks the blockchain using the logged-in doctor's wallet address against the patient's wallet address.

## Overall Blockchain Flow and Use Case

The application uses a **hybrid on-chain/off-chain architecture** to solve the dual problems of medical data privacy and the prohibitive costs/limitations of storing large data directly on chains.

1. **Off-Chain Storage (Encrypted Data)**: Medical records (images, PDFs) are too heavy and expensive to store directly on the blockchain. When a patient uploads a file, the backend encrypts it using standard symmetric encryption (e.g., AES) and stores the encrypted blob in a standard SQL database or file storage system.
2. **On-Chain Access Rights (The Source of Truth)**: The "Rights" or "Permissions" to view that record are verified strictly via the immutable public blockchain. 
3. **The Download Flow**:
   - A Doctor requests a patient's record through the API.
   - The backend intercepts the request and queries the Hardhat node on-the-fly: *"Does Doctor 0xABC have access from Patient 0x123?"*
   - The Smart Contract accurately returns `true` or `false`.
   - If `true`, the backend retrieves the encrypted record, decrypts the file in memory, and securely streams it to the doctor.
   - If `false`, the backend immediately rejects the request with an HTTP 403 Forbidden status.

This ensures a robust, immutable audit trail of who is allowed to look at medical records, while keeping the heavy and highly confidential files protected securely off-chain.
