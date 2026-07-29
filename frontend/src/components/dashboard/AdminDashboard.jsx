import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import FolderCard from '../folders/FolderCard';
import NoteCard from '../notes/NoteCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { 
  Folder, FileText, Users, HardDrive, Activity, Plus, 
  Search, Shield, Sparkles, UploadCloud, RefreshCw, Layers
} from 'lucide-react';

const formatTime = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Now';
  }
};

export default function AdminDashboard({ 
  folders, 
  notes, 
  loading, 
  onSelectFolder, 
  onOpenCreateFolder,
  onOpenCreateNote,
  onEditFolder,
  onDeleteFolder,
  onArchiveFolder,
  onRestoreFolder,
  onEditNote,
  onDeleteNote,
  onDuplicateNote,
  onTogglePinNote,
  onToggleFavoriteNote,
  onOpenVersions,
  onSelectNote,
  showToast,
  fetchData
}) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data.stats);
      setRecentActivity(res.data.recentActivity || []);
      setRecentUploads(res.data.recentUploads || []);
    } catch (err) {
      console.warn('Dashboard stats error', err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-fiori-shellbar via-sky-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>ADMIN CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SAP Daily Notes Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Full authority over day-wise folders, notes, attachments, role permissions, and real-time AI grammar proofreading with SAP technical term shield.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={onOpenCreateFolder}
            className="fd-btn-emphasized text-xs py-2.5 px-4 flex items-center space-x-2 shadow-lg"
          >
            <Folder className="w-4 h-4" />
            <span>Create Folder</span>
          </button>
          <button
            onClick={onOpenCreateNote}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 px-4 rounded-md shadow-lg flex items-center space-x-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note (AI)</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-fiori-cardDark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-fiori flex items-center space-x-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-950 text-fiori-primary rounded-xl">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Total Folders</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalFolders ?? folders.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-fiori-cardDark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-fiori flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Total Notes</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalNotes ?? notes.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-fiori-cardDark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-fiori flex items-center space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">System Users</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalUsers ?? 2}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-fiori-cardDark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-fiori flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Storage Usage</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.storageUsageMB ?? '0.45'} MB
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Split View: Folders & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Folders Management Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Folder className="w-5 h-5 text-sky-500" />
              <span>Chronological Day Folders ({folders.length})</span>
            </h2>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : folders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {folders.map(folder => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  onSelect={onSelectFolder}
                  onEdit={onEditFolder}
                  onDelete={onDeleteFolder}
                  onArchive={onArchiveFolder}
                  onRestore={onRestoreFolder}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Folder className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-200">No Folders Created Yet</p>
              <p className="text-xs text-slate-400 mb-4">Create your first SAP Day Folder to organize notes.</p>
              <button onClick={onOpenCreateFolder} className="fd-btn-emphasized text-xs">
                Create Day Folder
              </button>
            </div>
          )}

          {/* Notes Management Section */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>All Learning Notes ({notes.length})</span>
              </h2>
              <button onClick={onOpenCreateNote} className="fd-btn-emphasized text-xs py-1.5 px-3">
                + Add Note
              </button>
            </div>

            {notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map(note => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onSelect={onSelectNote}
                    onEdit={onEditNote}
                    onDelete={onDeleteNote}
                    onDuplicate={onDuplicateNote}
                    onTogglePin={onTogglePinNote}
                    onToggleFavorite={onToggleFavoriteNote}
                    onOpenVersions={onOpenVersions}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No notes match current folder/filter criteria.</p>
            )}
          </div>

        </div>

        {/* Activity & System Feed Column */}
        <div className="space-y-6">
          
          {/* Recent Activity Log */}
          <div className="bg-white dark:bg-fiori-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-fiori space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-fiori-primary" />
                <span>Recent System Activity</span>
              </h3>
              <button onClick={fetchDashboardStats} className="p-1 text-slate-400 hover:text-fiori-primary">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {recentActivity.map((act, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-fiori-primary dark:text-sky-400">{act.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {formatTime(act.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{act.entityTitle}</p>
                  <p className="text-[11px] text-slate-400 italic">{act.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Protection Engine Banner */}
          <div className="bg-gradient-to-br from-indigo-900 to-sky-900 text-white rounded-2xl p-5 shadow-xl space-y-3 border border-indigo-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h4 className="font-bold text-sm">SAP AI Engine Online</h4>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Real-time grammar & spelling proofreader automatically inspects typed and pasted text while safeguarding all SAP transaction codes and ABAP syntax.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
