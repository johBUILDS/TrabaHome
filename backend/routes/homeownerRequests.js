import express from 'express';
import Request from '../models/Request.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Create a new request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, service, location, budget, priority, deadline, images } = req.body;

    // Validation
    if (!title || !description || !service || !budget) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (budget.min < 0 || budget.max < 0 || budget.min > budget.max) {
      return res.status(400).json({ error: 'Invalid budget range' });
    }

    // Create new request
    const newRequest = new Request({
      homeownerId: req.user.id,
      title,
      description,
      service,
      location,
      budget,
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : null,
      images: images || []
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Request created successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
});

// Get all homeowner's requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, service, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = { homeownerId: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (service) {
      filter.service = service;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Request.countDocuments(filter);

    // Get requests
    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get single request details
router.get('/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId)
      .populate('homeownerId', 'firstName lastName email phone')
      .populate('assignedWorkerId', 'firstName lastName profileImage rating');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user is homeowner of this request
    if (request.homeownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Update request
router.put('/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { title, description, service, location, budget, priority, deadline, status } = req.body;

    // Find request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check authorization
    if (request.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow updating if request is open
    if (request.status !== 'open') {
      return res.status(400).json({ error: 'Cannot update request with status: ' + request.status });
    }

    // Update fields
    if (title) request.title = title;
    if (description) request.description = description;
    if (service) request.service = service;
    if (location) request.location = location;
    if (budget) request.budget = budget;
    if (priority) request.priority = priority;
    if (deadline) request.deadline = new Date(deadline);
    if (status) request.status = status;

    request.updatedAt = new Date();

    await request.save();

    res.status(200).json({
      message: 'Request updated successfully',
      request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Cancel request
router.put('/:requestId/cancel', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (request.status === 'completed' || request.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel ' + request.status + ' request' });
    }

    request.status = 'cancelled';
    request.updatedAt = new Date();

    await request.save();

    res.status(200).json({
      message: 'Request cancelled successfully',
      request
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Get homeowner dashboard stats
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const homeownerId = req.user.id;

    // Get stats
    const totalRequests = await Request.countDocuments({ homeownerId });
    const openRequests = await Request.countDocuments({ homeownerId, status: 'open' });
    const inProgressRequests = await Request.countDocuments({ homeownerId, status: 'in-progress' });
    const completedRequests = await Request.countDocuments({ homeownerId, status: 'completed' });

    // Get recent requests (last 5)
    const recentRequests = await Request.find({ homeownerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get requests by service type
    const requestsByService = await Request.aggregate([
      { $match: { homeownerId: require('mongoose').Types.ObjectId(homeownerId) } },
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      stats: {
        totalRequests,
        openRequests,
        inProgressRequests,
        completedRequests
      },
      recentRequests,
      requestsByService
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
