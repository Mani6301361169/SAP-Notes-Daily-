const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entityType: { type: String, enum: ['Folder', 'Note', 'File', 'User', 'AI'], required: true },
  entityTitle: { type: String, default: '' },
  user: { type: String, default: 'System' },
  userRole: { type: String, default: 'admin' },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
