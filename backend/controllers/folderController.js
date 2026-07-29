const Folder = require('../models/Folder');
const Note = require('../models/Note');
const ActivityLog = require('../models/ActivityLog');

// Get all active/non-archived folders chronologically
exports.getFolders = async (req, res) => {
  try {
    const { showArchived } = req.query;
    const filter = showArchived === 'true' ? {} : { isArchived: false };

    const folders = await Folder.find(filter).sort({ order: 1, dayNumber: 1, createdAt: 1 });
    
    // Attach note count to each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const noteCount = await Note.countDocuments({ folder: folder._id });
        return {
          ...folder.toObject(),
          noteCount
        };
      })
    );

    return res.json({ folders: foldersWithCounts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch folders', error: error.message });
  }
};

// Create new day folder (Admin)
exports.createFolder = async (req, res) => {
  try {
    const { title, dayNumber, description } = req.body;
    if (!title || dayNumber === undefined) {
      return res.status(400).json({ message: 'Title and Day Number are required.' });
    }

    const count = await Folder.countDocuments();
    const folder = await Folder.create({
      title: title.startsWith('📁') ? title : `📁 ${title}`,
      dayNumber: Number(dayNumber),
      description: description || '',
      order: count + 1,
      createdBy: req.user.id
    });

    await ActivityLog.create({
      action: 'Folder Created',
      entityType: 'Folder',
      entityTitle: folder.title,
      user: req.user.name,
      userRole: req.user.role,
      details: `Created folder '${folder.title}' (Day ${folder.dayNumber})`
    });

    return res.status(201).json({ message: 'Folder created successfully', folder });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create folder', error: error.message });
  }
};

// Update / Rename Folder (Admin)
exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dayNumber, description } = req.body;

    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    if (title) folder.title = title;
    if (dayNumber !== undefined) folder.dayNumber = Number(dayNumber);
    if (description !== undefined) folder.description = description;

    await folder.save();

    await ActivityLog.create({
      action: 'Folder Updated',
      entityType: 'Folder',
      entityTitle: folder.title,
      user: req.user.name,
      userRole: req.user.role,
      details: `Updated folder '${folder.title}'`
    });

    return res.json({ message: 'Folder updated successfully', folder });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update folder', error: error.message });
  }
};

// Delete Folder (Admin)
exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    // Also delete notes inside folder
    await Note.deleteMany({ folder: id });
    await Folder.findByIdAndDelete(id);

    await ActivityLog.create({
      action: 'Folder Deleted',
      entityType: 'Folder',
      entityTitle: folder.title,
      user: req.user.name,
      userRole: req.user.role,
      details: `Deleted folder '${folder.title}' and associated notes.`
    });

    return res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete folder', error: error.message });
  }
};

// Archive Folder (Admin)
exports.archiveFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByIdAndUpdate(id, { isArchived: true }, { new: true });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    await ActivityLog.create({
      action: 'Folder Archived',
      entityType: 'Folder',
      entityTitle: folder.title,
      user: req.user.name,
      userRole: req.user.role,
      details: `Archived folder '${folder.title}'`
    });

    return res.json({ message: 'Folder archived successfully', folder });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to archive folder', error: error.message });
  }
};

// Restore Folder (Admin)
exports.restoreFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByIdAndUpdate(id, { isArchived: false }, { new: true });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    await ActivityLog.create({
      action: 'Folder Restored',
      entityType: 'Folder',
      entityTitle: folder.title,
      user: req.user.name,
      userRole: req.user.role,
      details: `Restored folder '${folder.title}'`
    });

    return res.json({ message: 'Folder restored successfully', folder });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to restore folder', error: error.message });
  }
};

// Reorder Folders (Admin drag-and-drop)
exports.reorderFolders = async (req, res) => {
  try {
    const { folderOrders } = req.body; // Array of { id, order }
    if (!Array.isArray(folderOrders)) {
      return res.status(400).json({ message: 'folderOrders array is required.' });
    }

    await Promise.all(
      folderOrders.map(item => Folder.findByIdAndUpdate(item.id, { order: item.order }))
    );

    return res.json({ message: 'Folders reordered successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reorder folders', error: error.message });
  }
};
