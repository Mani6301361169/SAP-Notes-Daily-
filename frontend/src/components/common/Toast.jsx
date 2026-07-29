import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
    error: 'bg-red-900/90 border-red-500 text-red-100',
    ai: 'bg-indigo-900/90 border-indigo-400 text-indigo-100',
    info: 'bg-sky-900/90 border-sky-500 text-sky-100'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    ai: <Sparkles className="w-5 h-5 text-indigo-300 animate-spin shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md text-sm font-medium ${bgStyles[type] || bgStyles.success}`}>
        {icons[type]}
        <span>{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
