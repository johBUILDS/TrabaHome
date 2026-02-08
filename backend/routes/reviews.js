import express from 'express';
import Review from '../models/Review.js';
import Request from '../models/Request.js';
import Worker from '../models/Worker.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST: Create a review for a worker
router.post('/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const homeownerId = req.user.id;
    const { rating, title, comment, categories, images } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if request exists and belongs to homeowner
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.homeownerId.toString() !== homeownerId) {
      return res.status(403).json({ message: 'Not authorized to review this request' });
    }

    // Check if request is completed
    if (request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed requests' });
    }

    // Check if worker is assigned
    if (!request.assignedWorkerId) {
      return res.status(400).json({ message: 'No worker assigned to this request' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      requestId,
      homeownerId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this request' });
    }

    // Create review
    const review = new Review({
      requestId,
      workerId: request.assignedWorkerId,
      homeownerId,
      rating,
      title,
      comment,
      categories,
      images
    });

    await review.save();

    // Update worker rating
    const workerReviews = await Review.find({ workerId: request.assignedWorkerId });
    const avgRating = workerReviews.reduce((sum, rev) => sum + rev.rating, 0) / workerReviews.length;

    await Worker.findByIdAndUpdate(
      request.assignedWorkerId,
      {
        totalRatings: workerReviews.length,
        averageRating: Math.round(avgRating * 10) / 10
      }
    );

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all reviews for a worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ workerId })
      .populate('homeownerId', 'firstName lastName profileImage')
      .populate('requestId', 'title service')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ workerId });

    res.status(200).json({
      reviews,
      totalReviews: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all reviews by homeowner
router.get('/homeowner/my-reviews', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ homeownerId })
      .populate('workerId', 'firstName lastName specialization averageRating')
      .populate('requestId', 'title service')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ homeownerId });

    res.status(200).json({
      reviews,
      totalReviews: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get single review
router.get('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('homeownerId', 'firstName lastName profileImage')
      .populate('workerId', 'firstName lastName specialization')
      .populate('requestId', 'title service');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Update review (only if not yet verified)
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (review.isVerified) {
      return res.status(400).json({ message: 'Cannot update verified review' });
    }

    const { rating, title, comment, categories } = req.body;

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }

    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (categories) review.categories = { ...review.categories, ...categories };

    await review.save();

    // Update worker rating
    const workerReviews = await Review.find({ workerId: review.workerId });
    const avgRating = workerReviews.reduce((sum, rev) => sum + rev.rating, 0) / workerReviews.length;

    await Worker.findByIdAndUpdate(
      review.workerId,
      {
        totalRatings: workerReviews.length,
        averageRating: Math.round(avgRating * 10) / 10
      }
    );

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Delete review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Update worker rating
    const workerReviews = await Review.find({ workerId: review.workerId });
    if (workerReviews.length > 0) {
      const avgRating = workerReviews.reduce((sum, rev) => sum + rev.rating, 0) / workerReviews.length;
      await Worker.findByIdAndUpdate(
        review.workerId,
        {
          totalRatings: workerReviews.length,
          averageRating: Math.round(avgRating * 10) / 10
        }
      );
    } else {
      await Worker.findByIdAndUpdate(review.workerId, {
        totalRatings: 0,
        averageRating: 0
      });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
