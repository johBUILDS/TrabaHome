import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  homeownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homeowner',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  reason: {
    type: String,
    maxlength: 200
  },
  tags: [String],
  notes: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
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

// Ensure unique favorite per homeowner-worker pair
favoriteSchema.index({ homeownerId: 1, workerId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
