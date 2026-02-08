import mongoose from 'mongoose';

const requestHistorySchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  homeownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homeowner',
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    required: true
  },
  newStatus: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    required: true
  },
  changedBy: {
    userId: mongoose.Schema.Types.ObjectId,
    userType: {
      type: String,
      enum: ['homeowner', 'worker', 'system'],
      default: 'system'
    }
  },
  reason: {
    type: String,
    maxlength: 250
  },
  notes: {
    type: String,
    maxlength: 500
  },
  metadata: {
    assignedWorkerId: mongoose.Schema.Types.ObjectId,
    completionDate: Date,
    rating: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RequestHistory', requestHistorySchema);
