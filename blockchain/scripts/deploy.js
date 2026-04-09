import hre from "hardhat";

async function main() {
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();

  await accessControl.waitForDeployment();

  console.log(`AccessControl deployed to ${await accessControl.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
