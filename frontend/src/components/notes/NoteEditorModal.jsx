import React, { useState, useEffect } from 'react';
import RichTextEditor from '../editor/RichTextEditor';
import AIAssistantPanel from '../editor/AIAssistantPanel';
import FileUploader from '../files/FileUploader';
import api from '../../services/api';
import { 
  FileEdit, X, Sparkles, Save, CheckCircle2, ShieldCheck, 
  Folder, Layers, Paperclip
} from 'lucide-react';

export default function NoteEditorModal({ 
  isOpen, 
  onClose, 
  onSave, 
  noteToEdit, 
  folders = [], 
  showToast 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState('');
  const [sapModule, setSapModule] = useState('GENERAL');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('SAP Administrator');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // AI Assistant State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [protectedTerms, setProtectedTerms] = useState([]);
  const [isAIChecking, setIsAIChecking] = useState(false);

  // File Upload State
  const [stagedFiles, setStagedFiles] = useState([]);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setDescription(noteToEdit.description || '');
      setContent(noteToEdit.content || '');
      setFolderId(noteToEdit.folder?._id || noteToEdit.folder || (folders[0]?._id || ''));
      setSapModule(noteToEdit.sapModule || 'GENERAL');
      setTags(Array.isArray(noteToEdit.tags) ? noteToEdit.tags.join(', ') : noteToEdit.tags || '');
      setAuthor(noteToEdit.author || 'SAP Administrator');
      setIsPinned(Boolean(noteToEdit.isPinned));
    } else {
      setTitle('');
      setDescription('');
      setContent('');
      setFolderId(folders[0]?._id || '');
      setSapModule('GENERAL');
      setTags('');
      setAuthor('SAP Administrator');
      setIsPinned(false);
    }
    setAiSuggestions([]);
    setStagedFiles([]);
  }, [noteToEdit, isOpen, folders]);

  if (!isOpen) return null;

  // Real-time AI Assistant Handler
  const handleTriggerAI = async (source = 'manual') => {
    if (!content || content.trim().length === 0) return;
    setIsAIChecking(true);
    try {
      const res = await api.post('/ai/check-grammar', { text: content, source });
      setAiSuggestions(res.data.suggestions || []);
      setProtectedTerms(res.data.protectedTermsDetected || []);
      if (showToast) {
        showToast(res.data.message || 'Grammar and spelling checked successfully.', 'ai');
      }
    } catch (err) {
      console.error('AI Check error', err);
    } finally {
      setIsAIChecking(false);
    }
  };

  const handleAcceptAllAI = () => {
    let updatedContent = content;
    // Apply suggestions in reverse index order to preserve string offsets
    const sorted = [...aiSuggestions].sort((a, b) => b.startIndex - a.startIndex);
    sorted.forEach(sug => {
      const plain = updatedContent.replace(/<[^>]*>/g, '');
      updatedContent = updatedContent.replace(sug.originalText, sug.suggestedText);
    });
    setContent(updatedContent);
    setAiSuggestions([]);
    if (showToast) showToast('Applied all AI corrections successfully.', 'success');
  };

  const handleRejectAllAI = () => {
    setAiSuggestions([]);
    if (showToast) showToast('Dismissed AI suggestions.', 'info');
  };

  const handleAcceptOneAI = (sug) => {
    setContent(prev => prev.replace(sug.originalText, sug.suggestedText));
    setAiSuggestions(prev => prev.filter(s => s.id !== sug.id));
  };

  const handleRejectOneAI = (id) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderId) {
      alert('Please select a folder for this note.');
      return;
    }
    setLoading(true);
    try {
      const savedNote = await onSave({
        title,
        description,
        content,
        folderId,
        sapModule,
        tags,
        author,
        isPinned
      });

      // Upload staged files if any
      if (stagedFiles.length > 0 && savedNote?._id) {
        const formData = new FormData();
        stagedFiles.forEach(file => formData.append('files', file));
        formData.append('noteId', savedNote._id);
        formData.append('folderId', folderId);
        await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-fiori-shellbar p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileEdit className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg">
              {noteToEdit ? 'Edit SAP Note (with AI Assistant)' : 'Create New SAP Note'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Note Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. SAP MM Material Master Creation via T-Code MM01"
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-fiori-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Folder (Day)</label>
              <select
                required
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary"
              >
                <option value="">-- Select Folder --</option>
                {folders.map(f => (
                  <option key={f._id} value={f._id}>{f.title}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">SAP Module</label>
              <select
                value={sapModule}
                onChange={e => setSapModule(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-fiori-primary"
              >
                <option value="GENERAL">General SAP</option>
                <option value="MM">SAP MM (Materials)</option>
                <option value="SD">SAP SD (Sales)</option>
                <option value="ABAP">SAP ABAP (Dev)</option>
                <option value="FICO">SAP FICO (Finance)</option>
                <option value="BASIS">SAP BASIS (Admin)</option>
                <option value="PP">SAP PP (Production)</option>
                <option value="PM">SAP PM (Maintenance)</option>
                <option value="QM">SAP QM (Quality)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="MM01, MARA, MaterialMaster"
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary font-mono"
              />
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="rounded text-fiori-primary focus:ring-fiori-primary"
                />
                <span>Pin Note to Top</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Short Summary / Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief overview of transaction steps and database tables..."
              className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary"
            />
          </div>

          {/* Main Rich Text Editor & AI Panel Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Rich Editor */}
            <div className="lg:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">Rich Text Content & Code Snippets</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                onTriggerAI={handleTriggerAI}
                isAIChecking={isAIChecking}
              />
            </div>

            {/* AI Assistant Panel */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">Real-Time AI Proofreader</label>
              <AIAssistantPanel
                suggestions={aiSuggestions}
                protectedTerms={protectedTerms}
                onAcceptAll={handleAcceptAllAI}
                onRejectAll={handleRejectAllAI}
                onAcceptOne={handleAcceptOneAI}
                onRejectOne={handleRejectOneAI}
                isChecking={isAIChecking}
              />
            </div>

          </div>

          {/* Drag & Drop File Attachments Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-500">Attach Learning Materials (PDF, DOCX, PPT, XLSX, Images, Code, ZIP)</label>
            <FileUploader
              files={stagedFiles}
              setFiles={setStagedFiles}
            />
          </div>

          {/* Submit Footer */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="fd-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="fd-btn-emphasized text-xs shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : noteToEdit ? 'Update Note' : 'Publish Note'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
