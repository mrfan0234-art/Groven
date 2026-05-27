import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Sparkles, Building, Calendar, DollarSign, Layers } from 'lucide-react';
import { dbService, ProjectInquiry } from '../lib/supabase';

interface IntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedData?: {
    serviceType: string;
    extraFeaturesNotes: string;
    estimatedCost: string;
  } | null;
  onCompletion: () => void;
}

export const IntakeForm = ({ isOpen, onClose, preselectedData, onCompletion }: IntakeFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');

  // Form states
  const [serviceType, setServiceType] = useState('Bespoke Enterprise Architecture');
  const [designPreference, setDesignPreference] = useState('Futuristic Neo-noir (Slate & Amber Glow)');
  const [budgetRange, setBudgetRange] = useState('$10k - $20k');
  const [timeline, setTimeline] = useState('Standard Pace (4-6 weeks)');
  
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  // Handle preselected data from solution modal clicks
  useEffect(() => {
    if (preselectedData) {
      setServiceType(preselectedData.serviceType);
      if (preselectedData.extraFeaturesNotes) {
        setProjectNotes(preselectedData.extraFeaturesNotes + '\n\n');
      }
      setStep(2); // Jump to step 2 since service is active!
    }
  }, [preselectedData]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      alert('Please fill in your name and email so we can verify this digital intake.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        service_type: serviceType,
        design_preference: designPreference,
        budget_range: budgetRange,
        timeline,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        company_name: companyName || undefined,
        project_notes: projectNotes || undefined,
      };

      const result = await dbService.submitInquiry(payload);
      setGeneratedRefId(result.id || `inq_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submit error:', err);
      alert(`There was an error transmitting your blueprint request: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    // Reset Form
    setStep(1);
    setIsSuccess(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setCompanyName('');
    setProjectNotes('');
    onCompletion();
    onClose();
  };

  // Step configs
  const serviceOptions = [
    "Bespoke Enterprise Architecture",
    "High-Conversion Landing Engines",
    "Strategic UI/UX Narratives",
    "Global Commerce Integration",
    "Identity & Digital Presence",
    "Custom Tailored Solution"
  ];

  const designOptions = [
    "Futuristic Neo-noir (Slate & Amber Glow)",
    "Swiss Modern (Ultra High-Contrast Grid)",
    "Classical Editorial (Elegant Serif Book)",
    "Technical Minimalist (Terminal Grid and JetBrains Mono)"
  ];

  const budgetOptions = [
    "$5k - $10k (Essential Scope)",
    "$10k - $20k (Strategic Tier)",
    "$20k - $50k (Advanced Enterprise)",
    "$50k - $100k (Elite Global System)",
    "Bespoke / Unlimited Architectural Portfolio"
  ];

  const timelineOptions = [
    "ASAP (Emergency Priority Deployment)",
    "Standard Pace (4-6 weeks blueprinting)",
    "Strategic Build (8-12 weeks modular scale)"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
        />

        {/* Form Container panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl bg-brand-black border border-white/10 rounded-2xl shadow-2xl flex flex-col z-10 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-brand-bg/60 backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-1">
                Project Intake Portal
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide">
                Architect Your Digital Future
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-3 border border-white/5 hover:border-white/10 hover:text-brand-gold text-white/40 transition-all rounded-full cursor-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-6 md:p-10">
            {isSubmitting ? (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-brand-gold animate-spin mb-6" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold block font-bold mb-2">Transmitting Coordinates</span>
                <p className="text-brand-gray/50 text-sm font-light max-w-sm">
                  We are securing your choices and constructing your intake files in the Supabase engine. Hold tight.
                </p>
              </div>
            ) : isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-10 shadow-3xl shadow-brand-gold/5">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold block mb-4">Tactical Connection Confirmed</span>
                <h3 className="text-4xl md:text-5xl font-serif text-white tracking-normal leading-tight mb-6 max-w-xl">
                  Your Blueprint is in <span className="italic text-brand-gold/70">The Review Queue</span>
                </h3>
                <p className="text-brand-gray/70 font-light max-w-md leading-relaxed mb-8 text-sm">
                  We have received your configuration and created record <span className="font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/10 text-xs font-bold">{generatedRefId}</span> in our client database. An analyst will verify your scope and reach out within 12 business hours.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-lg bg-white/5 p-6 rounded-xl border border-white/5 mb-10 text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Architecture</span>
                    <span className="text-xs text-white uppercase font-mono tracking-wider truncate block">{serviceType}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">Aesthetic Profile</span>
                    <span className="text-xs text-white uppercase font-mono tracking-wider truncate block">{designPreference.split(' ')[0]}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDone}
                  className="px-14 py-5 bg-brand-gold text-brand-black uppercase tracking-[0.4em] text-[10px] font-bold transition-all duration-700 hover:shadow-2xl hover:shadow-brand-gold/20 cursor-none rounded-xl"
                >
                  Confirm & Reset
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Steps Navigator */}
                <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-xl border border-white/5 mb-8">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 ${
                        step === stepNum 
                          ? 'bg-brand-gold text-brand-black border border-brand-gold' 
                          : step > stepNum 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'bg-transparent text-white/20 border border-white/5'
                      }`}>
                        {stepNum}
                      </div>
                      <span className={`text-[9px] uppercase tracking-[0.2em] hidden sm:block ${step === stepNum ? 'text-brand-gold font-bold' : 'text-white/20'}`}>
                        {stepNum === 1 ? 'Solution' : stepNum === 2 ? 'Visuals' : stepNum === 3 ? 'Budget' : 'Identity'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step Content with AnimatePresence */}
                <div>
                  {step === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-xl font-serif text-white mb-2">Select Digital System Scope</h4>
                        <p className="text-xs text-brand-gray/50">Choose the structural core that matches your business objectives.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setServiceType(option)}
                            className={`p-5 rounded-xl border text-left cursor-none transition-all duration-500 flex items-center gap-4 ${
                              serviceType === option 
                                ? 'bg-brand-gold/10 border-brand-gold/30 text-white' 
                                : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                            }`}
                          >
                            <div className={`p-2 rounded-full border ${serviceType === option ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-gold' : 'border-white/10 text-white/30'}`}>
                              <Layers className="w-4 h-4" />
                            </div>
                            <span className="text-xs uppercase tracking-[0.1em] font-mono leading-tight">{option}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-xl font-serif text-white mb-2">Map Your Aesthetic Blueprint</h4>
                        <p className="text-xs text-brand-gray/50">Tone and palette dictate brand velocity. Select your foundational style guidelines.</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        {designOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDesignPreference(option)}
                            className={`p-5 rounded-xl border text-left cursor-none transition-all duration-500 flex items-center justify-between ${
                              designPreference === option 
                                ? 'bg-brand-gold/10 border-brand-gold/30 text-white' 
                                : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <Sparkles className={`w-4 h-4 ${designPreference === option ? 'text-brand-gold' : 'text-white/20'}`} />
                              <span className="text-xs uppercase tracking-[0.1em] font-mono leading-tight">{option}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 ${designPreference === option ? 'border-brand-gold' : 'border-white/10'}`}>
                              {designPreference === option && <div className="w-full h-full rounded-full bg-brand-gold" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-serif text-white mb-2">Investment & Timeline Estimates</h4>
                          <p className="text-xs text-brand-gray/50">What is the investment tier you've allocated and how fast do we launch?</p>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-bold">Planned Investment Allocation</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {budgetOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setBudgetRange(opt)}
                                className={`p-4 rounded-xl border text-left cursor-none transition-all duration-500 flex items-center gap-3 ${
                                  budgetRange === opt 
                                    ? 'bg-brand-gold/10 border-brand-gold/30 text-white font-bold' 
                                    : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                                }`}
                              >
                                <DollarSign className="w-4 h-4 text-brand-gold" />
                                <span className="text-xs uppercase tracking-[0.05em] font-mono leading-tight">{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-bold">Project Timeline Expectation</label>
                          <div className="flex flex-col gap-3">
                            {timelineOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setTimeline(opt)}
                                className={`p-4 rounded-xl border text-left cursor-none transition-all duration-500 flex items-center gap-3 ${
                                  timeline === opt 
                                    ? 'bg-brand-gold/10 border-brand-gold/30 text-white font-bold' 
                                    : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10'
                                }`}
                              >
                                <Calendar className="w-4 h-4 text-brand-gold" />
                                <span className="text-xs uppercase tracking-[0.05em] font-mono leading-tight">{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-xl font-serif text-white mb-2">Confirm Client Identity</h4>
                        <p className="text-xs text-brand-gray/50">Your identity details are saved securely using strict modern standards.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block">Contact Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Alex Mercer"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block">Contact Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="alex@enterprise.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block">Optional Phone</label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 0192"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block">Company / Enterprise</label>
                          <input
                            type="text"
                            placeholder="Acme Global Inc"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all cursor-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold block">Project Brief Notes</label>
                        <textarea
                          rows={4}
                          placeholder="Describe your technical requirements, specific module expectations or reference websites..."
                          value={projectNotes}
                          onChange={(e) => setProjectNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-brand-gold/40 focus:outline-none transition-all resize-none cursor-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-4 border border-white/10 text-white rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold flex items-center gap-2 hover:border-white/20 transition-colors cursor-none"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center gap-2 transition-colors cursor-none"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-brand-gold text-brand-black rounded-xl uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-brand-gold/20 transition-all cursor-none"
                    >
                      Transmit Blueprint Brief <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
