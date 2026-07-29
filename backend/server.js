const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');
const noteRoutes = require('./routes/noteRoutes');
const fileRoutes = require('./routes/fileRoutes');
const aiRoutes = require('./routes/aiRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Connect MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SAP Daily Notes Portal API',
    timestamp: new Date().toISOString()
  });
});

// Production Static Serving for Render single-repo deployment
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'API Route Not Found' });
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SAP Daily Notes Portal Backend active on port ${PORT}`);
  console.log(`📡 Base API Endpoint: http://localhost:${PORT}/api`);
});
