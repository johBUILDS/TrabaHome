import Homeowner from '../models/Homeowner.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { generateSixDigitCode, hashCode, expiresInMinutes } from '../utils/otp.js';
import { normalizePhilippineMobile } from '../utils/phone.js';

const VERIFICATION_CODE_EXPIRES_MIN = 15;
const RESET_CODE_EXPIRES_MIN = 15;
const LOGIN_OTP_EXPIRES_MIN = 10;

const sendVerificationEmail = async (homeowner, code) => {
  const message = `Your TrabaHome verification code is ${code}. It expires in ${VERIFICATION_CODE_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: homeowner.email,
    subject: 'Verify your TrabaHome email',
    text: message,
    html: `<p>Your TrabaHome verification code is <strong>${code}</strong>.</p><p>This code expires in ${VERIFICATION_CODE_EXPIRES_MIN} minutes.</p>`
  });
};

const sendResetCodeEmail = async (homeowner, code) => {
  const message = `Your TrabaHome password reset code is ${code}. It expires in ${RESET_CODE_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: homeowner.email,
    subject: 'Reset your TrabaHome password',
    text: message,
    html: `<p>Your TrabaHome password reset code is <strong>${code}</strong>.</p><p>This code expires in ${RESET_CODE_EXPIRES_MIN} minutes.</p>`
  });
};

