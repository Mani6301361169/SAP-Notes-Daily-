import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import { 
  Layers, Lock, Mail, Eye, EyeOff, Shield, User, Sun, Moon, 
  RotateCcw, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Key
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, showToast }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('mani@gmail.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Input Validation
    if (!email || !email.trim()) {
      setErrorMsg('Please enter your email address or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      const userRole = res.user?.role || 'user';
      if (showToast) {
        showToast(`Welcome back, ${res.user.name}! Authenticated as ${userRole.toUpperCase()}.`, 'success');
      }
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or server connection error. Please try again.';
      setErrorMsg(msg);
      if (showToast) {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handleQuickDemoFill = (targetRole) => {
    setErrorMsg('');
    if (targetRole === 'admin') {
      setEmail('mani@gmail.com');
      setPassword('123');
      if (showToast) showToast('Loaded Admin Credentials (mani@gmail.com / 123)', 'info');
    } else {
      setEmail('user@sap.com');
      setPassword('123');
      if (showToast) showToast('Loaded Learner User Credentials (user@sap.com / 123)', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fiori-shellbar to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-fiori-primary selection:text-white relative overflow-hidden">
      
      {/* Background Decorative SAP Grid Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fiori-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Top Header Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-fiori-primary text-white p-2.5 rounded-xl shadow-lg flex items-center justify-center border border-sky-400/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              SAP Notes <span className="bg-sky-500/30 text-sky-200 text-xs px-2 py-0.5 rounded font-mono border border-sky-400/40">FIORI 3.0</span>
            </span>
            <p className="text-[11px] text-slate-300 font-medium">Daily Learning Management System</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-700 transition shadow-sm"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-fiori-shellbar to-slate-900 p-8 text-white text-center relative border-b border-slate-700">
            <div className="w-14 h-14 bg-fiori-primary/30 border border-sky-400/40 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
              <Shield className="w-7 h-7 text-sky-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              SAP Daily Notes Management System
            </h2>
            <p className="text-xs text-sky-200/90 mt-1 font-medium">
              Sign in to access your SAP Daily Notes Portal.
            </p>
          </div>

          {/* Quick Demo Autofill Bar */}
          <div className="bg-slate-100 dark:bg-slate-950/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Default Credentials:
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-md transition flex items-center gap-1 border border-amber-400/30"
              >
                <Shield className="w-3 h-3" /> Admin (mani@gmail.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('user')}
                className="px-2.5 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 rounded-md transition flex items-center gap-1 border border-sky-400/30"
              >
                <User className="w-3 h-3" /> Learner User
              </button>
            </div>
          </div>

          {/* Login Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs rounded-xl font-medium flex items-start space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email / Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mani@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiori-primary focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-fiori-primary dark:text-sky-400 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiori-primary focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-600 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-fiori-primary focus:ring-fiori-primary border-slate-300 dark:border-slate-700"
                />
                <span>Remember Me on this device</span>
              </label>
            </div>

            {/* Action Buttons: Sign In & Clear */}
            <div className="pt-2 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="col-span-1 fd-btn-secondary text-xs py-2.5 flex items-center justify-center space-x-1.5"
                title="Clear input fields"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Clear</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="col-span-2 fd-btn-emphasized py-2.5 text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to SAP Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
            <span>Mail: <strong>mani@gmail.com</strong> | Password: <strong>123</strong></span>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        showToast={showToast}
      />

      {/* Page Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-400 z-10">
        © 2026 SAP Enterprise Notes LMS. Protected by JWT Role-Based Security & SAP Term Protection Engine.
      </footer>

    </div>
  );
}
