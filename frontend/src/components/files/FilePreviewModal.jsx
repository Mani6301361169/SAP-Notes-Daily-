import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

export default function FilePreviewModal({ file, isOpen, onClose }) {
  if (!isOpen || !file) return null;

  const fileUrl = file.fileUrl || `/uploads/${file.filename}`;
  const isImage = file.mimeType?.startsWith('image/') || ['IMAGE'].includes(file.fileCategory);
  const isPdf = file.mimeType?.includes('pdf') || file.originalName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-fiori-shellbar p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <FileText className="w-5 h-5 text-sky-400 shrink-0" />
            <h3 className="font-bold text-base truncate">{file.originalName}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={`/api/files/download/${file._id}`}
              target="_blank"
              rel="noreferrer"
              className="fd-btn-emphasized text-xs py-1.5 px-3 flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-950 min-h-[400px]">
          {isImage ? (
            <img src={fileUrl} alt={file.originalName} className="max-h-[70vh] rounded-lg object-contain shadow-lg" />
          ) : isPdf ? (
            <iframe src={fileUrl} title={file.originalName} className="w-full h-[70vh] rounded-lg border shadow-inner" />
          ) : (
            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow border space-y-4 max-w-md">
              <FileText className="w-16 h-16 text-fiori-primary mx-auto" />
              <div>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">{file.originalName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">{file.fileCategory} • {(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <p className="text-xs text-slate-500">Preview for this document format is available via direct download.</p>
              <a
                href={`/api/files/download/${file._id}`}
                className="fd-btn-emphasized inline-flex items-center space-x-2 text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download & View Document</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
