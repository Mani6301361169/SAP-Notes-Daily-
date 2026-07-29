const Folder = require('../models/Folder');
const Note = require('../models/Note');
const User = require('../models/User');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');

// Get Admin Dashboard Overview Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFolders = await Folder.countDocuments({ isArchived: false });
    const totalNotes = await Note.countDocuments({ isDraft: false });
    const totalUsers = await User.countDocuments();

    // Storage Usage
    const files = await File.find().select('size fileCategory originalName uploadedAt');
    const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
    const storageUsageMB = (totalBytes / (1024 * 1024)).toFixed(2);

    // Recent Uploads (last 5)
    const recentUploads = files
      .sort((a, b) => b.uploadedAt - a.uploadedAt)
      .slice(0, 5);

    // Recent Activity (last 10)
    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      stats: {
        totalFolders,
        totalNotes,
        totalUsers,
        totalFiles: files.length,
        storageUsageMB,
        storageUsageBytes: totalBytes
      },
      recentUploads,
      recentActivity
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// Global Search Endpoint
exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.json({ folders: [], notes: [] });
    }

    const regex = new RegExp(query, 'i');

    const folders = await Folder.find({
      $or: [{ title: regex }, { description: regex }]
    }).limit(10);

    const notes = await Note.find({
      $or: [{ title: regex }, { description: regex }, { content: regex }, { tags: regex }]
    })
      .populate('folder', 'title dayNumber')
      .limit(20);

    return res.json({ folders, notes });
  } catch (error) {
    return res.status(500).json({ message: 'Global search failed', error: error.message });
  }
};
