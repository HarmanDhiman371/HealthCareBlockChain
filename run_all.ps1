Write-Host "Starting HealthChain Local Environment..." -ForegroundColor Cyan

# 1. Start Hardhat Node
Write-Host "1. Starting Hardhat Blockchain Node..."
Start-Process -NoNewWindow -FilePath "npx.cmd" -ArgumentList "hardhat", "node" -WorkingDirectory ".\blockchain"
Start-Sleep -Seconds 5

# 2. Deploy Smart Contract
Write-Host "2. Deploying Smart Contract to Local Node..."
Start-Process -NoNewWindow -Wait -FilePath "npx.cmd" -ArgumentList "hardhat", "run", "scripts/deploy.js", "--network", "localhost" -WorkingDirectory ".\blockchain" -RedirectStandardOutput ".\blockchain\deploy_output.txt"

# 3. Start Backend API
Write-Host "3. Starting Backend API on http://localhost:5000..."
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", "http://localhost:5000" -WorkingDirectory ".\backend"

# 4. Start Frontend
Write-Host "4. Starting React Frontend..."
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory ".\frontend"

Write-Host "Environment successfully started!" -ForegroundColor Green
Write-Host "Frontend is running at http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API is running at http://localhost:5000" -ForegroundColor Yellow
Write-Host "Blockchain Node is running on http://127.0.0.1:8545" -ForegroundColor Yellow
