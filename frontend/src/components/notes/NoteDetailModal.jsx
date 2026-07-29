import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  FileText, Download, Eye, ExternalLink, Calendar, User, 
  Tag, X, Star, Pin, Paperclip, CheckCircle2, ShieldCheck, File
} from 'lucide-react';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Today';
  }
};

export default function NoteDetailModal({ 
  note, 
  isOpen, 
  onClose, 
  onToggleFavorite, 
  onPreviewFile,
  showToast 
}) {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (note && isOpen) {
      fetchAttachments();
    }
  }, [note, isOpen]);

  const fetchAttachments = async () => {
    setLoadingFiles(true);
    try {
      const res = await api.get(`/files?noteId=${note._id}`);
      setAttachments(res.data.files || []);
    } catch (err) {
      console.warn('Failed to load attachments', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  if (!isOpen || !note) return null;

  const handleDownload = (file) => {
    window.open(`/api/files/download/${file._id}`, '_blank');
    if (showToast) showToast(`Downloading ${file.originalName}...`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-fiori-shellbar p-6 text-white flex items-start justify-between gap-4 border-b border-slate-700">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-fiori-primary text-white text-xs font-mono font-bold px-2 py-0.5 rounded border border-sky-400">
                {note.sapModule}
              </span>
              {note.folder?.title && (
                <span className="text-xs text-sky-200 font-medium">
                  {note.folder.title}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">
              {note.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(note._id)}
              className="p-2 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-700 transition"
              title="Star Favorite"
            >
              <Star className={`w-5 h-5 ${note.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-sky-500" />
              <strong className="text-slate-700 dark:text-slate-200">{note.author || 'SAP Consultant'}</strong>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(note.createdAt)}</span>
            </span>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {note.tags.map((t, i) => (
                <span key={i} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono px-2 py-0.5 rounded text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Scroll View */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {note.description && (
            <div className="p-4 bg-sky-50/50 dark:bg-sky-950/20 border-l-4 border-fiori-primary rounded-r-lg text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
              {note.description}
            </div>
          )}

          {/* HTML Rendered Content */}
          <div 
            className="note-content-preview text-slate-800 dark:text-slate-100"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Attachments Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-fiori-primary" />
              <span>Learning Attachments & Files ({attachments.length})</span>
            </h3>

            {attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file) => (
                  <div key={file._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-sm hover:border-fiori-primary transition">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 bg-sky-100 dark:bg-sky-950 text-fiori-primary rounded-lg shrink-0">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{file.originalName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {file.fileCategory} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onPreviewFile(file)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs"
                        title="Preview File"
                      >
                        <Eye className="w-4 h-4 text-sky-600" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg text-xs font-semibold"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No files attached to this learning note.</p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
          <span className="text-slate-400">SAP Daily Notes Portal LMS</span>
          <button onClick={onClose} className="fd-btn-secondary text-xs px-5">
            Close Note
          </button>
        </div>

      </div>
    </div>
  );
}
