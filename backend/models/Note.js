const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  content: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  tags: [{ type: String, trim: true }],
  sapModule: { 
    type: String, 
    enum: ['MM', 'SD', 'FICO', 'ABAP', 'BASIS', 'PP', 'PM', 'QM', 'WM', 'GENERAL'],
    default: 'GENERAL' 
  },
  author: { type: String, default: 'SAP Administrator' },
  isPinned: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  versions: [versionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
