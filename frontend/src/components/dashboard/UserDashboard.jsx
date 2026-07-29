import React from 'react';
import FolderCard from '../folders/FolderCard';
import NoteCard from '../notes/NoteCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Folder, FileText, Search, BookOpen, Download, Lock } from 'lucide-react';

export default function UserDashboard({ 
  folders, 
  notes, 
  loading, 
  selectedFolder,
  onSelectFolder, 
  onSelectNote,
  onToggleFavoriteNote
}) {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-fiori-shellbar rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-sky-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SAP LEARNER PORTAL (READ-ONLY)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SAP Enterprise Learning Notes & Documentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Browse structured day-by-day SAP learning folders, study rich module notes, copy code snippets, and preview/download course attachments.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 flex items-center space-x-2 shrink-0">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Learner Access Mode</span>
        </div>
      </div>

      {/* Folders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Folder className="w-5 h-5 text-sky-500" />
            <span>
              {selectedFolder ? `Folder: ${selectedFolder.title}` : `Day-Wise Learning Folders (${folders.length})`}
            </span>
          </h2>
          {selectedFolder && (
            <button
              onClick={() => onSelectFolder(null)}
              className="text-xs font-semibold text-fiori-primary hover:underline"
            >
              View All Folders
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : folders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map(folder => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onSelect={onSelectFolder}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No learning folders available.</p>
        )}
      </div>

      {/* Notes Grid Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span>Available SAP Notes ({notes.length})</span>
          </h2>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onSelect={onSelectNote}
                onToggleFavorite={onToggleFavoriteNote}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">No Notes Found</p>
            <p className="text-xs text-slate-400">Select a folder or clear filters to view notes.</p>
          </div>
        )}
      </div>

    </div>
  );
}
