const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

const getFileCategory = (mimeType, originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  if (mimeType.includes('pdf') || ext === '.pdf') return 'PDF';
  if (mimeType.includes('word') || ext === '.docx' || ext === '.doc') return 'DOCX';
  if (mimeType.includes('presentation') || ext === '.pptx' || ext === '.ppt') return 'PPT';
  if (mimeType.includes('spreadsheet') || ext === '.xlsx' || ext === '.xls' || ext === '.csv') return 'XLSX';
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.includes('zip') || mimeType.includes('compressed') || ext === '.zip' || ext === '.rar') return 'ZIP';
  if (['.abap', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.sql', '.json', '.xml', '.html', '.css', '.txt'].includes(ext)) return 'CODE';
  return 'OTHER';
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max size
});

module.exports = {
  upload,
  getFileCategory
};
