import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Breadcrumb from './components/common/Breadcrumb';
import Toast from './components/common/Toast';
import AuthModal from './components/common/AuthModal';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import FolderModal from './components/folders/FolderModal';
import NoteEditorModal from './components/notes/NoteEditorModal';
import NoteDetailModal from './components/notes/NoteDetailModal';
import VersionHistoryModal from './components/notes/VersionHistoryModal';
import FilePreviewModal from './components/files/FilePreviewModal';

export default function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Data States
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // Active View & Filter States
  const [activeView, setActiveView] = useState('folders'); // 'folders' | 'dashboard'
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Modals & Triggers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [selectedNoteForDetail, setSelectedNoteForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [versionNote, setVersionNote] = useState(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Folders
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const res = await api.get(`/folders?showArchived=${showArchived}`);
      setFolders(res.data.folders || []);
    } catch (err) {
      console.warn('Failed to load folders', err);
    } finally {
      setLoadingFolders(false);
    }
  }, [showArchived]);

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      let url = `/notes?search=${encodeURIComponent(searchQuery)}`;
      if (selectedFolder?._id) url += `&folderId=${selectedFolder._id}`;
      if (selectedModule && selectedModule !== 'ALL') url += `&module=${selectedModule}`;
      if (showFavoritesOnly) url += `&favoritesOnly=true`;

      const res = await api.get(url);
      setNotes(res.data.notes || []);
    } catch (err) {
      console.warn('Failed to load notes', err);
    } finally {
      setLoadingNotes(false);
    }
  }, [selectedFolder, selectedModule, searchQuery, showFavoritesOnly]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Folder Handlers
  const handleSaveFolder = async (folderData) => {
    if (folderToEdit) {
      await api.put(`/folders/${folderToEdit._id}`, folderData);
      showToast('Folder updated successfully!', 'success');
    } else {
      await api.post('/folders', folderData);
      showToast('Folder created successfully!', 'success');
    }
    fetchFolders();
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder and all notes inside it?')) {
      await api.delete(`/folders/${folderId}`);
      showToast('Folder deleted successfully.', 'success');
      if (selectedFolder?._id === folderId) setSelectedFolder(null);
      fetchFolders();
      fetchNotes();
    }
  };

  const handleArchiveFolder = async (folderId) => {
    await api.put(`/folders/${folderId}/archive`);
    showToast('Folder archived.', 'info');
    fetchFolders();
  };

  const handleRestoreFolder = async (folderId) => {
    await api.put(`/folders/${folderId}/restore`);
    showToast('Folder restored.', 'success');
    fetchFolders();
  };

  // Note Handlers
  const handleSaveNote = async (noteData) => {
    let saved;
    if (noteToEdit) {
      const res = await api.put(`/notes/${noteToEdit._id}`, noteData);
      saved = res.data.note;
      showToast('Note updated successfully!', 'success');
    } else {
      const res = await api.post('/notes', noteData);
      saved = res.data.note;
      showToast('Note added successfully!', 'success');
    }
    fetchNotes();
    fetchFolders();
    return saved;
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await api.delete(`/notes/${noteId}`);
      showToast('Note deleted successfully.', 'success');
      fetchNotes();
      fetchFolders();
    }
  };

  const handleDuplicateNote = async (noteId) => {
    await api.post(`/notes/${noteId}/duplicate`);
    showToast('Note duplicated.', 'success');
    fetchNotes();
  };

  const handleTogglePinNote = async (noteId) => {
    await api.put(`/notes/${noteId}/pin`);
    fetchNotes();
  };

  const handleToggleFavoriteNote = async (noteId) => {
    await api.put(`/notes/${noteId}/favorite`);
    fetchNotes();
  };

  const handleRestoreVersion = async (noteId, versionNumber) => {
    await api.post(`/notes/${noteId}/restore-version/${versionNumber}`);
    showToast(`Restored version #${versionNumber}`, 'success');
    setIsVersionModalOpen(false);
    fetchNotes();
  };

  return (
    <div className="min-h-screen flex flex-col bg-fiori-bgLight dark:bg-fiori-bgDark">
      
      {/* SAP Fiori Shellbar Header */}
      <Navbar
        onSearch={q => setSearchQuery(q)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sticky Sidebar Navigation */}
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={f => { setSelectedFolder(f); setActiveView('folders'); }}
          selectedModule={selectedModule}
          onSelectModule={m => setSelectedModule(m)}
          onOpenCreateFolder={() => { setFolderToEdit(null); setIsFolderModalOpen(true); }}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          <Breadcrumb
            selectedFolder={selectedFolder}
            selectedModule={selectedModule}
            onReset={() => { setSelectedFolder(null); setSelectedModule('ALL'); setShowFavoritesOnly(false); }}
          />

          {isAdmin ? (
            <AdminDashboard
              folders={folders}
              notes={notes}
              loading={loadingFolders || loadingNotes}
              onSelectFolder={f => setSelectedFolder(f)}
              onOpenCreateFolder={() => { setFolderToEdit(null); setIsFolderModalOpen(true); }}
              onOpenCreateNote={() => { setNoteToEdit(null); setIsNoteEditorOpen(true); }}
              onEditFolder={f => { setFolderToEdit(f); setIsFolderModalOpen(true); }}
              onDeleteFolder={handleDeleteFolder}
              onArchiveFolder={handleArchiveFolder}
              onRestoreFolder={handleRestoreFolder}
              onEditNote={n => { setNoteToEdit(n); setIsNoteEditorOpen(true); }}
              onDeleteNote={handleDeleteNote}
              onDuplicateNote={handleDuplicateNote}
              onTogglePinNote={handleTogglePinNote}
              onToggleFavoriteNote={handleToggleFavoriteNote}
              onOpenVersions={n => { setVersionNote(n); setIsVersionModalOpen(true); }}
              onSelectNote={n => { setSelectedNoteForDetail(n); setIsDetailModalOpen(true); }}
              showToast={showToast}
              fetchData={() => { fetchFolders(); fetchNotes(); }}
            />
          ) : (
            <UserDashboard
              folders={folders}
              notes={notes}
              loading={loadingFolders || loadingNotes}
              selectedFolder={selectedFolder}
              onSelectFolder={f => setSelectedFolder(f)}
              onSelectNote={n => { setSelectedNoteForDetail(n); setIsDetailModalOpen(true); }}
              onToggleFavoriteNote={handleToggleFavoriteNote}
            />
          )}

        </main>

      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        showToast={showToast}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleSaveFolder}
        folderToEdit={folderToEdit}
      />

      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        onClose={() => setIsNoteEditorOpen(false)}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
        folders={folders}
        showToast={showToast}
      />

      <NoteDetailModal
        note={selectedNoteForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onToggleFavorite={handleToggleFavoriteNote}
        onPreviewFile={f => { setPreviewFile(f); setIsFilePreviewOpen(true); }}
        showToast={showToast}
      />

      <VersionHistoryModal
        note={versionNote}
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        onRestoreVersion={handleRestoreVersion}
      />

      <FilePreviewModal
        file={previewFile}
        isOpen={isFilePreviewOpen}
        onClose={() => setIsFilePreviewOpen(false)}
      />

      {/* Global Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

    </div>
  );
}
