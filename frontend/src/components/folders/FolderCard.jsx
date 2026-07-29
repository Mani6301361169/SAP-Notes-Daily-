import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Folder, Calendar, FileText, MoreVertical, Edit2, Trash2, 
  Archive, RotateCcw, ChevronRight, GripVertical
} from 'lucide-react';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Today';
  }
};

export default function FolderCard({ 
  folder, 
  onSelect, 
  onEdit, 
  onDelete, 
  onArchive, 
  onRestore,
  dragHandleProps 
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div 
      onClick={() => onSelect(folder)}
      className="group relative bg-white dark:bg-fiori-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-fiori hover:shadow-fioriHover transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      
      {/* Top Bar with Icon & Actions */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {isAdmin && dragHandleProps && (
              <span {...dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4" />
              </span>
            )}
            <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-fiori-primary dark:text-sky-400 rounded-xl group-hover:bg-fiori-primary group-hover:text-white transition-colors duration-200 shadow-sm">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider font-mono">
                Day {folder.dayNumber}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-fiori-primary transition-colors leading-tight">
                {folder.title}
              </h3>
            </div>
          </div>

          {/* Admin Menu Dropdown */}
          {isAdmin && (
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 text-xs">
                  <button
                    onClick={() => { onEdit(folder); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Rename Folder</span>
                  </button>
                  {folder.isArchived ? (
                    <button
                      onClick={() => { onRestore(folder._id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2 text-emerald-600"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Folder</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { onArchive(folder._id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2 text-purple-600"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive Folder</span>
                    </button>
                  )}
                  <button
                    onClick={() => { onDelete(folder._id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center space-x-2 font-semibold border-t border-slate-100 dark:border-slate-700 mt-1 pt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Folder</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {folder.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1">
          <FileText className="w-3.5 h-3.5 text-sky-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {folder.noteCount || 0} Notes
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[11px]">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(folder.createdAt)}</span>
        </div>
      </div>

    </div>
  );
}
