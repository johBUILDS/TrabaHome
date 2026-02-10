import Worker from '../models/Worker.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { generateSixDigitCode, hashCode, expiresInMinutes } from '../utils/otp.js';
import { normalizePhilippineMobile } from '../utils/phone.js';
// Image verification utility lives in the project root under src/ai
import { verifyWorkerImages } from "../../src/ai/verifyWorkerImages.js";
import { verifyWithPythonAI } from '../utils/pythonAiClient.js';
import { extractIdData } from '../ai/idOcr.js';

const VERIFICATION_CODE_EXPIRES_MIN = 15;
const RESET_CODE_EXPIRES_MIN = 15;
const LOGIN_OTP_EXPIRES_MIN = 10;

const sendVerificationEmail = async (worker, code) => {
  const message = `Your TrabaHome verification code is ${code}. It expires in ${VERIFICATION_CODE_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: worker.email,
    subject: 'Verify your TrabaHome email',
    text: message,
    html: `<p>Your TrabaHome verification code is <strong>${code}</strong>.</p><p>This code expires in ${VERIFICATION_CODE_EXPIRES_MIN} minutes.</p>`
  });
};

const sendResetCodeEmail = async (worker, code) => {
  const message = `Your TrabaHome password reset code is ${code}. It expires in ${RESET_CODE_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: worker.email,
    subject: 'Reset your TrabaHome password',
    text: message,
    html: `<p>Your TrabaHome password reset code is <strong>${code}</strong>.</p><p>This code expires in ${RESET_CODE_EXPIRES_MIN} minutes.</p>`
  });
};

const sendLoginOtpEmail = async (worker, code) => {
  const message = `Your TrabaHome login code is ${code}. It expires in ${LOGIN_OTP_EXPIRES_MIN} minutes.`;

  await sendEmail({
    to: worker.email,
    subject: 'Your TrabaHome login code',
    text: message,
    html: `<p>Your TrabaHome login code is <strong>${code}</strong>.</p><p>This code expires in ${LOGIN_OTP_EXPIRES_MIN} minutes.</p>`
  });
};

