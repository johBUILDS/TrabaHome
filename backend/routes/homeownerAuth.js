import express from 'express';
import Homeowner from '../models/Homeowner.js';
import generateToken from '../utils/generateToken.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone, address } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if homeowner already exists
    const existingHomeowner = await Homeowner.findOne({ email });
    if (existingHomeowner) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new homeowner
    const homeowner = new Homeowner({
      firstName,
      lastName,
      email,
      password,
      phone,
      address: address || {}
    });

    await homeowner.save();

    // Generate token
    const token = generateToken(homeowner._id);

    res.status(201).json({
      message: 'Homeowner registered successfully',
      token,
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup', details: error.message });
  }
});

// Log In
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find homeowner and include password field
    const homeowner = await Homeowner.findOne({ email }).select('+password');
    if (!homeowner) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordCorrect = await homeowner.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(homeowner._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login', details: error.message });
  }
});

// Get Current Homeowner Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const homeowner = await Homeowner.findById(req.user.id);
    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    res.status(200).json({
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
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching profile' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, profileImage } = req.body;

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

    res.status(200).json({
      message: 'Profile updated successfully',
      homeowner: {
        id: homeowner._id,
        firstName: homeowner.firstName,
        lastName: homeowner.lastName,
        email: homeowner.email,
        phone: homeowner.phone,
        address: homeowner.address
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'An error occurred while updating profile' });
  }
});

// Log Out (optional - mainly for frontend to clear token)
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
