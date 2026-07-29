import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Folder, FolderPlus, Star, Clock, Filter, Archive, BookOpen, 
  ChevronRight, Sparkles, Layers, CheckSquare
} from 'lucide-react';

export default function Sidebar({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  selectedModule, 
  onSelectModule, 
  onOpenCreateFolder,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showArchived,
  setShowArchived
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const sapModules = [
    { id: 'ALL', label: 'All Modules' },
    { id: 'GENERAL', label: 'General SAP' },
    { id: 'MM', label: 'SAP MM (Materials)' },
    { id: 'SD', label: 'SAP SD (Sales)' },
    { id: 'ABAP', label: 'SAP ABAP (Dev)' },
    { id: 'FICO', label: 'SAP FICO (Finance)' },
    { id: 'BASIS', label: 'SAP BASIS (Admin)' }
  ];

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-fiori-cardDark border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-sm overflow-y-auto">
      
      {/* Admin Action Header */}
      {isAdmin && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={onOpenCreateFolder}
            className="w-full fd-btn-emphasized flex items-center justify-center space-x-2 text-sm shadow"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Day Folder</span>
          </button>
        </div>
      )}

      {/* Main Navigation Sections */}
      <div className="p-4 space-y-6 flex-1">

        {/* Quick Filter Section */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
            Quick Views
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => { onSelectFolder(null); setShowFavoritesOnly(false); setShowArchived(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                !selectedFolder && !showFavoritesOnly && !showArchived
                  ? 'bg-fiori-primary/10 text-fiori-primary dark:bg-fiori-primary/20 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BookOpen className="w-4 h-4" />
                <span>All Learning Notes</span>
              </div>
            </button>

            <button
              onClick={() => { setShowFavoritesOnly(true); onSelectFolder(null); setShowArchived(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                showFavoritesOnly
                  ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Starred Favorites</span>
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => { setShowArchived(!showArchived); onSelectFolder(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  showArchived
                    ? 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Archive className="w-4 h-4 text-purple-500" />
                  <span>Archived Folders</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Day-Wise Chronological Folders */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Chronological Folders
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
              {folders.length} Days
            </span>
          </div>

          <div className="space-y-1">
            {folders.map((folder) => {
              const isSelected = selectedFolder?._id === folder._id;
              return (
                <button
                  key={folder._id}
                  onClick={() => { onSelectFolder(folder); setShowFavoritesOnly(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-fiori-primary text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Folder className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-sky-600 dark:text-sky-400'}`} />
                    <span className="truncate">{folder.title}</span>
                  </div>
                  {folder.noteCount !== undefined && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      {folder.noteCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SAP Module Filter Chips */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter by SAP Module
          </h2>
          <div className="flex flex-wrap gap-1.5 px-1">
            {sapModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  selectedModule === mod.id
                    ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer info badge */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-400 text-center">
        <span>SAP Daily LMS v3.0 • Fiori Horizon</span>
      </div>

    </aside>
  );
}