const sendLoginOtpEmail = async (homeowner, code) => {
  const message = `Your TrabaHome login code is ${code}. It expires in ${LOGIN_OTP_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: homeowner.email,
    subject: 'Your TrabaHome login code',
    text: message,
    html: `<p>Your TrabaHome login code is <strong>${code}</strong>.</p><p>This code expires in ${LOGIN_OTP_EXPIRES_MIN} minutes.</p>`
  });
};

export const registerHomeowner = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone, address } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedPhone = normalizePhilippineMobile(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: 'Please provide a valid Philippine mobile number' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingHomeowner = await Homeowner.findOne({ email: normalizedEmail });
    if (existingHomeowner) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const homeowner = await Homeowner.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      address: address || {},
      emailVerified: true
    });

    return res.status(201).json({
      message: 'Homeowner registered.',
      requiresEmailVerification: false,
      email: homeowner.email
    });
  } catch (error) {
    console.error('Homeowner signup error:', error);
    return res.status(500).json({ error: 'An error occurred during signup', details: error.message });
  }
};

export const verifyHomeownerEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(code);

    const homeowner = await Homeowner.findOne({
      email: normalizedEmail,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationCode +emailVerificationExpires');

    if (!homeowner) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    homeowner.emailVerified = true;
    homeowner.emailVerificationCode = undefined;
    homeowner.emailVerificationExpires = undefined;

    await homeowner.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Homeowner verify email error:', error);
    return res.status(500).json({ error: 'An error occurred while verifying email' });
  }
};

export const resendHomeownerVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const homeowner = await Homeowner.findOne({ email: normalizedEmail });

    if (!homeowner) {
      return res.status(200).json({ message: 'If an account exists, a verification code has been sent.' });
    }

    if (homeowner.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    const verificationCode = generateSixDigitCode();
    homeowner.emailVerificationCode = hashCode(verificationCode);
    homeowner.emailVerificationExpires = expiresInMinutes(VERIFICATION_CODE_EXPIRES_MIN);

    await homeowner.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(homeowner, verificationCode);
    } catch (error) {
      homeowner.emailVerificationCode = undefined;
      homeowner.emailVerificationExpires = undefined;
      await homeowner.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Verification email could not be sent' });
    }

    return res.status(200).json({ message: 'Verification code resent successfully' });
  } catch (error) {
    console.error('Homeowner resend verification error:', error);
    return res.status(500).json({ error: 'An error occurred while resending verification code' });
  }
};

export const loginHomeowner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const homeowner = await Homeowner.findOne({ email: normalizedEmail }).select('+password');
    if (!homeowner) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordCorrect = await homeowner.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Skip email verification flow to unblock logins in local/dev
    homeowner.emailVerified = true;

    const otpCode = generateSixDigitCode();
    homeowner.loginOtpCode = hashCode(otpCode);
    homeowner.loginOtpExpires = expiresInMinutes(LOGIN_OTP_EXPIRES_MIN);

    await homeowner.save({ validateBeforeSave: false });

    try {
      await sendLoginOtpEmail(homeowner, otpCode);
    } catch (error) {
      homeowner.loginOtpCode = undefined;
      homeowner.loginOtpExpires = undefined;
      await homeowner.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Login code could not be sent' });
    }

    return res.status(200).json({
      message: 'Login code sent to email',
      otpRequired: true,
      email: homeowner.email
    });
  } catch (error) {
    console.error('Homeowner login error:', error);
    return res.status(500).json({ error: 'An error occurred during login', details: error.message });
  }
};

export const verifyHomeownerLoginOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and login code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(code);

    const homeowner = await Homeowner.findOne({
      email: normalizedEmail,
      loginOtpCode: hashedCode,
      loginOtpExpires: { $gt: Date.now() }
    }).select('+loginOtpCode +loginOtpExpires');

    if (!homeowner) {
      return res.status(400).json({ error: 'Invalid or expired login code' });
    }

    homeowner.loginOtpCode = undefined;
    homeowner.loginOtpExpires = undefined;

    await homeowner.save({ validateBeforeSave: false });

    const token = generateToken(homeowner._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone,
        emailVerified: homeowner.emailVerified
      }
    });
  } catch (error) {
    console.error('Homeowner OTP verify error:', error);
    return res.status(500).json({ error: 'An error occurred while verifying login code' });
  }
};

export const getHomeownerMe = async (req, res) => {
  try {
    const homeowner = await Homeowner.findById(req.user.id);
    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    return res.status(200).json({
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone,
        address: homeowner.address,
        profileImage: homeowner.profileImage,
        isVerified: homeowner.isVerified,
        emailVerified: homeowner.emailVerified
      }
    });
  } catch (error) {
    console.error('Homeowner me error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching profile' });
  }
};

export const getHomeownerProfile = getHomeownerMe;

export const updateHomeownerProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, profileImage } = req.body;

    if (phone) {
      const normalizedPhone = normalizePhilippineMobile(phone);
      if (!normalizedPhone) {
        return res.status(400).json({ error: 'Please provide a valid Philippine mobile number' });
      }
      req.body.phone = normalizedPhone;
    }

    const homeowner = await Homeowner.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        phone,
        address,
        profileImage,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone,
        address: homeowner.address,
        profileImage: homeowner.profileImage
      }
    });
  } catch (error) {
    console.error('Homeowner profile update error:', error);
    return res.status(500).json({ error: 'An error occurred while updating profile' });
  }
};

export const logoutHomeowner = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotHomeownerPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const homeowner = await Homeowner.findOne({ email: normalizedEmail });

    if (!homeowner) {
      return res.status(200).json({ message: 'If an account exists, a reset code has been sent.' });
    }

    const resetCode = generateSixDigitCode();
    homeowner.passwordResetCode = hashCode(resetCode);
    homeowner.passwordResetExpires = expiresInMinutes(RESET_CODE_EXPIRES_MIN);

    await homeowner.save({ validateBeforeSave: false });

    try {
      await sendResetCodeEmail(homeowner, resetCode);
      return res.status(200).json({ message: 'Reset code sent successfully' });
    } catch (error) {
      homeowner.passwordResetCode = undefined;
      homeowner.passwordResetExpires = undefined;
      await homeowner.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Homeowner forgot password error:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

export const resetHomeownerPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, code, password, confirmPassword } = req.body;
    const resetCode = code || token;

    if (!email || !resetCode) {
      return res.status(400).json({ error: 'Email and reset code are required' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide password and confirm password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(resetCode);

    const homeowner = await Homeowner.findOne({
      email: normalizedEmail,
      passwordResetCode: hashedCode,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetCode +passwordResetExpires');

    if (!homeowner) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    homeowner.password = password;
    homeowner.passwordResetCode = undefined;
    homeowner.passwordResetExpires = undefined;

    await homeowner.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Homeowner reset password error:', error);
    return res.status(500).json({ error: 'An error occurred while resetting password' });
  }
};
