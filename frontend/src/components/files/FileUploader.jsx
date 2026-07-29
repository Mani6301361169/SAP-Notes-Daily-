import React, { useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, Paperclip } from 'lucide-react';

export default function FileUploader({ files, setFiles }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const dropped = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...dropped]);
    }
  };

  const handleRemove = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      
      {/* Drag & Drop Area */}
      <div 
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-sky-300 dark:border-sky-800 hover:border-fiori-primary bg-sky-50/40 dark:bg-sky-950/20 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.doc,.ppt,.pptx,.xlsx,.xls,.png,.jpg,.jpeg,.zip,.rar,.abap,.js,.py,.sql,.txt"
        />

        <div className="p-3 bg-white dark:bg-slate-800 text-fiori-primary rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          Drag & Drop PDF, DOCX, PPT, XLSX, Images, ZIP, or Code Files here
        </p>
        <p className="text-[11px] text-slate-400 mt-1">or click to browse local files (Max 50MB per file)</p>
      </div>

      {/* Staged File List Preview before publishing */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Staged Files ({files.length}):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-sm">
                <div className="flex items-center space-x-2 truncate">
                  <Paperclip className="w-4 h-4 text-sky-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
