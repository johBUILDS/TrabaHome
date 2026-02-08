import express from 'express';
import RequestHistory from '../models/RequestHistory.js';
import Request from '../models/Request.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to log status change
export async function logStatusChange(requestId, homeownerId, previousStatus, newStatus, changedBy, reason = '', metadata = {}) {
  try {
    const history = new RequestHistory({
      requestId,
      homeownerId,
      previousStatus,
      newStatus,
      changedBy,
      reason,
      metadata
    });
    await history.save();
  } catch (error) {
    console.log('Error logging status change:', error.message);
  }
}

// GET: Get full history for a request
router.get('/request/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify request belongs to homeowner
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this request history' });
    }

    const history = await RequestHistory.find({ requestId })
      .populate('changedBy.userId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      requestId,
      currentStatus: request.status,
      history
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all request status changes for homeowner
router.get('/homeowner/all-history', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const history = await RequestHistory.find({ homeownerId })
      .populate('requestId', 'title service')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RequestHistory.countDocuments({ homeownerId });

    res.status(200).json({
      history,
      totalRecords: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get status timeline (simplified view)
router.get('/request/:requestId/timeline', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const history = await RequestHistory.find({ requestId })
      .select('previousStatus newStatus createdAt reason')
      .sort({ createdAt: 1 });

    // Build timeline
    const timeline = [
      {
        status: 'open',
        timestamp: request.createdAt,
        title: 'Request Posted',
        description: 'You posted this request'
      },
      ...history.map(h => ({
        status: h.newStatus,
        timestamp: h.createdAt,
        title: `Status Changed to ${h.newStatus}`,
        description: h.reason || `Request moved from ${h.previousStatus} to ${h.newStatus}`,
        previousStatus: h.previousStatus
      }))
    ];

    res.status(200).json({
      requestId,
      currentStatus: request.status,
      timeline
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Statistics on request status transitions
router.get('/homeowner/stats', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;

    // Count transitions by status
    const stats = await RequestHistory.aggregate([
      { $match: { homeownerId: mongoose.Types.ObjectId(homeownerId) } },
      {
        $group: {
          _id: '$newStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Count completed vs cancelled requests
    const completedCount = await RequestHistory.countDocuments({
      homeownerId,
      newStatus: 'completed'
    });

    const cancelledCount = await RequestHistory.countDocuments({
      homeownerId,
      newStatus: 'cancelled'
    });

    const totalHistory = await RequestHistory.countDocuments({ homeownerId });

    res.status(200).json({
      totalStatusChanges: totalHistory,
      completedRequests: completedCount,
      cancelledRequests: cancelledCount,
      statsByStatus: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
