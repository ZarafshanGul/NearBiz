const express = require('express');
const router = express.Router();
const { listBusinesses, getStats, createBusiness } = require('../controllers/businessController');

// IMPORTANT: /stats must be declared before any /:id-style route
// so "stats" is never mistaken for an id. There is no /:id route
// in this API, but keeping the order is good practice.
router.get('/stats', getStats);
router.get('/', listBusinesses);
router.post('/', createBusiness);

module.exports = router;
