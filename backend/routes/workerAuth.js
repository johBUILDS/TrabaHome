import express from 'express';
import {
  registerWorker,
  verifyWorkerEmail,
  resendWorkerVerification,
  loginWorker,
  verifyWorkerLoginOtp,
  getWorkerMe,
  getWorkerProfile,
  updateWorkerProfile,
  logoutWorker,
  forgotWorkerPassword,
  resetWorkerPassword,
  getPublicWorkerProfile,
  extractWorkerIdInfo
} from '../controllers/workerAuthController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerWorker);
router.post('/signup', registerWorker); // Optional alias
router.post('/id-ocr', extractWorkerIdInfo);
router.post('/verify-email', verifyWorkerEmail);
router.post('/resend-verification', resendWorkerVerification);
router.post('/login', loginWorker);
router.post('/login/verify-otp', verifyWorkerLoginOtp);

router.get('/me', protect, getWorkerMe);

router.get('/profile', protect, getWorkerProfile);
router.put('/profile', protect, updateWorkerProfile);

router.post('/forgot-password', forgotWorkerPassword);
router.post('/reset-password', resetWorkerPassword);
router.post('/reset-password/:token', resetWorkerPassword);

router.post('/logout', protect, logoutWorker);

router.get('/public/:workerId', getPublicWorkerProfile);

export default router;
