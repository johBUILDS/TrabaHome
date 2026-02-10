import express from 'express';
import {
  registerHomeowner,
  verifyHomeownerEmail,
  resendHomeownerVerification,
  loginHomeowner,
  verifyHomeownerLoginOtp,
  getHomeownerMe,
  getHomeownerProfile,
  updateHomeownerProfile,
  logoutHomeowner,
  forgotHomeownerPassword,
  resetHomeownerPassword
} from '../controllers/homeownerAuthController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerHomeowner);
router.post('/signup', registerHomeowner); // Backward compatibility
router.post('/verify-email', verifyHomeownerEmail);
router.post('/resend-verification', resendHomeownerVerification);
router.post('/login', loginHomeowner);
router.post('/login/verify-otp', verifyHomeownerLoginOtp);

router.get('/me', protect, getHomeownerMe);

router.get('/profile', protect, getHomeownerProfile);
router.put('/profile', protect, updateHomeownerProfile);

router.post('/forgot-password', forgotHomeownerPassword);
router.post('/reset-password', resetHomeownerPassword);
router.post('/reset-password/:token', resetHomeownerPassword);

router.post('/logout', protect, logoutHomeowner);

export default router;
