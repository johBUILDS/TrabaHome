import express from 'express';
import Request from '../models/Request.js';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET: Get completed requests
router.get('/completed', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    const requests = await Request.find({ homeownerId, status: 'completed' })
      .populate('assignedWorkerId', 'firstName lastName specialization averageRating')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get reviews for completed requests
    const requestIds = requests.map(r => r._id);
    const reviews = await Review.find({ requestId: { $in: requestIds } });

    const requestsWithReviews = requests.map(req => ({
      ...req._doc,
      review: reviews.find(r => r.requestId.toString() === req._id.toString())
    }));

    const total = await Request.countDocuments({ homeownerId, status: 'completed' });

    res.status(200).json({
      requests: requestsWithReviews,
      totalCompleted: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get cancelled requests
router.get('/cancelled', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const requests = await Request.find({ homeownerId, status: 'cancelled' })
      .populate('assignedWorkerId', 'firstName lastName specialization')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments({ homeownerId, status: 'cancelled' });

    res.status(200).json({
      requests,
      totalCancelled: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all archived requests (completed + cancelled)
router.get('/', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 15, type = 'all' } = req.query;

    let filter = { homeownerId };

    if (type === 'completed') {
      filter.status = 'completed';
    } else if (type === 'cancelled') {
      filter.status = 'cancelled';
    } else {
      filter.status = { $in: ['completed', 'cancelled'] };
    }

    const requests = await Request.find(filter)
      .populate('assignedWorkerId', 'firstName lastName specialization averageRating profileImage')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(filter);

    res.status(200).json({
      requests,
      totalArchived: total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      filter: type
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Archive statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;

    const completedCount = await Request.countDocuments({ homeownerId, status: 'completed' });
    const cancelledCount = await Request.countDocuments({ homeownerId, status: 'cancelled' });

    // Get completion rate
    const totalArchived = completedCount + cancelledCount;
    const completionRate = totalArchived > 0 ? Math.round((completedCount / totalArchived) * 100) : 0;

    // Get average rating from completed requests
    const reviews = await Review.find({ homeownerId });
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    // Get requests by service type (completed)
    const completedByService = await Request.aggregate([
      { $match: { homeownerId: new(require('mongoose')).Types.ObjectId(homeownerId), status: 'completed' } },
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalArchived,
      completedCount,
      cancelledCount,
      completionRate,
      averageRating: avgRating,
      reviewsCount: reviews.length,
      completedByService
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Requests by service type
router.get('/by-service/:serviceType', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { serviceType } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const requests = await Request.find({
      homeownerId,
      service: serviceType,
      status: { $in: ['completed', 'cancelled'] }
    })
      .populate('assignedWorkerId', 'firstName lastName specialization averageRating')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments({
      homeownerId,
      service: serviceType,
      status: { $in: ['completed', 'cancelled'] }
    });

    res.status(200).json({
      service: serviceType,
      requests,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
