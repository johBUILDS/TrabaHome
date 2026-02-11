// Node.js blockchain module for WorkerVerification
// Handles contract interaction and event listening

const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const ganacheUrl = process.env.GANACHE_URL || 'http://127.0.0.1:8545';
const web3 = new Web3(ganacheUrl);

const contractData = require('./WorkerVerification.address.json');
const contract = new web3.eth.Contract(contractData.abi, contractData.address);

// Add worker verification to blockchain
async function addWorkerVerification(workerId, workerName, adminId) {
    const tx = await contract.methods.addWorkerVerification(workerId, workerName)
        .send({ from: adminId, gas: 300000 });
    return tx;
}

// Update worker verification status
async function updateVerificationStatus(workerId, status, adminId) {
    const tx = await contract.methods.updateVerificationStatus(workerId, status)
        .send({ from: adminId, gas: 300000 });
    return tx;
}

// Get worker verification info
async function getWorkerVerification(workerId) {
    return await contract.methods.getWorkerVerification(workerId).call();
}

// Listen to blockchain events for frontend notification
// Usage: listenEvents((addEvent) => {...}, (updateEvent) => {...})
function listenEvents(onAdd, onUpdate) {
    contract.events.WorkerVerificationAdded({}, (err, event) => {
        if (!err && onAdd) {
            console.log('WorkerVerificationAdded event:', event.returnValues);
            onAdd(event);
        }
    });
    contract.events.WorkerVerificationStatusUpdated({}, (err, event) => {
        if (!err && onUpdate) {
            console.log('WorkerVerificationStatusUpdated event:', event.returnValues);
            onUpdate(event);
        }
    });
}

module.exports = {
    addWorkerVerification,
    updateVerificationStatus,
    getWorkerVerification,
    listenEvents,
    contract
};
