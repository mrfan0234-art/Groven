import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, Loader2, Sparkles, FolderKanban, CheckCircle2, ChevronRight, Activity, Calendar, Award } from 'lucide-react';
import { dbService, ProjectInquiry } from '../lib/supabase';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  onOpenIntake: () => void;
}

export const ClientDashboard = ({ isOpen, onClose, user, onLogout, onOpenIntake }: ClientDashboardProps) => {
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.getMyInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchInquiries();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'In Review': return 1;
      case 'Blueprint Phase': return 2;
      case 'Engineering': return 3;
      case 'Deploying': return 4;
      case 'Completed': return 5;
      default: return 1;
    }
  };

  const steps = [
    { label: "Intake Audit", desc: "Verifying specs" },
    { label: "UX Blueprinting", desc: "Interactive Figma wireframes" },
    { label: "Core Engineering", desc: "Coding React and Supabase integration" },
    { label: "Edge Deploy", desc: "Deploying multi-region and optimization" },
    { label: "Handover", desc: "Lighthouse audit complete" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/85 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220, mass: 0.8 }}
          className="relative w-full max-w-2xl h-full bg-brand-black border-l border-white/5 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto"
        >
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-brand-bg/80 backdrop-blur-md sticky top-0 z-20">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-1 animate-pulse">
                Authorized Client Portal
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide">
                Welcome, {user?.user_metadata?.full_name || 'Enterprise Executive'}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                title="Sign out of panel"
                className="p-3 border border-red-500/10 hover:border-red-500/20 text-red-400/70 hover:text-red-400 bg-red-500/5 transition-all rounded-full cursor-none"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-3 border border-white/10 hover:border-white/20 hover:text-brand-gold text-white/60 transition-all rounded-full cursor-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body panel */}
          <div className="p-8 md:p-10 flex-grow flex flex-col gap-10">
            {/* Account Card statistics */}
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-brand-gold/10 pointer-events-none">
                <Award className="w-20 h-20" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Corporate Profile</span>
                <span className="text-sm text-white font-mono tracking-wide truncate block">{user?.email}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Active Architecture Briefs</span>
                <span className="text-xl font-serif text-brand-gold font-bold">{inquiries.length}</span>
              </div>
            </div>

            {/* Inquiries / Blueprint Trackers */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-brand-gold" /> System Inquiries ({inquiries.length})
                </h5>
                <button 
                  onClick={fetchInquiries}
                  className="text-[10px] uppercase tracking-[0.1em] text-brand-gold hover:text-white transition-colors cursor-none underline decoration-brand-gold/30"
                >
                  Force Sync
                </button>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-4" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gray/50 font-bold block">Synchronizing with client engine</span>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="border border-white/5 rounded-xl p-8 text-center flex flex-col items-center bg-white/5">
                  <Activity className="w-10 h-10 text-brand-gray/30 mb-4 animate-pulse" />
                  <p className="text-sm text-brand-gray/60 font-light max-w-xs leading-relaxed mb-6">
                    No blueprints found for this authenticated identifier. Initiate your first solution setup right away.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenIntake();
                    }}
                    className="px-6 py-2.5 border border-brand-gold/30 hover:border-brand-gold text-[10px] uppercase tracking-[0.3em] text-brand-gold hover:text-white transition-all rounded-full cursor-none bg-brand-gold/5"
                  >
                    Configure Solutions
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {inquiries.map((inq, idx) => {
                    const activeStepNum = getStatusStep(inq.status);
                    return (
                      <div 
                        key={inq.id || idx} 
                        className="bg-white/5 border border-white/5 p-6 rounded-xl flex flex-col gap-6 hover:border-brand-gold/20 transition-all duration-500"
                      >
                        {/* Summary */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-mono text-brand-gold/50 block mb-1 uppercase tracking-widest bg-brand-gold/5 border border-brand-gold/10 px-3 py-1 rounded-full w-fit">
                              {inq.id}
                            </span>
                            <h4 className="text-lg font-serif text-white tracking-wide mt-2">
                              {inq.service_type}
                            </h4>
                            <p className="text-xs text-brand-gray/50 font-light mt-1 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" /> Filed: {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Just now'}
                            </p>
                          </div>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-mono bg-brand-gold/10 text-brand-gold px-3.5 py-1.5 border border-brand-gold/25 rounded-md font-bold">
                            {inq.status}
                          </span>
                        </div>

                        {/* Specs recap */}
                        <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 text-xs font-mono">
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.1em] text-brand-gray/40 block mb-0.5">Aesthetic Mode</span>
                            <span className="text-white truncate block uppercase">{inq.design_preference.split(' ')[0]}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.1em] text-brand-gray/40 block mb-0.5">Investment Allocation</span>
                            <span className="text-white truncate block">{inq.budget_range.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Deployment Timeline Visualizer */}
                        <div className="space-y-4">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 block font-bold">Systems Roadmap Progress</span>
                          <div className="grid grid-cols-5 gap-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            {[1, 2, 3, 4, 5].map((sStep) => (
                              <div 
                                key={sStep} 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  sStep <= activeStepNum ? 'bg-brand-gold' : 'bg-white/5'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] uppercase font-mono tracking-wider font-bold">
                            <span className={activeStepNum >= 1 ? 'text-brand-gold' : 'text-brand-gray/30'}>Intake</span>
                            <span className={activeStepNum >= 2 ? 'text-brand-gold' : 'text-brand-gray/30'}>Blueprint</span>
                            <span className={activeStepNum >= 3 ? 'text-brand-gold' : 'text-brand-gray/30'}>Dev</span>
                            <span className={activeStepNum >= 4 ? 'text-brand-gold' : 'text-brand-gray/30'}>Review</span>
                            <span className={activeStepNum >= 5 ? 'text-brand-gold' : 'text-brand-gray/30'}>Live</span>
                          </div>

                          {/* Roadmap description card */}
                          <div className="bg-brand-black/50 p-4 border border-white/5 rounded-lg flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-brand-gold mt-1 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-white uppercase font-mono block tracking-wider">
                                Current Status: {steps[activeStepNum - 1]?.label || 'Reviewing specs'}
                              </span>
                              <span className="text-[10px] text-brand-gray/50 font-light block mt-0.5">
                                {steps[activeStepNum - 1]?.desc || 'Validating requirements against systems architectures.'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer sticky bar */}
          <div className="p-8 md:p-10 border-t border-white/5 bg-brand-bg sticky bottom-0 z-20 flex gap-4">
            <button
              onClick={() => {
                onClose();
                onOpenIntake();
              }}
              className="group flex-1 py-5 bg-brand-gold text-brand-black uppercase tracking-[0.4em] text-[10px] font-bold transition-all duration-700 hover:shadow-2xl hover:shadow-brand-gold/20 flex items-center justify-center gap-4 cursor-none rounded-xl"
            >
              <span>Initiate Additional Intake</span>
              <ChevronRight className="w-4 h-4 text-brand-black transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
