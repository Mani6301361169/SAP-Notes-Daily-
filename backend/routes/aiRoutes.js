const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/check-grammar', optionalAuth, aiController.checkGrammar);

module.exports = router;
