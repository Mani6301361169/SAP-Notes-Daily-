const Note = require('../models/Note');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');

// Get notes with search & filtering
exports.getNotes = async (req, res) => {
  try {
    const { folderId, module: sapModule, tag, search, pinnedOnly, favoritesOnly, isDraft } = req.query;
    const filter = {};

    if (folderId) filter.folder = folderId;
    if (sapModule && sapModule !== 'ALL') filter.sapModule = sapModule;
    if (tag) filter.tags = { $in: [tag] };
    if (pinnedOnly === 'true') filter.isPinned = true;
    if (favoritesOnly === 'true') filter.isFavorite = true;
    if (isDraft !== undefined) filter.isDraft = isDraft === 'true';

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(filter)
      .populate('folder', 'title dayNumber')
      .sort({ isPinned: -1, updatedAt: -1 });

    return res.json({ notes });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

// Get single note by ID with attached files
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id).populate('folder', 'title dayNumber');
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    const attachments = await File.find({ note: id });

    return res.json({ note, attachments });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch note detail', error: error.message });
  }
};

// Create Note (Admin)
exports.createNote = async (req, res) => {
  try {
    const { title, description, content, folderId, tags, sapModule, author, isPinned, isDraft } = req.body;

    if (!title || !folderId) {
      return res.status(400).json({ message: 'Title and folder are required.' });
    }

    const processedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    const note = await Note.create({
      title,
      description: description || '',
      content: content || '<p></p>',
      folder: folderId,
      tags: processedTags,
      sapModule: sapModule || 'GENERAL',
      author: author || (req.user ? req.user.name : 'SAP Administrator'),
      isPinned: Boolean(isPinned),
      isDraft: Boolean(isDraft),
      createdBy: req.user ? req.user.id : null,
      versions: [
        {
          versionNumber: 1,
          title,
          content: content || '',
          savedAt: new Date()
        }
      ]
    });

    await ActivityLog.create({
      action: 'Note Added',
      entityType: 'Note',
      entityTitle: note.title,
      user: req.user ? req.user.name : 'Admin',
      userRole: req.user ? req.user.role : 'admin',
      details: `Added note '${note.title}' to folder.`
    });

    return res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
};

// Update Note (Admin)
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, folderId, tags, sapModule, isPinned, isDraft } = req.body;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    if (title) note.title = title;
    if (description !== undefined) note.description = description;
    if (content !== undefined) note.content = content;
    if (folderId) note.folder = folderId;
    if (sapModule) note.sapModule = sapModule;
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (isDraft !== undefined) note.isDraft = Boolean(isDraft);
    if (tags) {
      note.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }

    // Save new version into history if content changed
    if (content && content !== note.content) {
      const nextVer = (note.versions ? note.versions.length : 0) + 1;
      note.versions.push({
        versionNumber: nextVer,
        title: note.title,
        content: content,
        savedAt: new Date()
      });
    }

    await note.save();

    await ActivityLog.create({
      action: 'Note Updated',
      entityType: 'Note',
      entityTitle: note.title,
      user: req.user ? req.user.name : 'Admin',
      userRole: req.user ? req.user.role : 'admin',
      details: `Updated note '${note.title}'`
    });

    return res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
};

// Delete Note (Admin)
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    await File.deleteMany({ note: id });
    await Note.findByIdAndDelete(id);

    await ActivityLog.create({
      action: 'Note Deleted',
      entityType: 'Note',
      entityTitle: note.title,
      user: req.user ? req.user.name : 'Admin',
      userRole: req.user ? req.user.role : 'admin',
      details: `Deleted note '${note.title}'`
    });

    return res.json({ message: 'Note deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
};

// Duplicate Note (Admin)
exports.duplicateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const duplicate = await Note.create({
      title: `${note.title} (Copy)`,
      description: note.description,
      content: note.content,
      folder: note.folder,
      tags: [...note.tags],
      sapModule: note.sapModule,
      author: req.user ? req.user.name : note.author,
      isPinned: false,
      createdBy: req.user ? req.user.id : null,
      versions: [
        {
          versionNumber: 1,
          title: `${note.title} (Copy)`,
          content: note.content,
          savedAt: new Date()
        }
      ]
    });

    return res.status(201).json({ message: 'Note duplicated successfully', note: duplicate });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to duplicate note', error: error.message });
  }
};

// Move Note to another folder (Admin)
exports.moveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetFolderId } = req.body;

    const note = await Note.findByIdAndUpdate(id, { folder: targetFolderId }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    return res.json({ message: 'Note moved successfully', note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to move note', error: error.message });
  }
};

// Pin / Unpin Note (Admin)
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPinned = !note.isPinned;
    await note.save();

    return res.json({ message: note.isPinned ? 'Note pinned' : 'Note unpinned', note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to pin/unpin note', error: error.message });
  }
};

// Toggle Favorite Note
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isFavorite = !note.isFavorite;
    await note.save();

    return res.json({ message: note.isFavorite ? 'Added to favorites' : 'Removed from favorites', note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update favorite status', error: error.message });
  }
};

// Restore version from history (Admin)
exports.restoreVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const targetVersion = note.versions.find(v => v.versionNumber === Number(versionNumber));
    if (!targetVersion) {
      return res.status(404).json({ message: 'Version number not found.' });
    }

    note.content = targetVersion.content;
    note.title = targetVersion.title;
    await note.save();

    return res.json({ message: `Restored to version ${versionNumber}`, note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to restore note version', error: error.message });
  }
};
