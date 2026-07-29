import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Key, Mail, Lock, X, CheckSquare, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, showToast }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [role, setRole] = useState('admin'); // 'admin' | 'user'
  const [email, setEmail] = useState('admin@sap.com');
  const [password, setPassword] = useState('Admin@123');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
        showToast('Successfully logged in!', 'success');
        onClose();
      } else if (mode === 'register') {
        await register(name, email, password, role);
        showToast('Account created successfully!', 'success');
        onClose();
      } else if (mode === 'forgot') {
        showToast('Password reset link has been dispatched to your email.', 'info');
        setMode('login');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      setEmail('admin@sap.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@sap.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-fiori-shellbar p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-fiori-primary rounded-xl shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {mode === 'login' && 'SAP Portal Sign In'}
                {mode === 'register' && 'Create SAP Learner Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-300">Enterprise Role-Based Authentication</p>
            </div>
          </div>
        </div>

        {/* Quick Demo Autofill Bar */}
        <div className="bg-slate-100 dark:bg-slate-900/80 px-6 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">Quick Demo Credentials:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFillDemo('admin')}
              className="text-amber-600 hover:underline flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleFillDemo('user')}
              className="text-sky-600 hover:underline flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> Learner
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 dark:text-red-400 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sap.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 ${
                    role === 'user' ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-600' : 'border-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Learner User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 ${
                    role === 'admin' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-600' : 'border-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-fiori-primary focus:ring-fiori-primary"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-fiori-primary hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full fd-btn-emphasized py-2.5 text-sm font-bold shadow-md"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
          </button>

          {/* Mode Switchers */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-fiori-primary font-bold hover:underline">
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-fiori-primary font-bold hover:underline">
                  Back to Login
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
