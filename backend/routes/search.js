import express from 'express';
import Worker from '../models/Worker.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Search workers with filters
router.get('/search', async (req, res) => {
  try {
    const { service, location, rating, minRating, maxPrice, page = 1, limit = 20 } = req.query;

    // Build filter
    let filter = { isVerified: true, availability: { $ne: 'offline' } };

    // Filter by specialization/service
    if (service) {
      filter.specialization = service;
    }

    // Filter by location/city
    if (location) {
      filter.$or = [
        { 'location.city': location },
        { 'serviceArea.city': location }
      ];
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Filter by maximum price
    if (maxPrice) {
      filter['priceRange.max'] = { $lte: parseFloat(maxPrice) };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Worker.countDocuments(filter);

    // Get workers
    const workers = await Worker.find(filter)
      .select('-password -documents -email')
      .sort({ rating: -1, totalJobs: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      workers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search workers error:', error);
    res.status(500).json({ error: 'Failed to search workers' });
  }
});

// Get worker profile by ID
router.get('/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId)
      .select('-password -documents.governmentId');

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.status(200).json(worker);
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({ error: 'Failed to fetch worker profile' });
  }
});

// Get available services (unique specializations)
router.get('/meta/services', async (req, res) => {
  try {
    const services = await Worker.distinct('specialization');
    res.status(200).json({ services: services.sort() });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get available locations
router.get('/meta/locations', async (req, res) => {
  try {
    const locations = await Worker.distinct('location.city');
    res.status(200).json({ locations: locations.filter(l => l).sort() });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get top rated workers
router.get('/top/rated', async (req, res) => {
  try {
    const { limit = 10, service } = req.query;

    let filter = { isVerified: true };
    if (service) {
      filter.specialization = service;
    }

    const workers = await Worker.find(filter)
      .select('-password -documents -email')
      .sort({ rating: -1 })
      .limit(parseInt(limit));

    res.status(200).json(workers);
  } catch (error) {
    console.error('Get top rated error:', error);
    res.status(500).json({ error: 'Failed to fetch top rated workers' });
  }
});

export default router;
