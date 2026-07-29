const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Folder = require('../models/Folder');
const Note = require('../models/Note');
const ActivityLog = require('../models/ActivityLog');
const { getSeedData, getSeedNotes } = require('./defaultData');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('⚡ MONGODB_URI not provided in environment. Initializing Embedded In-Memory MongoDB Server...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB running at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}`);

    // Auto-seed initial demo dataset if collections are empty
    await seedInitialData();

  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed or timed out: ${error.message}`);
    if (!mongoServer) {
      console.log('🔄 Fallback: Starting embedded In-Memory MongoDB database...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        await mongoose.connect(fallbackUri);
        console.log('✅ Connected to Fallback In-Memory MongoDB Database.');
        await seedInitialData();
      } catch (fallbackError) {
        console.error('❌ Failed to start fallback MongoDB server:', fallbackError);
      }
    }
  }
};

async function seedInitialData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial SAP Daily Notes Portal dataset...');
      const { users, folders } = await getSeedData();

      const createdUsers = await User.insertMany(users);
      const adminUser = createdUsers.find(u => u.role === 'admin');

      const folderDocs = folders.map(f => ({ ...f, createdBy: adminUser._id }));
      const createdFolders = await Folder.insertMany(folderDocs);

      const folderMap = {};
      createdFolders.forEach(f => {
        folderMap[f.title] = f._id;
      });

      const seedNotesRaw = getSeedNotes(folderMap);
      const noteDocs = seedNotesRaw.map(n => {
        const folderId = folderMap[n.folderTitle] || createdFolders[0]._id;
        return {
          title: n.title,
          description: n.description,
          content: n.content,
          folder: folderId,
          tags: n.tags,
          sapModule: n.sapModule,
          author: n.author,
          isPinned: n.isPinned,
          isFavorite: n.isFavorite,
          createdBy: adminUser._id,
          versions: [
            {
              versionNumber: 1,
              title: n.title,
              content: n.content,
              savedAt: new Date()
            }
          ]
        };
      });

      await Note.insertMany(noteDocs);

      await ActivityLog.create({
        action: 'System Initialization',
        entityType: 'User',
        entityTitle: 'SAP Portal Pre-Seeded',
        user: 'System Admin',
        details: 'Initial SAP Daily Notes, Day Folders, and User Accounts seeded.'
      });

      console.log('🎉 Default SAP Folders, Notes, Admin & Learner Accounts pre-seeded successfully!');
      console.log('🔑 Credentials: Admin (admin@sap.com / Admin@123) | User (user@sap.com / User@123)');
    }
  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
}

module.exports = connectDB;
