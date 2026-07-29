const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileCategory: { 
    type: String, 
    enum: ['PDF', 'DOCX', 'PPT', 'XLSX', 'IMAGE', 'ZIP', 'CODE', 'OTHER'],
    default: 'OTHER' 
  },
  size: { type: Number, required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', default: null },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
