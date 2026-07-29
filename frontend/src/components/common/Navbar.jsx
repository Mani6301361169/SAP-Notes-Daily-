import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  BookOpen, Search, Moon, Sun, Bell, User, LogOut, Shield, 
  Sparkles, CheckCircle2, ChevronDown, Layers
} from 'lucide-react';

export default function Navbar({ onSearch, activeView, setActiveView, onOpenAuth }) {
  const { user, logout, quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (onSearch) onSearch(q);
  };

  const notificationsList = [
    { id: 1, text: 'Folder "📁 Day 5 – Organizational Structure" updated.', time: '10m ago', type: 'folder' },
    { id: 2, text: 'New Note "ABAP Fundamentals" added with SE11 details.', time: '1h ago', type: 'note' },
    { id: 3, text: 'Grammar and spelling checked successfully.', time: '2h ago', type: 'ai' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-fiori-shellbar text-white shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('folders')}>
          <div className="bg-fiori-primary text-white p-2 rounded-lg font-bold flex items-center justify-center shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide flex items-center gap-2">
              SAP Notes <span className="bg-sky-500/30 text-sky-200 text-xs px-2 py-0.5 rounded font-mono border border-sky-400/40">FIORI 3.0</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium">Daily Learning Management System</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search SAP T-Codes (MM01, VA01, SE11), Modules, Notes, Tags..."
              className="w-full bg-slate-800/80 border border-slate-600/60 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiori-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Role Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Quick Role Switcher for Seamless Testing */}
          <div className="hidden lg:flex items-center bg-slate-800/80 border border-slate-700 rounded-full p-1 text-xs">
            <button
              onClick={() => quickSwitchRole('admin')}
              className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                user?.role === 'admin' 
                  ? 'bg-fiori-primary text-white shadow' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Admin
            </button>
            <button
              onClick={() => quickSwitchRole('user')}
              className={`px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                user?.role === 'user' 
                  ? 'bg-sky-600 text-white shadow' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-sky-300" />
              Learner User
            </button>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/60 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">3 New</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                  {notificationsList.map(n => (
                    <div key={n.id} className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{n.text}</p>
                      <span className="text-slate-400 text-[10px]">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-700/60 transition"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-fiori-primary object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-tight">{user.name}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${user.role === 'admin' ? 'text-amber-400' : 'text-sky-300'}`}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => { setActiveView('dashboard'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <Layers className="w-4 h-4 text-fiori-primary" />
                      <span>{user.role === 'admin' ? 'Admin Dashboard' : 'User Learning Portal'}</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                    <button
                      onClick={() => { logout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2 text-xs font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="fd-btn-emphasized text-xs"
            >
              Sign In
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
