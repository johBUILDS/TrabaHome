import express from 'express';
import Favorite from '../models/Favorite.js';
import Worker from '../models/Worker.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST: Add worker to favorites
router.post('/add/:workerId', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { workerId } = req.params;
    const { reason, tags, notes, rating } = req.body;

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ homeownerId, workerId });
    if (existing) {
      return res.status(400).json({ message: 'Worker already in favorites' });
    }

    // Create favorite
    const favorite = new Favorite({
      homeownerId,
      workerId,
      reason,
      tags: tags || [],
      notes,
      rating
    });

    await favorite.save();

    res.status(201).json({
      message: 'Worker added to favorites',
      favorite
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all favorites
router.get('/', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 10, tag = null, sortBy = 'createdAt' } = req.query;

    let filter = { homeownerId };
    if (tag) {
      filter.tags = tag;
    }

    const favorites = await Favorite.find(filter)
      .populate('workerId', 'firstName lastName specialization averageRating profileImage totalJobs completedJobs')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments(filter);

    res.status(200).json({
      favorites,
      totalFavorites: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get favorites by tag
router.get('/tag/:tag', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const favorites = await Favorite.find({ homeownerId, tags: tag })
      .populate('workerId', 'firstName lastName specialization averageRating profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments({ homeownerId, tags: tag });

    res.status(200).json({
      tag,
      favorites,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get favorite worker details
router.get('/:favId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.favId)
      .populate('workerId');

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    if (favorite.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Update favorite
router.put('/:favId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.favId);

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    if (favorite.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { reason, tags, notes, rating } = req.body;

    if (reason) favorite.reason = reason;
    if (tags) favorite.tags = tags;
    if (notes) favorite.notes = notes;
    if (rating) favorite.rating = rating;

    favorite.updatedAt = new Date();
    await favorite.save();

    res.status(200).json({
      message: 'Favorite updated',
      favorite
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Remove from favorites
router.delete('/:favId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.favId);

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    if (favorite.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Favorite.findByIdAndDelete(req.params.favId);

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Remove worker by ID (alternative endpoint)
router.delete('/worker/:workerId', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { workerId } = req.params;

    const result = await Favorite.findOneAndDelete({ homeownerId, workerId });

    if (!result) {
      return res.status(404).json({ message: 'Worker not in favorites' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all favorite tags
router.get('/tags/list', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;

    const favorites = await Favorite.find({ homeownerId })
      .select('tags');

    const uniqueTags = [...new Set(favorites.flatMap(f => f.tags || []))];

    res.status(200).json({
      tags: uniqueTags,
      tagCount: uniqueTags.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Check if worker is favorited
router.get('/check/:workerId', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { workerId } = req.params;

    const favorite = await Favorite.findOne({ homeownerId, workerId });

    res.status(200).json({
      isFavorited: !!favorite,
      favorite: favorite || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
