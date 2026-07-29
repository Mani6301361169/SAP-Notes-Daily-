const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { upload } = require('../middleware/uploadMiddleware');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.post('/upload', verifyToken, adminOnly, upload.array('files', 10), fileController.uploadFiles);
router.get('/', optionalAuth, fileController.getFiles);
router.get('/download/:id', optionalAuth, fileController.downloadFile);
router.delete('/:id', verifyToken, adminOnly, fileController.deleteFile);

module.exports = router;
