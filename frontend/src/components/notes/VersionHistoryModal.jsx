import React from 'react';
import { History, RotateCcw, X, Calendar, CheckCircle2 } from 'lucide-react';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Recent';
  }
};

export default function VersionHistoryModal({ note, isOpen, onClose, onRestoreVersion }) {
  if (!isOpen || !note) return null;

  const versions = note.versions || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-fiori-shellbar p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">Note Version History</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-slate-500">
            View past revisions of <strong>{note.title}</strong>. Click restore to roll back to any previous version.
          </p>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-700">
            {versions.map((ver) => (
              <div key={ver.versionNumber} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-mono font-bold px-2 py-0.5 rounded">
                      Version #{ver.versionNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDate(ver.savedAt)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{ver.title}</p>
                </div>

                <button
                  onClick={() => onRestoreVersion(note._id, ver.versionNumber)}
                  className="fd-btn-secondary text-xs py-1 px-3 flex items-center space-x-1 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Restore</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button onClick={onClose} className="fd-btn-secondary text-xs">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
