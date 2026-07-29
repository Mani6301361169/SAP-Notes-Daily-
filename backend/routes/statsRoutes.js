const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, adminOnly, statsController.getDashboardStats);
router.get('/search', optionalAuth, statsController.globalSearch);

module.exports = router;
