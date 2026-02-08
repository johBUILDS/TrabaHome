import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  homeownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homeowner',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Request title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  service: {
    type: String,
    enum: ['Carpenter', 'Mason', 'Plumber', 'Electrician', 'Cleaner', 'Gardener', 'General Repair'],
    required: [true, 'Service type is required']
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
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'PHP'
    }
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null
  },
  images: [{
    type: String,
    default: null
  }],
  deadline: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model('Request', requestSchema);
