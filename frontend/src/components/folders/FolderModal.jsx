import React, { useState, useEffect } from 'react';
import { FolderPlus, X } from 'lucide-react';

export default function FolderModal({ isOpen, onClose, onSave, folderToEdit }) {
  const [title, setTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (folderToEdit) {
      setTitle(folderToEdit.title);
      setDayNumber(folderToEdit.dayNumber || 1);
      setDescription(folderToEdit.description || '');
    } else {
      setTitle('');
      setDayNumber(1);
      setDescription('');
    }
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ title, dayNumber, description });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-fiori-shellbar p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg">
              {folderToEdit ? 'Edit Folder' : 'Create New Day Folder'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Day #</label>
              <input
                type="number"
                min="1"
                required
                value={dayNumber}
                onChange={e => setDayNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Folder Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 📁 Day 6 – Financial Accounting FICO"
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Summary of SAP concepts covered in this day..."
              className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-700">
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
              className="fd-btn-emphasized text-xs"
            >
              {loading ? 'Saving...' : folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
