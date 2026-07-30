import React, { useState } from 'react';
import { Mail, Key, Lock, CheckCircle2, ArrowLeft, X, Send, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPasswordModal({ isOpen, onClose, showToast }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/auth/forgot-password', { email });
      showToast('Verification OTP code has been dispatched to your email.', 'info');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to process request for this email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter a valid 4-digit verification code.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/auth/forgot-password', { email, newPassword });
      showToast('Password reset successfully! You can now log in.', 'success');
      onClose();
      // Reset local state
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-fiori-shellbar p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-fiori-primary rounded-xl shadow-md">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Reset Password</h3>
              <p className="text-xs text-slate-300">SAP Security Credential Recovery</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 dark:bg-slate-900/60 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
          <span className={`px-2 py-0.5 rounded-full ${step === 1 ? 'bg-fiori-primary text-white' : 'text-slate-500'}`}>1. Email</span>
          <span className="text-slate-300">➔</span>
          <span className={`px-2 py-0.5 rounded-full ${step === 2 ? 'bg-fiori-primary text-white' : 'text-slate-500'}`}>2. Verification</span>
          <span className="text-slate-300">➔</span>
          <span className={`px-2 py-0.5 rounded-full ${step === 3 ? 'bg-fiori-primary text-white' : 'text-slate-500'}`}>3. New Password</span>
        </div>

        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 dark:text-red-400 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Request Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your registered SAP Portal email address. We will send a verification code to reset your account credentials.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@sap.com or user@sap.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full fd-btn-emphasized py-2.5 text-xs font-bold shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    <span>Send Verification Code</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A 4-digit code was sent to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. (For demo testing, enter <code className="bg-sky-100 text-sky-800 px-1 rounded font-mono font-bold">1234</code>).
              </p>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Enter 4-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full tracking-widest text-center text-lg font-mono font-bold py-2 rounded-xl border border-slate-300 dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-fiori-primary focus:outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 fd-btn-secondary text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 fd-btn-emphasized text-xs font-bold shadow-md"
                >
                  Verify Code
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-fiori-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full fd-btn-positive py-2.5 text-xs font-bold shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? 'Resetting Password...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save New Password & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
