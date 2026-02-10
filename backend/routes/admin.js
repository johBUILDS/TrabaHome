import express from 'express';
import protect from '../middlewares/auth.js';
import { approveWorker } from '../controllers/workerAuthController.js';

const router = express.Router();

// NOTE: add real admin auth/role checks when available
router.put('/workers/:id/approve', protect, approveWorker);

export default router;
