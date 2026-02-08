import express from 'express';
import Request from '../models/Request.js';
import Worker from '../models/Worker.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ============ WORKER AVAILABILITY ============

// PUT: Update worker availability status
router.put('/availability', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { status } = req.body;

    if (!status || !['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Status must be: available, busy, or offline' });
    }

    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { availability: status },
      { new: true }
    ).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({
      message: `Availability updated to ${status}`,
      availability: worker.availability
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get current availability status
router.get('/availability', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const worker = await Worker.findById(workerId).select('availability');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({
      availability: worker.availability
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ JOB MANAGEMENT ============

// GET: Get available jobs (not yet assigned) with filters
router.get('/jobs/available', auth, async (req, res) => {
  try {
    const { service, location, minBudget, maxBudget, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = { status: 'open', assignedWorkerId: null };

    if (service) {
      filter.service = service;
    }

    if (location) {
      filter['location.city'] = new RegExp(location, 'i');
    }

    if (minBudget || maxBudget) {
      filter['budget.min'] = {};
      if (minBudget) filter['budget.min'].$gte = parseInt(minBudget);
      if (maxBudget) filter['budget.max'].$lte = parseInt(maxBudget);
    }

    const jobs = await Request.find(filter)
      .populate('homeownerId', 'firstName lastName phone profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(filter);

    res.status(200).json({
      availableJobs: jobs,
      totalAvailable: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get jobs assigned to this worker
router.get('/jobs/assigned', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { assignedWorkerId: workerId };

    if (status) {
      filter.status = status;
    }

    const jobs = await Request.find(filter)
      .populate('homeownerId', 'firstName lastName phone profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(filter);

    // Calculate stats
    const inProgressCount = await Request.countDocuments({
      assignedWorkerId: workerId,
      status: 'in-progress'
    });

    const completedCount = await Request.countDocuments({
      assignedWorkerId: workerId,
      status: 'completed'
    });

    res.status(200).json({
      assignedJobs: jobs,
      totalAssigned: total,
      inProgressCount,
      completedCount,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get specific job details
router.get('/jobs/assigned/:jobId', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;

    const job = await Request.findById(jobId)
      .populate('homeownerId', 'firstName lastName email phone address profileImage');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.assignedWorkerId.toString() !== workerId) {
      return res.status(403).json({ message: 'Not authorized to view this job' });
    }

    res.status(200).json({
      message: 'Job details retrieved',
      job
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Accept a job (assign worker to request)
router.post('/jobs/accept/:requestId', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { requestId } = req.params;

    // Check if request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if already assigned
    if (request.assignedWorkerId) {
      return res.status(400).json({ message: 'This request is already assigned to another worker' });
    }

    // Check if already open
    if (request.status !== 'open') {
      return res.status(400).json({ message: 'This request is no longer available' });
    }

    // Check worker availability
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (worker.availability !== 'available') {
      return res.status(400).json({ message: 'You are not available to accept jobs' });
    }

    // Assign worker and change status to in-progress
    request.assignedWorkerId = workerId;
    request.status = 'in-progress';
    request.assignedDate = new Date();
    await request.save();

    // Update worker job counts
    worker.totalJobs = (worker.totalJobs || 0) + 1;
    await worker.save();

    const populatedRequest = await Request.findById(requestId)
      .populate('homeownerId', 'firstName lastName phone');

    res.status(200).json({
      message: 'Job accepted successfully',
      job: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Complete a job
router.put('/jobs/:jobId/complete', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;
    const { notes } = req.body;

    const job = await Request.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.assignedWorkerId.toString() !== workerId) {
      return res.status(403).json({ message: 'Not authorized to complete this job' });
    }

    if (job.status !== 'in-progress') {
      return res.status(400).json({ message: 'Only in-progress jobs can be completed' });
    }

    // Mark as completed
    job.status = 'completed';
    job.completedDate = new Date();
    if (notes) job.completionNotes = notes;
    await job.save();

    // Update worker completed count
    const worker = await Worker.findById(workerId);
    worker.completedJobs = (worker.completedJobs || 0) + 1;
    await worker.save();

    const populatedJob = await Request.findById(jobId)
      .populate('homeownerId', 'firstName lastName email');

    res.status(200).json({
      message: 'Job marked as completed successfully',
      job: populatedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Reject/Cancel job acceptance
router.put('/jobs/:jobId/reject', auth, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;

    const job = await Request.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.assignedWorkerId.toString() !== workerId) {
      return res.status(403).json({ message: 'Not authorized to reject this job' });
    }

    if (job.status !== 'in-progress') {
      return res.status(400).json({ message: 'Only in-progress jobs can be rejected' });
    }

    // Revert to open
    job.assignedWorkerId = null;
    job.status = 'open';
    job.assignedDate = null;
    await job.save();

    const populatedJob = await Request.findById(jobId)
      .populate('homeownerId', 'firstName lastName');

    res.status(200).json({
      message: 'Job rejected. Request is now open again',
      job: populatedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get worker job statistics
router.get('/stats/jobs', auth, async (req, res) => {
  try {
    const workerId = req.user.id;

    const totalJobs = await Request.countDocuments({ assignedWorkerId: workerId });
    const inProgressJobs = await Request.countDocuments({
      assignedWorkerId: workerId,
      status: 'in-progress'
    });
    const completedJobs = await Request.countDocuments({
      assignedWorkerId: workerId,
      status: 'completed'
    });
    const cancelledJobs = await Request.countDocuments({
      assignedWorkerId: workerId,
      status: 'cancelled'
    });

    const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    res.status(200).json({
      totalJobs,
      inProgressJobs,
      completedJobs,
      cancelledJobs,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
