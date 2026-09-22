const Business = require('../models/Business');
const validateBusiness = require('../utils/validateBusiness');

/**
 * GET /api/businesses
 * Optional query params: q (search), category (filter)
 * Returns all matching businesses, newest first.
 */
async function listBusinesses(req, res) {
  try {
    const { q, category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (q && q.trim()) {
      const term = q.trim();
      filter.$or = [
        { businessName: { $regex: term, $options: 'i' } },
        { tagline: { $regex: term, $options: 'i' } },
        { city: { $regex: term, $options: 'i' } }
      ];
    }

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    console.error('listBusinesses error:', err);
    res.status(500).json({ error: 'Could not load businesses.' });
  }
}

/**
 * GET /api/businesses/stats
 * Returns { total, cities, categories }
 */
async function getStats(req, res) {
  try {
    const [total, cities, categories] = await Promise.all([
      Business.countDocuments(),
      Business.distinct('city'),
      Business.distinct('category')
    ]);

    res.json({
      total,
      cities: cities.length,
      categories: categories.length
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ error: 'Could not load stats.' });
  }
}

/**
 * POST /api/businesses
 * Body: { businessName, ownerName, category, city, tagline, website, email }
 * Returns the saved business, or 400 with a fields object naming what's wrong.
 */
async function createBusiness(req, res) {
  try {
    const { valid, fields, clean } = validateBusiness(req.body);

    if (!valid) {
      return res.status(400).json({ error: 'Validation failed.', fields });
    }

    const business = await Business.create(clean);
    res.status(201).json(business);
  } catch (err) {
    console.error('createBusiness error:', err);

    if (err.name === 'ValidationError') {
      const fields = {};
      Object.keys(err.errors).forEach(key => {
        fields[key] = err.errors[key].message;
      });
      return res.status(400).json({ error: 'Validation failed.', fields });
    }

    res.status(500).json({ error: 'Could not save business.' });
  }
}

module.exports = { listBusinesses, getStats, createBusiness };
