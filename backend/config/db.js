const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

    // Auto-seed initial demo dataset if collections are empty or sync default users
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
    const hashedPassword = await bcrypt.hash('123', 10);

    // Upsert primary user accounts with email mani@gmail.com & password 123
    await User.findOneAndUpdate(
      { email: 'mani@gmail.com' },
      {
        name: 'Mani (SAP Admin)',
        email: 'mani@gmail.com',
        password: hashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { email: 'admin@sap.com' },
      {
        name: 'SAP System Admin',
        email: 'admin@sap.com',
        password: hashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { email: 'user@sap.com' },
      {
        name: 'SAP Learner User',
        email: 'user@sap.com',
        password: hashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      { upsert: true, new: true }
    );

    const folderCount = await Folder.countDocuments();
    if (folderCount === 0) {
      console.log('🌱 Seeding initial SAP Daily Notes Portal folders and notes...');
      const { users, folders } = await getSeedData();

      const adminUser = await User.findOne({ email: 'mani@gmail.com' });

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
        entityTitle: 'SAP Portal Credentials Updated',
        user: 'Mani (SAP Admin)',
        details: 'Updated default credentials to email: mani@gmail.com | password: 123'
      });
    }

    console.log('🎉 Default SAP Folders, Notes, Admin & Learner Accounts synced successfully!');
    console.log('🔑 Primary Credentials: Mail: mani@gmail.com | Password: 123 (Supports Admin & User roles)');

  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
}

module.exports = connectDB;
