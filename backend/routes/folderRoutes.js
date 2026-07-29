const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, folderController.getFolders);
router.post('/', verifyToken, adminOnly, folderController.createFolder);
router.put('/reorder', verifyToken, adminOnly, folderController.reorderFolders);
router.put('/:id', verifyToken, adminOnly, folderController.updateFolder);
router.delete('/:id', verifyToken, adminOnly, folderController.deleteFolder);
router.put('/:id/archive', verifyToken, adminOnly, folderController.archiveFolder);
router.put('/:id/restore', verifyToken, adminOnly, folderController.restoreFolder);

module.exports = router;
