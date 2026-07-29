const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, noteController.getNotes);
router.get('/:id', optionalAuth, noteController.getNoteById);

router.post('/', verifyToken, adminOnly, noteController.createNote);
router.put('/:id', verifyToken, adminOnly, noteController.updateNote);
router.delete('/:id', verifyToken, adminOnly, noteController.deleteNote);

router.post('/:id/duplicate', verifyToken, adminOnly, noteController.duplicateNote);
router.put('/:id/move', verifyToken, adminOnly, noteController.moveNote);
router.put('/:id/pin', verifyToken, adminOnly, noteController.togglePin);
router.put('/:id/favorite', optionalAuth, noteController.toggleFavorite);
router.post('/:id/restore-version/:versionNumber', verifyToken, adminOnly, noteController.restoreVersion);

module.exports = router;
