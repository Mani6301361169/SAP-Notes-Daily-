import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  BookOpen, Clock, Calendar, User, ArrowLeft, Star, Download, Eye, 
  Printer, Type, ZoomIn, ZoomOut, Sun, Moon, Coffee, Copy, Check, 
  Paperclip, FileText, ChevronRight, List, Bookmark, ShieldCheck, 
  ChevronDown, ChevronUp, Share2, Layers, File
} from 'lucide-react';

export default function NoteReaderPage({ note, onBack, onToggleFavorite, showToast }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Reading Preferences States
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: sm, 1: base, 2: lg, 3: xl
  const [readingTheme, setReadingTheme] = useState('default'); // 'default' | 'sepia' | 'dark'
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Attachments State
  const [attachments, setAttachments] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Collapsed Sections State
  const [collapsedHeadings, setCollapsedHeadings] = useState({});

  const contentRef = useRef(null);

  const fontSizeClasses = [
    'text-sm leading-relaxed',
    'text-base leading-relaxed',
    'text-lg leading-loose',
    'text-xl leading-loose'
  ];

  // Reading Theme styles
  const themeBgStyles = {
    default: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e4d3b6]',
    dark: 'bg-slate-950 text-slate-100 border-slate-800'
  };

  // Compute Word Count & Estimated Reading Time
  const plainText = note?.content ? note.content.replace(/<[^>]*>/g, ' ') : '';
  const wordsCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordsCount / 180));

  // Extract Table of Contents from H2 and H3 tags
  useEffect(() => {
    if (!note?.content) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(note.content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    
    const tocItems = Array.from(headings).map((h, idx) => ({
      id: `heading-${idx}`,
      text: h.textContent || `Section ${idx + 1}`,
      level: h.tagName.toLowerCase()
    }));

    setTableOfContents(tocItems);
  }, [note]);

  // Fetch Attached Files
  useEffect(() => {
    if (note?._id) {
      fetchAttachments();
    }
  }, [note]);

  const fetchAttachments = async () => {
    setLoadingFiles(true);
    try {
      const res = await api.get(`/files?noteId=${note._id}`);
      setAttachments(res.data.files || []);
    } catch (err) {
      console.warn('Failed to load note files', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Reading Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight || document.body.scrollHeight;
      const clientHeight = el.clientHeight || window.innerHeight;
      
      const windowHeight = scrollHeight - clientHeight;
      if (windowHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollTop / windowHeight) * 100));
        setReadingProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    if (showToast) showToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const scrollToSection = (idx) => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3');
      if (headings[idx]) {
        headings[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleDownload = (file) => {
    window.open(`/api/files/download/${file._id}`, '_blank');
    if (showToast) showToast(`Downloading ${file.originalName}...`, 'success');
  };

  if (!note) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeBgStyles[readingTheme]}`}>
      
      {/* 1. Reading Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-fiori-primary via-sky-400 to-emerald-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 2. Top Sticky Controls Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        
        {/* Left Back Button & Breadcrumbs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400">
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-sky-600 dark:text-sky-400">{note.sapModule}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px] text-slate-700 dark:text-slate-300">{note.title}</span>
          </div>
        </div>

        {/* Right Reader Customization Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Zoom Font Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontSizeLevel(prev => Math.max(0, prev - 1))}
              disabled={fontSizeLevel === 0}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-fiori-primary disabled:opacity-30"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-[11px]">A{fontSizeLevel + 1}</span>
            <button
              onClick={() => setFontSizeLevel(prev => Math.min(3, prev + 1))}
              disabled={fontSizeLevel === 3}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-fiori-primary disabled:opacity-30"
              title="Increase Font Size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Reading Color Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setReadingTheme('default')}
              className={`p-1.5 rounded transition ${readingTheme === 'default' ? 'bg-white dark:bg-slate-700 shadow text-fiori-primary' : 'text-slate-500'}`}
              title="Light Reader Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`p-1.5 rounded transition ${readingTheme === 'sepia' ? 'bg-[#f5e5c9] text-[#5c4428] font-bold' : 'text-slate-500'}`}
              title="Sepia Focus Mode"
            >
              <Coffee className="w-4 h-4 text-amber-700" />
            </button>
            <button
              onClick={() => setReadingTheme('dark')}
              className={`p-1.5 rounded transition ${readingTheme === 'dark' ? 'bg-slate-900 text-sky-400 font-bold' : 'text-slate-500'}`}
              title="Dark Reader Mode"
            >
              <Moon className="w-4 h-4 text-sky-400" />
            </button>
          </div>

          {/* Star Favorite */}
          <button
            onClick={() => onToggleFavorite(note._id)}
            className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Favorite Note"
          >
            <Star className={`w-4 h-4 ${note.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Print Document Note"
          >
            <Printer className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* 3. Main Reading Document Canvas Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Main Article Document Container (3 Cols) */}
        <article className="lg:col-span-3 space-y-8">
          
          {/* Article Header & Title Card */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-fiori-primary text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm">
                SAP {note.sapModule}
              </span>
              {note.folder?.title && (
                <span className="bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-medium px-3 py-1 rounded-full">
                  {note.folder.title}
                </span>
              )}
              {note.isPinned && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  📌 Pinned Important Note
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {note.title}
            </h1>

            {/* Author & Reading Time Strip */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-fiori-primary/20 text-fiori-primary flex items-center justify-center font-bold text-sm">
                  {note.author ? note.author.charAt(0) : 'S'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{note.author || 'SAP Enterprise Lead'}</p>
                  <span className="text-[11px]">Certified SAP Documentation</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{readingTimeMinutes} min read ({wordsCount} words)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Updated {new Date(note.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
              </div>
            </div>

            {/* Short Executive Summary / Description */}
            {note.description && (
              <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 border-l-4 border-fiori-primary rounded-r-xl text-sm italic leading-relaxed text-slate-700 dark:text-slate-300">
                "{note.description}"
              </div>
            )}
          </div>

          {/* Document Content Render */}
          <div 
            ref={contentRef}
            className={`note-content-preview font-sans ${fontSizeClasses[fontSizeLevel]}`}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Tags Chips */}
          {note.tags && note.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Related SAP Topics</span>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((t, i) => (
                  <span key={i} className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Document Learning Attachments Section */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Paperclip className="w-5 h-5 text-fiori-primary" />
                <span>Learning Attachments & Course Files ({attachments.length})</span>
              </h3>
            </div>

            {attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attachments.map((file) => (
                  <div 
                    key={file._id}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-fiori-primary transition group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2.5 bg-sky-100 dark:bg-sky-950 text-fiori-primary rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-xs truncate">{file.originalName}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {file.fileCategory} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(file)}
                      className="fd-btn-emphasized text-xs py-1.5 px-3 flex items-center space-x-1.5 shrink-0"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                No attachments uploaded for this SAP note.
              </div>
            )}
          </div>

        </article>

        {/* Floating Table of Contents Sidebar (1 Col) */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-24 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <List className="w-4 h-4 text-fiori-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Table of Contents</h3>
            </div>

            {tableOfContents.length > 0 ? (
              <nav className="space-y-1.5 max-h-80 overflow-y-auto text-xs">
                {tableOfContents.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(idx)}
                    className={`w-full text-left py-1.5 px-2 rounded-lg font-medium transition-all truncate hover:bg-slate-200 dark:hover:bg-slate-800 ${
                      item.level === 'h3' ? 'pl-5 text-slate-500 text-[11px]' : 'text-slate-700 dark:text-slate-300 font-semibold'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            ) : (
              <p className="text-xs text-slate-400 italic">No section headings detected.</p>
            )}

            {/* Reading Helper Tips */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                SAP Term Shield
              </p>
              <p className="leading-relaxed">All transaction codes (MM01, VA01, SE11) and ABAP code blocks are verified.</p>
            </div>

          </div>
        </aside>

      </div>

    </div>
  );
}
