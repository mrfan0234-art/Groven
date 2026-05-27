import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ShieldCheck, Zap, Layers, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onInitiateInquiry: (initialValues: {
    serviceType: string;
    extraFeaturesNotes: string;
    estimatedCost: string;
  }) => void;
}

export const ServiceModal = ({ service, onClose, onInitiateInquiry }: ServiceModalProps) => {
  const [cmsIntegration, setCmsIntegration] = useState(false);
  const [analyticsDashboard, setAnalyticsDashboard] = useState(false);
  const [serverlessScale, setServerlessScale] = useState(false);

  // Reset addons when service changes
  useEffect(() => {
    setCmsIntegration(false);
    setAnalyticsDashboard(false);
    setServerlessScale(false);
  }, [service]);

  if (!service) return null;

  // Static/Custom details for our services
  const SERVICE_DETAILS: Record<number, {
    description: string;
    features: string[];
    basePrice: number;
    timeline: string;
  }> = {
    1: {
      description: "A comprehensive digital design and engineering package engineered to map your business model into a flawless online system. Highly customized multi-module layouts designed with premium responsive typography, robust loading optimization, and secure persistent integrations.",
      features: [
        "Up to 15 fully-custom page templates with robust responsive variations",
        "Express Serverless backend infrastructure integrations (Node.js/Supabase)",
        "Zero-flicker client page transition animations and optimized motion profiles",
        "Interactive analytics dashboard integration & client CRM syncing",
        "W3C standard architecture and A11y accessibility compliance certificates"
      ],
      basePrice: 15400,
      timeline: "6-8 weeks"
    },
    2: {
      description: "Ultra-fast, single-purpose landing systems built specifically for high conversion velocity. Perfect for SaaS launches, enterprise campaigns, or single-tier service offerings requiring extreme visual density and absolute aesthetic authority.",
      features: [
        "Highly aesthetic hero narrative paired with gorgeous responsive layout geometry",
        "100/100 Lighthouse speed performance optimization with instant-load edge cache",
        "Integrated dynamic interactive intake form, directly writing to Supabase DB",
        "Complete A/B layout variant structure & analytics framework setup",
        "Fluid CSS typography scaling & smooth scroll interactive zones"
      ],
      basePrice: 5800,
      timeline: "2-3 weeks"
    },
    3: {
      description: "We orchestrate complete interactive digital narratives. Our team designs visual components, high-density dashboard layouts, and custom motion controls that tell a powerful story and guide target audience cursors.",
      features: [
        "Sublime bespoke Figma UI/UX wireframes with comprehensive prototype transitions",
        "Interactive component libraries styled precisely with Tailwind CSS utilities",
        "Optimized client micro-animations and physics-based gesture feedbacks",
        "Comprehensive user-journey maps (audits, wireframes, style architectures)",
        "Premium font selection configurations & color palette custom alignments"
      ],
      basePrice: 9200,
      timeline: "4-5 weeks"
    },
    4: {
      description: "Scale your commerce business to global levels. High-performance shop integrations, customized checkout funnels, secure multi-regional pricing engines, and absolute inventory resilience.",
      features: [
        "Advanced headless commerce structures connecting custom React to secure engines",
        "Instant catalog searches and optimized product showcase filters",
        "Custom checkout flow visualizer with multi-step validation components",
        "Stripe payment gateway connection & secure customer portal setups",
        "Automated digital receipts & webhook inventory synchronizations"
      ],
      basePrice: 19500,
      timeline: "8-12 weeks"
    },
    5: {
      description: "Formulate a powerful, highly distinctive visual identity. Brand styling books, curated typography, custom high-contrast graphics, and interactive digital branding books.",
      features: [
        "Aesthetic digital brand archetype guides & complete typography system pairs",
        "High-contrast custom visual logos & vector animation blueprints",
        "Integrated 3D aesthetic canvas widgets or bespoke parallax illustrations",
        "Interactive dynamic brand guidelines system hosted on server node",
        "Comprehensive social toolkit graphic configurations & marketing media sets"
      ],
      basePrice: 4500,
      timeline: "3 weeks"
    }
  };

  const details = SERVICE_DETAILS[service.id] || {
    description: "Hand-crafted bespoke services tailored to optimize client outcomes worldwide.",
    features: ["Dynamic high-converting features", "Optimized cloud deployments", "Interactive visual configurations"],
    basePrice: 5000,
    timeline: "3-4 weeks"
  };

  const addOnCost = 
    (cmsIntegration ? 2500 : 0) + 
    (analyticsDashboard ? 1200 : 0) + 
    (serverlessScale ? 3500 : 0);

  const totalCostEstimate = details.basePrice + addOnCost;

  const handleInquiryProgression = () => {
    let addons = [];
    if (cmsIntegration) addons.push("Headless CMS Core Integration");
    if (analyticsDashboard) addons.push("Custom Analytics Engine");
    if (serverlessScale) addons.push("Multi-Region Edge Scale");
    
    onInitiateInquiry({
      serviceType: service.name,
      extraFeaturesNotes: addons.length > 0 
        ? `Configured with add-ons: ${addons.join(', ')}.` 
        : 'Configured with base specifications.',
      estimatedCost: `$${totalCostEstimate.toLocaleString()}`
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
        />

        {/* Drawer Component panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220, mass: 0.8 }}
          className="relative w-full max-w-2xl h-full bg-brand-black border-l border-white/5 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto"
        >
          {/* Top Header */}
          <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-brand-bg/80 backdrop-blur-md sticky top-0 z-20">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-1">
                Capability Details
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide">
                {service.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-3 border border-white/10 hover:border-white/20 hover:text-brand-gold text-white/60 transition-all rounded-full cursor-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Immersive Body content */}
          <div className="p-8 md:p-10 flex-grow flex flex-col gap-10">
            {/* Visual Header Image */}
            <div className="relative aspect-[16/9] w-full bg-brand-bg rounded-xl overflow-hidden border border-white/5">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold bg-brand-black/80 px-4 py-1.5 rounded-full border border-brand-gold/20">
                  {service.category}
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white font-bold bg-brand-black/80 px-4 py-1.5 rounded-full border border-white/10">
                  Timeline: {details.timeline}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 block font-bold">The Strategic Philosophy</h5>
              <p className="text-brand-gray text-base leading-relaxed font-light tracking-wide">
                {details.description}
              </p>
            </div>

            {/* Features list */}
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 block font-bold">Core Deliverables</h5>
              <div className="flex flex-col gap-3">
                {details.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-brand-gray/90 font-light">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price configuration engine (Addons) */}
            <div className="border border-white/5 bg-white/5 p-6 rounded-xl flex flex-col gap-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold block mb-1">
                  Blueprint Configurator
                </span>
                <p className="text-xs text-brand-gray/50">
                  Customize your technology configuration to generate a precision estimate.
                </p>
              </div>

              <div className="h-[1px] bg-white/5" />

              <div className="flex flex-col gap-4">
                {/* Addon 1 */}
                <button
                  onClick={() => setCmsIntegration(!cmsIntegration)}
                  className={`flex justify-between items-center p-4 border rounded-lg text-left cursor-none transition-all duration-300 ${
                    cmsIntegration 
                      ? 'bg-brand-gold/10 border-brand-gold/30 text-white' 
                      : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cmsIntegration ? 'bg-brand-gold animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <span className="text-xs uppercase tracking-[0.1em] block font-mono">Headless CMS Engine</span>
                      <span className="text-[10px] text-brand-gray/45 block font-light">Client-facing Sanity / Strapi integration.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-brand-gold font-bold">+$2,500</span>
                </button>

                {/* Addon 2 */}
                <button
                  onClick={() => setAnalyticsDashboard(!analyticsDashboard)}
                  className={`flex justify-between items-center p-4 border rounded-lg text-left cursor-none transition-all duration-300 ${
                    analyticsDashboard 
                      ? 'bg-brand-gold/10 border-brand-gold/30 text-white' 
                      : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${analyticsDashboard ? 'bg-brand-gold animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <span className="text-xs uppercase tracking-[0.1em] block font-mono">Advanced CRM & Analytics</span>
                      <span className="text-[10px] text-brand-gray/45 block font-light">Custom metrics dashboards & automated leads funnel.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-brand-gold font-bold">+$1,200</span>
                </button>

                {/* Addon 3 */}
                <button
                  onClick={() => setServerlessScale(!serverlessScale)}
                  className={`flex justify-between items-center p-4 border rounded-lg text-left cursor-none transition-all duration-300 ${
                    serverlessScale 
                      ? 'bg-brand-gold/10 border-brand-gold/30 text-white' 
                      : 'bg-transparent border-white/5 text-brand-gray/60 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${serverlessScale ? 'bg-brand-gold animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <span className="text-xs uppercase tracking-[0.1em] block font-mono">Multi-Region Cloud Scale</span>
                      <span className="text-[10px] text-brand-gray/45 block font-light">Zero-latency Edge delivery and resilient CDN setup.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-brand-gold font-bold">+$3,500</span>
                </button>
              </div>

              <div className="h-[1px] bg-white/5" />

              <div className="flex justify-between items-center bg-brand-black/50 p-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold">Estimated Investment</span>
                  <span className="text-xs text-brand-gray/50">Base: ${details.basePrice.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono text-white tracking-widest font-bold">
                    ${totalCostEstimate.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/40 block font-mono">USD Investment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action sticky bar */}
          <div className="p-8 md:p-10 border-t border-white/5 bg-brand-bg sticky bottom-0 z-20 flex gap-4">
            <button
              onClick={handleInquiryProgression}
              className="group flex-1 py-5 bg-brand-gold text-brand-black uppercase tracking-[0.4em] text-[10px] font-bold transition-all duration-700 hover:shadow-2xl hover:shadow-brand-gold/20 flex items-center justify-center gap-4 cursor-none rounded-xl"
            >
              <span>Initiate Custom Intake</span>
              <ArrowRight className="w-4 h-4 text-brand-black transition-all group-hover:translate-x-1.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
