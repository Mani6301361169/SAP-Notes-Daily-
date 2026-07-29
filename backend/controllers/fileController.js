const File = require('../models/File');
const Note = require('../models/Note');
const ActivityLog = require('../models/ActivityLog');
const { getFileCategory } = require('../middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

// Upload single or multiple files
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided for upload.' });
    }

    const { noteId, folderId } = req.body;

    const savedFiles = await Promise.all(
      req.files.map(async (f) => {
        const fileCategory = getFileCategory(f.mimetype, f.originalname);
        const fileUrl = `/uploads/${f.filename}`;

        return File.create({
          originalName: f.originalname,
          filename: f.filename,
          fileUrl,
          mimeType: f.mimetype,
          fileCategory,
          size: f.size,
          note: noteId || null,
          folder: folderId || null,
          uploadedBy: req.user ? req.user.id : null
        });
      })
    );

    await ActivityLog.create({
      action: 'File Uploaded',
      entityType: 'File',
      entityTitle: savedFiles.map(sf => sf.originalName).join(', '),
      user: req.user ? req.user.name : 'Admin',
      userRole: req.user ? req.user.role : 'admin',
      details: `Uploaded ${savedFiles.length} learning attachment(s).`
    });

    return res.status(201).json({
      message: 'Files uploaded successfully',
      files: savedFiles
    });
  } catch (error) {
    return res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

// Download file endpoint
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File record not found.' });
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File does not exist on server storage.' });
    }

    await ActivityLog.create({
      action: 'Download Successful',
      entityType: 'File',
      entityTitle: file.originalName,
      user: req.user ? req.user.name : 'Learner User',
      userRole: req.user ? req.user.role : 'user',
      details: `Downloaded attachment '${file.originalName}'`
    });

    return res.download(filePath, file.originalName);
  } catch (error) {
    return res.status(500).json({ message: 'File download failed', error: error.message });
  }
};

// Get files for note or folder
exports.getFiles = async (req, res) => {
  try {
    const { noteId, folderId } = req.query;
    const filter = {};
    if (noteId) filter.note = noteId;
    if (folderId) filter.folder = folderId;

    const files = await File.find(filter).sort({ uploadedAt: -1 });
    return res.json({ files });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch files', error: error.message });
  }
};

// Delete File (Admin)
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '../uploads', file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(id);

    return res.json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
};
