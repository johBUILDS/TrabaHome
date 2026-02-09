import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const workerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  profileImage: {
    type: String,
    default: null
  },
  specialization: {
    type: String,
    enum: ['Carpenter', 'Mason', 'Plumber', 'Electrician', 'Cleaner', 'Gardener', 'General Repair'],
    required: [true, 'Specialization is required']
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    default: 0,
    min: 0,
    max: 70
  },
  location: {
    address: String,
    city: String,
    barangay: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  serviceArea: [{
    city: String
  }],
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  priceRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'PHP'
    }
  },
  totalJobs: {
    type: Number,
    default: 0,
    min: 0
  },
  completedJobs: {
    type: Number,
    default: 0,
    min: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  documents: {
    governmentId: String,
    businessPermit: String,
    certifications: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
workerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
workerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Worker', workerSchema);
