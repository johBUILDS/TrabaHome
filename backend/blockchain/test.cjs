// Example test script for blockchain integration
process.env.GANACHE_URL = 'http://192.168.1.177:7545';
const blockchain = require('./blockchain.cjs');

async function test() {
    const workerId = 'w123';
    const workerName = 'John Doe';
    // Use the admin address from Ganache (first account)
    const adminId = '0x6BdDC1d83fFec7a1381B92c639cD6F14A4eCA531';

    // Add worker
    const addTx = await blockchain.addWorkerVerification(workerId, workerName, adminId);
    console.log('Add Worker Tx:', addTx.transactionHash);

    // Approve worker
    const approveTx = await blockchain.updateVerificationStatus(workerId, 1, adminId); // 1 = Approved
    console.log('Approve Worker Tx:', approveTx.transactionHash);

    // Get worker info
    const info = await blockchain.getWorkerVerification(workerId);
    console.log('Worker Info:', info);
}

test().catch(console.error);
