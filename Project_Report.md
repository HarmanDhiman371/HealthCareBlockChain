# Healthcare Blockchain System - Project Report

## 1. Project Overview & Architecture
The **Healthcare Blockchain System** is a decentralized, secure, and modern web application designed to give patients complete control over who can access their medical records. The application ensures data integrity, transparency, and privacy by combining a traditional web architecture (for fast data retrieval and user experience) with blockchain technology (for immutable access control).

The system operates using a **hybrid architecture** that consists of three main components:
1. **Frontend (Client Application):** The user interface where doctors and patients interact with the system.
2. **Backend (API Layer):** The central server that handles user authentication, business logic, and communication with the database and the blockchain.
3. **Blockchain (Smart Contracts):** The decentralized ledger that acts as the single source of truth for access-control permissions (who is allowed to view what).

---

## 2. Technology Stack

### Frontend Stack
*   **React (via Vite):** A modern, fast JavaScript library for building user interfaces. Vite is used as the build tool for extremely fast hot-module replacement and optimized builds.
*   **Tailwind CSS:** A utility-first CSS framework that allows for rapid UI development and helps achieve a premium, modern design without leaving the HTML/JSX.
*   **React Router:** For seamless, single-page application navigation.
*   **Axios:** For making asynchronous HTTP requests to the backend API.

### Backend Stack
*   **ASP.NET Core (C#.NET):** A robust, high-performance, open-source framework for building modern cloud-based APIs.
*   **Entity Framework (EF) Core:** An Object-Relational Mapper (ORM) that enables .NET developers to work with a database using .NET objects, eliminating the need for most data-access code.
*   **SQL Server / SQLite:** A relational database management system used to store off-chain data securely (like User Profiles, Encrypted Medical Records, and Access Logs).
*   **Nethereum:** The .NET integration library for Ethereum. It allows the ASP.NET Core backend to interact directly with the Ethereum blockchain and smart contracts.
*   **JWT (JSON Web Tokens):** Used for stateless, secure user authentication and authorization across the application.

### Blockchain Stack
*   **Solidity:** An object-oriented programming language for writing smart contracts on Ethereum-based blockchains.
*   **Hardhat:** A development environment to compile, deploy, test, and debug Ethereum software.
*   **Local Node (Hardhat Network):** A local Ethereum network designed for development.

---

## 3. How the Components Work Together

### A. The User Journey (Frontend)
When a user (Patient or Doctor) opens the application, they are greeted by a modern React interface. They log in, and a **JWT** is issued by the backend to securely keep them authenticated. 
*   **Patients** use the dashboard to view their records and manage permissions—specifically, choosing which doctors are allowed to view their specific data. 
*   **Doctors** use their dashboard to request access to a patient's records or view records they already have access to.

### B. The Server Logic (Backend)
The ASP.NET Core backend acts as the secure bridge. It receives requests from the frontend and evaluates what to do:
1. If the request is about user login or fetching an off-chain medical record, it queries the **relational database**.
2. If the request is about **granting, revoking, or checking permissions**, it invokes the `BlockchainService`.
3. The `BlockchainService` uses **Nethereum** to securely sign transactions and interact with the Smart Contract deployed on the local blockchain.
4. It also maintains an **Audit Log** in the database to track off-chain activities, ensuring maximum traceability.

### C. The Source of Truth (Blockchain)
The core mechanism of security is the `AccessControl.sol` smart contract. 
Instead of storing permissions in a central, alterable database, permissions are written to the blockchain ledger. 
*   When a patient grants a doctor access, a transaction is submitted to the smart contract modifying the on-chain mapping `patient -> doctor -> bool (true/false)`.
*   When a doctor tries to read the record, the backend queries the blockchain's `checkAccess` function. If the blockchain returns `true`, the backend fetches the encrypted file from the database and returns it. If `false`, the request is denied. 
Because this rule is enforced mathematically by the smart contract, it is tamper-proof.

---

## 4. Why We Are Using a Local Blockchain (Hardhat) Instead of Mainnet

For this academic and development phase of the project, executing our smart contracts on a local Hardhat blockchain rather than a public "real" blockchain (like Ethereum Mainnet or a Testnet like Sepolia) is a deliberate architectural decision. Here are the valid academic and technical reasons for this approach:

### 1. Cost Efficiency (Zero Gas Fees)
Every single operation that modifies data on a real blockchain requires a transaction fee paid in cryptocurrency (Gas). In a development lifecycle where contracts are deployed, tested, and modified hundreds of times, deploying to a real network would be financially unfeasible. A local network is completely free to operate and provides simulated ETH for limitless testing.

### 2. Speed and Determinism
Public blockchains have block mining times ranging from 12 seconds to several minutes depending on network congestion. This slow feedback loop is completely counter-productive during active software development. A local Hardhat node processes and mines transactions instantaneously, enabling rapid iteration and automated testing.

### 3. Ease of Debugging and System Tracking
A local node gives the developer root access to the entire blockchain state. Hardhat allows us to use `console.log` directly inside Solidity smart contracts—a feature impossible on a real blockchain. It provides exact, human-readable error messages and stack traces if a transaction reverts, which is crucial for identifying bugs and ensuring system stability for academic evaluation.

### 4. Privacy and Data Security
Healthcare applications deal with Highly Sensitive Personal Information (HIPAA-compliant scenarios). Even during development, broadcasting experimental healthcare access structures to a public global ledger poses an unnecessary risk. A local blockchain guarantees that all transaction data never leaves the host machine.

### 5. Seamless Academic Demonstration
Testnets rely on external variables such as functioning RPC URLs, external network congestion, and the availability of "faucet" testing tokens. If any of these third-party services fail during a presentation or grading session, the project fails to work. Running the system locally guarantees **100% uptime and reliability** during demonstrations, ensuring the architecture can be showcased flawlessly without internet dependency.

### Conclusion
By utilizing a local blockchain, we maintain all the cryptographic security, immutability, and decentralization principles required by the project's conceptual goals, while optimizing for development speed, zero cost, and reliable academic demonstration.
