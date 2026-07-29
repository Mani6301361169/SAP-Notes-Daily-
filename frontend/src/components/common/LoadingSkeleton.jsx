import React from 'react';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-150 dark:bg-slate-750 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
          <div className="flex space-x-2 pt-4 border-t border-slate-100 dark:border-slate-750">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
