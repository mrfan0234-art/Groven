import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Clock, Send, Shield, Zap, Search, Eye } from 'lucide-react';

interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  description: string;
  timeframe: string;
  deliverables: string[];
  icon: React.ReactNode;
}

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: ProcessStep[] = [
    {
      number: "01",
      phase: "Alignment",
      title: "Interactive Discovery",
      description: "We audit your objectives, map your target audience personas, and lock down your digital aesthetic goals. This is where we align heavy technical capabilities with raw creative direction.",
      timeframe: "Week 01",
      deliverables: ["Visual moodboard", "Digital scope of work", "Technology stack recommendation"],
      icon: <Search className="w-6 h-6 text-brand-gold" />
    },
    {
      number: "02",
      phase: "Blueprint",
      title: "Tactical UX/UI Blueprinting",
      description: "We craft interactive wireframes, custom structural sitemaps, and gorgeous high-fidelity design cards. Everything is modeled to create smooth motion experiences and optimize conversion rates.",
      timeframe: "Week 02-03",
      deliverables: ["Interactive Figma blueprints", "Layout rhythm structure", "Motion animation specification"],
      icon: <Eye className="w-6 h-6 text-brand-gold" />
    },
    {
      number: "03",
      phase: "Engineering",
      title: "Elite Core Development",
      description: "Our studio hand-crafts performance-pristine React with Tailwind CSS, utilizing clean TypeScript, advanced custom triggers, and zero-flicker client transitions. Fully integrated with secure Supabase databases.",
      timeframe: "Week 04-06",
      deliverables: ["Hand-crafted frontend site codebase", "Supabase back-end connectivity", "Micro-interactive UI widgets"],
      icon: <Cpu className="w-6 h-6 text-brand-gold" />
    },
    {
      number: "04",
      phase: "Deployment",
      title: "Global Scale & Verification",
      description: "We execute multi-region Cloud deployment, run speed and performance optimization tests (targeting 100/100 Lighthouse metrics), and secure edge network caches for instantaneous loads worldwide.",
      timeframe: "Week 07 + Support",
      deliverables: ["Production live release", "Lighthouse audit clearance", "12-month resilience and scale assurance"],
      icon: <Zap className="w-6 h-6 text-brand-gold" />
    }
  ];

  return (
    <section id="process" className="py-40 bg-brand-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[20%] left-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-80 h-80 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-24">
          <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold mb-6 block font-bold">The Blueprint Formula</span>
          <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none mb-8">
            Our Custom <br /><span className="italic text-brand-gold/50">Execution Flow</span>
          </h2>
          <p className="text-lg text-brand-gray/70 font-light tracking-wide max-w-xl">
            We operate with surgical precision. Each phase is calculated to eliminate operational friction and deliver absolute digital supremacy.
          </p>
        </div>

        {/* Desktop Interface */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">
          {/* Step Selector Tab Navigation */}
          <div className="col-span-5 flex flex-col gap-6">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`text-left p-8 rounded-xl border transition-all duration-700 cursor-none flex items-center justify-between group ${
                  activeStep === index
                    ? 'bg-white/5 border-brand-gold/40 shadow-xl shadow-brand-gold/5'
                    : 'bg-transparent border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-serif font-bold transition-all duration-500 ${
                    activeStep === index ? 'text-brand-gold' : 'text-white/20 group-hover:text-white/40'
                  }`}>
                    {step.number}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gray/40 block mb-1">
                      Phase {step.phase}
                    </span>
                    <h4 className="text-xl font-serif text-white group-hover:text-brand-gold transition-colors duration-500">
                      {step.title}
                    </h4>
                  </div>
                </div>
                <div className={`p-3 rounded-full border transition-all duration-700 ${
                  activeStep === index 
                    ? 'bg-brand-gold text-brand-black border-brand-gold' 
                    : 'bg-white/5 text-white/40 border-white/10 group-hover:border-white/20 group-hover:text-white'
                }`}>
                  {step.icon}
                </div>
              </button>
            ))}
          </div>

          {/* Detailed step visualization */}
          <div className="col-span-7 h-[500px] bg-white/5 border border-white/5 rounded-2xl p-12 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[160px] font-serif italic text-white/5 leading-none select-none font-bold">
                {steps[activeStep].number}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">
                      {steps[activeStep].phase} Spectrum
                    </span>
                    <span className="text-xs font-mono text-brand-gray/50 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {steps[activeStep].timeframe}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-brand-gray/80 font-light leading-relaxed max-w-2xl text-base tracking-wide mb-8">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div>
                  <div className="h-[1px] bg-white/5 w-full mb-8" />
                  <h5 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 block font-bold">Keys Deliverables</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps[activeStep].deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                        <span className="text-xs uppercase tracking-[0.1em] text-brand-gray/80 font-mono">
                          {del}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Interface (Stacking layout with interactive accordion) */}
        <div className="lg:hidden flex flex-col gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`border rounded-xl transition-all duration-700 ${
                activeStep === index ? 'bg-white/5 border-brand-gold/30' : 'bg-transparent border-white/5'
              }`}
            >
              <button
                onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                className="w-full text-left p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-serif font-bold ${activeStep === index ? 'text-brand-gold' : 'text-white/20'}`}>
                    {step.number}
                  </span>
                  <h4 className="text-lg font-serif text-white">{step.title}</h4>
                </div>
                <div className={`p-2 rounded-full border transition-all duration-500 ${
                  activeStep === index ? 'bg-brand-gold text-brand-black' : 'border-white/10 text-white/40'
                }`}>
                  {step.icon}
                </div>
              </button>

              <AnimatePresence>
                {activeStep === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 pt-2 border-t border-white/5 flex flex-col gap-6">
                      <p className="text-brand-gray/70 text-sm leading-relaxed font-light">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">Timeline:</span>
                        <span className="text-xs font-mono text-white/80">{step.timeframe}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-1">Deliverables:</span>
                        {step.deliverables.map((del, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-brand-gold" />
                            <span className="text-xs text-brand-gray/90 font-mono">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
