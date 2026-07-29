import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Pin, Star, Calendar, User, MoreVertical, Edit2, Trash2, 
  Copy, FolderInput, History, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Today';
  }
};

export default function NoteCard({ 
  note, 
  onSelect, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onTogglePin, 
  onToggleFavorite,
  onOpenVersions
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showMenu, setShowMenu] = useState(false);

  const moduleColors = {
    MM: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    SD: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    ABAP: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
    FICO: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    BASIS: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
    GENERAL: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300'
  };

  return (
    <div 
      onClick={() => onSelect(note)}
      className={`group relative bg-white dark:bg-fiori-cardDark rounded-2xl border p-5 shadow-fiori hover:shadow-fioriHover transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        note.isPinned 
          ? 'border-amber-400/70 dark:border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/10' 
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      
      {/* Top Bar */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          
          <div className="flex flex-wrap items-center gap-1.5">
            {note.isPinned && (
              <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 p-1 rounded-md" title="Pinned Note">
                <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              </span>
            )}
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${moduleColors[note.sapModule] || moduleColors.GENERAL}`}>
              {note.sapModule}
            </span>
            {note.folder?.title && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">
                {note.folder.title}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onToggleFavorite(note._id)}
              className="p-1 text-slate-400 hover:text-amber-500 transition"
              title={note.isFavorite ? 'Remove Favorite' : 'Star Favorite'}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>

            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 text-xs">
                    <button
                      onClick={() => { onEdit(note); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Edit Note (AI)</span>
                    </button>
                    <button
                      onClick={() => { onTogglePin(note._id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2 text-amber-600"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{note.isPinned ? 'Unpin Note' : 'Pin Note'}</span>
                    </button>
                    <button
                      onClick={() => { onDuplicate(note._id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Duplicate Note</span>
                    </button>
                    <button
                      onClick={() => { onOpenVersions(note); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2 text-indigo-500"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Version History</span>
                    </button>
                    <button
                      onClick={() => { onDelete(note._id); setShowMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center space-x-2 font-semibold border-t border-slate-100 dark:border-slate-700 mt-1 pt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Note</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-fiori-primary transition-colors leading-snug mb-1">
          {note.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {note.description || 'Click to view full note details, attachments, and code snippets.'}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[100px]">{note.author || 'Admin'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
      </div>

    </div>
  );
}
