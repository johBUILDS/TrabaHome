import express from 'express';
import Worker from '../models/Worker.js';
import auth from '../middleware/auth.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// POST: Worker Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if worker exists
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await worker.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(worker._id);

    // Prepare worker data (exclude password)
    const workerData = {
      _id: worker._id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
      phone: worker.phone,
      specialization: worker.specialization,
      profileImage: worker.profileImage,
      isVerified: worker.isVerified,
      averageRating: worker.averageRating,
      totalJobs: worker.totalJobs,
      completedJobs: worker.completedJobs,
      totalRatings: worker.totalRatings
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      worker: workerData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get Worker Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const workerId = req.user.id;

    const worker = await Worker.findById(workerId).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      worker
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Update Worker Profile
router.put('/profile', auth, async (req, res) => {
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

    // Update fields
    if (firstName) worker.firstName = firstName;
    if (lastName) worker.lastName = lastName;
    if (phone) worker.phone = phone;
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

    res.status(200).json({
      message: 'Profile updated successfully',
      worker: worker.toObject({ getters: true })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Logout (frontend responsibility to clear token)
router.post('/logout', auth, async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get public worker profile (viewable by anyone)
router.get('/public/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId).select('-password -governmentId -businessPermit');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({
      message: 'Worker profile retrieved',
      worker
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
