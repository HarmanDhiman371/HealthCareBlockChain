import { expect } from "chai";
import hre from "hardhat";

describe("AccessControl", function () {
  let AccessControl;
  let accessControl;
  let patient;
  let doctor;
  let other;

  beforeEach(async function () {
    [patient, doctor, other] = await hre.ethers.getSigners();
    AccessControl = await hre.ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
  });

  it("Should grant access to a doctor", async function () {
    await accessControl.connect(patient).grantAccess(doctor.address);
    expect(await accessControl.checkAccess(patient.address, doctor.address)).to.be.true;
  });

  it("Should revoke access from a doctor", async function () {
    await accessControl.connect(patient).grantAccess(doctor.address);
    await accessControl.connect(patient).revokeAccess(doctor.address);
    expect(await accessControl.checkAccess(patient.address, doctor.address)).to.be.false;
  });

  it("Should not allow revoking if access not granted", async function () {
    await expect(
      accessControl.connect(patient).revokeAccess(doctor.address)
    ).to.be.revertedWith("Access not granted previously");
  });
});
