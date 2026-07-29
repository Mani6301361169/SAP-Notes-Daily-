const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  dayNumber: { type: Number, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

folderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Folder', folderSchema);
