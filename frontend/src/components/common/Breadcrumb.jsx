import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';

export default function Breadcrumb({ selectedFolder, selectedModule, onReset }) {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 py-2">
      <button 
        onClick={onReset} 
        className="hover:text-fiori-primary flex items-center space-x-1 font-medium transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {selectedFolder && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
            <Folder className="w-3.5 h-3.5 text-sky-500" />
            <span>{selectedFolder.title}</span>
          </span>
        </>
      )}

      {selectedModule && selectedModule !== 'ALL' && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="bg-sky-100 dark:bg-sky-950 text-fiori-primary dark:text-sky-300 px-2 py-0.5 rounded font-mono font-semibold">
            Module: {selectedModule}
          </span>
        </>
      )}
    </nav>
  );
}
