// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AccessControl {
    // patient Address => doctor Address => boolean
    mapping(address => mapping(address => bool)) private permissions;

    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    // Grant a doctor access to the patient's records
    function grantAccess(address _doctor) public {
        require(_doctor != address(0), "Invalid doctor address");
        permissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    // Revoke a doctor's access
    function revokeAccess(address _doctor) public {
        require(permissions[msg.sender][_doctor], "Access not granted previously");
        permissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    // Check if the doctor has access to the patient's records
    function checkAccess(address _patient, address _doctor) public view returns (bool) {
        return permissions[_patient][_doctor];
    }
}