export const registerWorker = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      specialization,
      skills,
      experience,
      location,
      serviceArea,
      bio,
      priceRange,
      profileImage,
      documents
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !specialization) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedPhone = normalizePhilippineMobile(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Please provide a valid Philippine mobile number' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingWorker = await Worker.findOne({ email: normalizedEmail });
    if (existingWorker) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const worker = await Worker.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      specialization,
      skills,
      experience,
      location,
      serviceArea,
      bio,
      priceRange,
      profileImage,
      documents,
      emailVerified: true
    });

    return res.status(201).json({
      message: 'Worker registered.',
      requiresEmailVerification: false,
      email: worker.email
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// OCR extraction endpoint for worker IDs
export const extractWorkerIdInfo = async (req, res) => {
  try {
    const { idType, frontImage, backImage } = req.body;
    if (!frontImage || !backImage) {
      return res.status(400).json({ message: 'frontImage and backImage are required (base64 strings)' });
    }
    const fields = await extractIdData({ frontImage, backImage, idType });
    return res.status(200).json({ message: 'ID parsed', fields });
  } catch (error) {
    console.error('ID OCR error:', error);
    return res.status(500).json({ message: 'Failed to parse ID', error: error.message });
  }
};

export const verifyWorkerEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(code);

    const worker = await Worker.findOne({
      email: normalizedEmail,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationCode +emailVerificationExpires');

    if (!worker) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    worker.emailVerified = true;
    worker.emailVerificationCode = undefined;
    worker.emailVerificationExpires = undefined;

    await worker.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendWorkerVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const worker = await Worker.findOne({ email: normalizedEmail });

    if (!worker) {
      return res.status(200).json({ message: 'If an account exists, a verification code has been sent.' });
    }

    if (worker.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationCode = generateSixDigitCode();
    worker.emailVerificationCode = hashCode(verificationCode);
    worker.emailVerificationExpires = expiresInMinutes(VERIFICATION_CODE_EXPIRES_MIN);

    await worker.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(worker, verificationCode);
    } catch (error) {
      worker.emailVerificationCode = undefined;
      worker.emailVerificationExpires = undefined;
      await worker.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Verification email could not be sent' });
    }

    return res.status(200).json({ message: 'Verification code resent successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const worker = await Worker.findOne({ email: normalizedEmail }).select('+password');
    if (!worker) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await worker.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Skip email verification flow to unblock logins in local/dev
    worker.emailVerified = true;

    const otpCode = generateSixDigitCode();
    worker.loginOtpCode = hashCode(otpCode);
    worker.loginOtpExpires = expiresInMinutes(LOGIN_OTP_EXPIRES_MIN);

    await worker.save({ validateBeforeSave: false });

    try {
      await sendLoginOtpEmail(worker, otpCode);
    } catch (error) {
      worker.loginOtpCode = undefined;
      worker.loginOtpExpires = undefined;
      await worker.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Login code could not be sent' });
    }

    return res.status(200).json({
      message: 'Login code sent to email',
      otpRequired: true,
      email: worker.email
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyWorkerLoginOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and login code are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(code);

    const worker = await Worker.findOne({
      email: normalizedEmail,
      loginOtpCode: hashedCode,
      loginOtpExpires: { $gt: Date.now() }
    }).select('+loginOtpCode +loginOtpExpires');

    if (!worker) {
      return res.status(400).json({ message: 'Invalid or expired login code' });
    }

    worker.loginOtpCode = undefined;
    worker.loginOtpExpires = undefined;

    await worker.save({ validateBeforeSave: false });

    const token = generateToken(worker._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      worker: {
        _id: worker._id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        phone: worker.phone,
        specialization: worker.specialization,
        profileImage: worker.profileImage,
        isVerified: worker.isVerified,
        emailVerified: worker.emailVerified,
        rating: worker.rating,
        totalReviews: worker.totalReviews,
        totalJobs: worker.totalJobs,
        completedJobs: worker.completedJobs
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWorkerMe = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    return res.status(200).json({ worker });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    return res.status(200).json({
      message: 'Profile retrieved successfully',
      worker
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateWorkerProfile = async (req, res) => {
  try {
    const workerId = req.user.id;
    const {
      firstName,
      lastName,
      phone,
      specialization,
      bio,
      yearsOfExperience,
      skills,
      location,
      serviceArea,
      priceRange,
      profileImage,
      certifications,
      governmentIdVerified,
      businessPermitVerified
    } = req.body;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (firstName) worker.firstName = firstName;
    if (lastName) worker.lastName = lastName;
    if (phone) {
      const normalizedPhone = normalizePhilippineMobile(phone);
      if (!normalizedPhone) {
        return res.status(400).json({ message: 'Please provide a valid Philippine mobile number' });
      }
      worker.phone = normalizedPhone;
    }
    if (specialization) worker.specialization = specialization;
    if (bio) worker.bio = bio;
    if (yearsOfExperience !== undefined) worker.yearsOfExperience = yearsOfExperience;
    if (skills) worker.skills = skills;
    if (location) worker.location = location;
    if (serviceArea) worker.serviceArea = serviceArea;
    if (priceRange) worker.priceRange = priceRange;
    if (profileImage) worker.profileImage = profileImage;
    if (certifications) worker.certifications = certifications;
    if (governmentIdVerified !== undefined) worker.governmentIdVerified = governmentIdVerified;
    if (businessPermitVerified !== undefined) worker.businessPermitVerified = businessPermitVerified;

    await worker.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      worker: worker.toObject({ getters: true })
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logoutWorker = async (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
};

export const forgotWorkerPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const worker = await Worker.findOne({ email: normalizedEmail });

    if (!worker) {
      return res.status(200).json({ message: 'If an account exists, a reset code has been sent.' });
    }

    const resetCode = generateSixDigitCode();
    worker.passwordResetCode = hashCode(resetCode);
    worker.passwordResetExpires = expiresInMinutes(RESET_CODE_EXPIRES_MIN);

    await worker.save({ validateBeforeSave: false });

    try {
      await sendResetCodeEmail(worker, resetCode);
      return res.status(200).json({ message: 'Reset code sent successfully' });
    } catch (error) {
      worker.passwordResetCode = undefined;
      worker.passwordResetExpires = undefined;
      await worker.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetWorkerPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, code, password, confirmPassword } = req.body;
    const resetCode = code || token;

    if (!email || !resetCode) {
      return res.status(400).json({ message: 'Email and reset code are required' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide password and confirm password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashCode(resetCode);

    const worker = await Worker.findOne({
      email: normalizedEmail,
      passwordResetCode: hashedCode,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetCode +passwordResetExpires');

    if (!worker) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    worker.password = password;
    worker.passwordResetCode = undefined;
    worker.passwordResetExpires = undefined;

    await worker.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPublicWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId).select('-password -governmentId -businessPermit');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    return res.status(200).json({
      message: 'Worker profile retrieved',
      worker
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload documents + AI gate (valid ID + selfie)
export const uploadWorkerDocs = async (req, res) => {
  try {
    const workerId = req.user?.id || req.body.workerId;
    if (!workerId) {
      return res.status(400).json({ message: 'workerId is required' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const validIdFile = req.files?.validId?.[0];
    const selfieFile = req.files?.selfie?.[0];
    if (!validIdFile || !selfieFile) {
      return res.status(400).json({ message: 'validId and selfie files are required' });
    }

    worker.documents.governmentId = validIdFile.path;
    worker.documents.selfieImageUrl = selfieFile.path;

    const { aiStatus, aiIssues } = await verifyWithPythonAI({
      validIdPath: validIdFile.path,
      selfiePath: selfieFile.path
    });

    worker.aiStatus = aiStatus;
    worker.aiIssues = aiIssues;
    worker.isVerified = false; // admin decides

    await worker.save();

    return res.status(200).json({
      message: 'Documents uploaded and AI evaluated',
      aiStatus,
      aiIssues,
      documents: worker.documents
    });
  } catch (error) {
    console.error('Upload docs error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete profile after AI passed
export const completeWorkerProfile = async (req, res) => {
  try {
    const workerId = req.user?.id || req.body.workerId;
    if (!workerId) {
      return res.status(400).json({ message: 'workerId is required' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (worker.aiStatus !== 'passed') {
      return res.status(400).json({ message: 'AI verification must be passed before completing profile' });
    }

    const { provider = '', accountName = '', accountNumber = '' } = req.body.paymentInfo || req.body;

    worker.paymentInfo = {
      provider,
      accountName,
      accountNumber
    };
    worker.profileCompleted = true;

    await worker.save();

    return res.status(200).json({
      message: 'Profile completed',
      profileCompleted: worker.profileCompleted,
      paymentInfo: worker.paymentInfo
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin approval
export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (worker.aiStatus !== 'passed' || worker.profileCompleted !== true) {
      return res.status(400).json({ message: 'Worker must pass AI and complete profile before approval' });
    }

    worker.isVerified = true;
    await worker.save();

    return res.status(200).json({ message: 'Worker approved', isVerified: true });
  } catch (error) {
    console.error('Approve worker error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
