// Express.js API routes for worker verification
import express from 'express';
import blockchain from '../blockchain/blockchain.cjs';
import Worker from '../models/Worker.js';
import { isAdmin } from '../middleware/auth.js';
const router = express.Router();

// POST /api/worker/add
router.post('/add', isAdmin, async (req, res) => {
    const { workerId, workerName } = req.body;
    const adminId = req.user.ethAddress; // Assume JWT/session provides ethAddress
    try {
        const tx = await blockchain.addWorkerVerification(workerId, workerName, adminId);
        // Store tx hash in MongoDB
        await Worker.findOneAndUpdate(
            { workerId },
            { $set: { workerName, verificationTx: tx.transactionHash } },
            { upsert: true }
        );
        res.json({ success: true, txHash: tx.transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/worker/:id/verify
router.put('/:id/verify', isAdmin, async (req, res) => {
    const workerId = req.params.id;
    const { status } = req.body;
    const adminId = req.user.ethAddress;
    try {
        const tx = await blockchain.updateVerificationStatus(workerId, status, adminId);
        await Worker.findOneAndUpdate(
            { workerId },
            { $set: { verificationStatus: status, verificationTx: tx.transactionHash } }
        );
        res.json({ success: true, txHash: tx.transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/worker/:id
router.get('/:id', async (req, res) => {
    const workerId = req.params.id;
    try {
        const info = await blockchain.getWorkerVerification(workerId);
        res.json(info);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;
