import React from 'react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, XCircle, RefreshCw, 
  AlertTriangle, Check, X, ShieldAlert, Zap
} from 'lucide-react';

export default function AIAssistantPanel({ 
  suggestions = [], 
  protectedTerms = [], 
  onAcceptAll, 
  onRejectAll, 
  onAcceptOne, 
  onRejectOne,
  isChecking 
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-900/10 via-sky-900/5 to-slate-900/10 border border-indigo-200 dark:border-indigo-950 rounded-xl p-4 space-y-4 shadow-sm">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              AI Writing Assistant
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                REAL-TIME
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Grammar, Spelling & SAP Term Protection</p>
          </div>
        </div>

        {isChecking && (
          <div className="flex items-center space-x-1 text-xs text-indigo-600 font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}
      </div>

      {/* SAP Technical Term Protection Banner */}
      <div className="bg-sky-500/10 border border-sky-400/30 rounded-lg p-3 text-xs flex items-start space-x-2 text-sky-900 dark:text-sky-200">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">SAP Terminology Shield Active</p>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            T-Codes (MM01, VA01, SE11, SE38, SPRO, ME21N), ABAP keywords, SAP Tables (MARA, KNA1, BSEG), BAPIs, and SQL queries are strictly protected.
          </p>
          {protectedTerms.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {protectedTerms.slice(0, 8).map((term, i) => (
                <span key={i} className="bg-sky-200 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-400/40">
                  🛡️ {term}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Actions: Accept All / Reject All */}
      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identified Suggestions ({suggestions.length})
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onAcceptAll}
                className="fd-btn-positive text-xs py-1 px-2.5 flex items-center space-x-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept All</span>
              </button>
              <button
                type="button"
                onClick={onRejectAll}
                className="fd-btn-secondary text-xs py-1 px-2.5 flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Reject All</span>
              </button>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {suggestions.map((item) => (
              <div 
                key={item.id}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-1.5 transition hover:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => onAcceptOne(item)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Apply Suggestion"
                    >
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectOne(item.id)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="line-through text-red-500 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded font-mono">
                    {item.originalText}
                  </span>
                  <span>➔</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded font-mono">
                    {item.suggestedText}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-slate-500 space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-200">No Grammar or Spelling Issues Detected</p>
          <p className="text-[11px]">Your note text complies with SAP professional writing guidelines.</p>
        </div>
      )}

    </div>
  );
}
