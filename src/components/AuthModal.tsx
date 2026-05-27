import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { dbService } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isSignUp) {
        if (!fullName) {
          setErrorMessage('Please provide your full name to configure client files.');
          setIsLoading(false);
          return;
        }
        const data = await dbService.signUp(email, password, fullName);
        if (data?.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        const data = await dbService.signIn(email, password);
        if (data?.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setErrorMessage(err.message || 'Authentication sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="relative w-full max-w-md bg-brand-black border border-white/10 p-8 rounded-2xl shadow-2xl z-10 flex flex-col justify-between"
        >
          {/* Close trigger */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white border border-white/5 hover:border-white/10 rounded-full transition-all cursor-none"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Form */}
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-[9px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-2">
                Secure Client Portal
              </span>
              <h3 className="text-3xl font-serif text-white uppercase tracking-tight">
                {isSignUp ? 'Establish Identity' : 'Client Access'}
              </h3>
              <p className="text-xs text-brand-gray/50 mt-1">
                {isSignUp ? 'Configure secure metadata' : 'Review project blueprint queues'}
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs text-red-400 font-light flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="alex@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-gold disabled:bg-brand-gold/30 text-brand-black transition-all rounded-xl uppercase tracking-[0.4em] text-[10px] font-bold flex items-center justify-center gap-3 cursor-none mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Security...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> {isSignUp ? 'Establish Identity' : 'Authenticate Console'}
                  </>
                )}
              </button>
            </form>

            <div className="h-[1px] bg-white/5" />

            <div className="text-center text-xs">
              <span className="text-brand-gray/50">
                {isSignUp ? 'Already authenticated? ' : 'First-time enterprise connection? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage('');
                }}
                className="text-white hover:text-brand-gold font-bold transition-colors underline decoration-brand-gold/30 underline-offset-4 cursor-none"
              >
                {isSignUp ? 'Sign In' : 'Create Credentials'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
