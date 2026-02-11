// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract WorkerVerification {
    enum Status { Pending, Approved, Rejected }

    struct Verification {
        string workerId;
        string workerName;
        Status status;
        uint256 timestamp;
        address adminId;
    }

    mapping(string => Verification) public verifications;
    address public admin;

    event WorkerVerificationAdded(string workerId, string workerName, address adminId, uint256 timestamp);
    event WorkerVerificationStatusUpdated(string workerId, Status status, address adminId, uint256 timestamp);

    constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addWorkerVerification(string memory workerId, string memory workerName) public onlyAdmin {
        require(bytes(verifications[workerId].workerId).length == 0, "Worker already verified");
        verifications[workerId] = Verification(workerId, workerName, Status.Pending, block.timestamp, msg.sender);
        emit WorkerVerificationAdded(workerId, workerName, msg.sender, block.timestamp);
    }

    function updateVerificationStatus(string memory workerId, Status status) public onlyAdmin {
        require(bytes(verifications[workerId].workerId).length != 0, "Worker not found");
        verifications[workerId].status = status;
        verifications[workerId].timestamp = block.timestamp;
        verifications[workerId].adminId = msg.sender;
        emit WorkerVerificationStatusUpdated(workerId, status, msg.sender, block.timestamp);
    }

    function getWorkerVerification(string memory workerId) public view returns (Verification memory) {
        require(bytes(verifications[workerId].workerId).length != 0, "Worker not found");
        return verifications[workerId];
    }
}
