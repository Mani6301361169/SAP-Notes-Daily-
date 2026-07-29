import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Code, Link, 
  Table, Image, Sparkles, AlignLeft, Type, Eye
} from 'lucide-react';

export default function RichTextEditor({ 
  content, 
  onChange, 
  onTriggerAI,
  isAIChecking 
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'

  const insertTag = (startTag, endTag = '') => {
    const textarea = document.getElementById('sap-note-rich-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    const replacement = `${startTag}${selected || 'Sample text'}${endTag}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    onChange(newContent);
  };

  const handlePaste = (e) => {
    // Trigger real-time AI assistant check when pasting content
    setTimeout(() => {
      if (onTriggerAI) onTriggerAI('paste');
    }, 300);
  };

  const handleTextChange = (e) => {
    onChange(e.target.value);
    // Real-time AI check on typing pause
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      
      {/* Editor Formatting Toolbar */}
      <div className="bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-slate-700 dark:text-slate-200">
        
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition font-bold"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition italic"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<u>', '</u>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition underline"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></span>

          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition font-bold text-xs"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition font-semibold text-xs"
            title="Heading 3"
          >
            H3
          </button>

          <span className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></span>

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <span className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></span>

          <button
            type="button"
            onClick={() => insertTag('<code>', '</code>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
            title="Inline Code / T-Code"
          >
            <Code className="w-4 h-4 text-sky-600" />
          </button>

          <button
            type="button"
            onClick={() => insertTag('<pre><code>\n', '\n</code></pre>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition font-mono text-xs font-bold"
            title="ABAP Code Block"
          >
            &lt;/&gt;
          </button>

          <button
            type="button"
            onClick={() => insertTag('<table border="1">\n  <tr><th>Key</th><th>Value</th></tr>\n  <tr><td>MM01</td><td>Material Creation</td></tr>\n</table>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
            title="SAP Data Table"
          >
            <Table className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => insertTag('<a href="https://help.sap.com" target="_blank">', '</a>')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
            title="Insert Link"
          >
            <Link className="w-4 h-4 text-fiori-primary" />
          </button>
        </div>

        {/* AI Assistant Action & Tab Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onTriggerAI('manual')}
            disabled={isAIChecking}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>{isAIChecking ? 'AI Checking...' : 'Run AI Grammar Assistant'}</span>
          </button>

          <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 rounded transition ${activeTab === 'editor' ? 'bg-white dark:bg-slate-900 shadow text-fiori-primary' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded transition ${activeTab === 'preview' ? 'bg-white dark:bg-slate-900 shadow text-fiori-primary' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Preview
            </button>
          </div>
        </div>

      </div>

      {/* Main Textarea vs Live Preview */}
      {activeTab === 'editor' ? (
        <textarea
          id="sap-note-rich-editor"
          value={content}
          onChange={handleTextChange}
          onPaste={handlePaste}
          rows={12}
          placeholder="Enter note content here... Format with HTML tags or toolbar. Typing or pasting will trigger real-time AI Grammar & SAP Protection checking!"
          className="w-full p-4 font-mono text-sm bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none resize-y"
        />
      ) : (
        <div 
          className="p-6 min-h-[300px] note-content-preview bg-slate-50/50 dark:bg-slate-900/50"
          dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-400 italic">No content typed yet.</p>' }}
        />
      )}

    </div>
  );
}
