/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Globe, 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Facebook, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Monitor,
  Layout,
  Cpu,
  Smartphone,
  Zap,
  Shield,
  User,
  LogOut,
  FolderKanban,
  Activity
} from 'lucide-react';

import { dbService } from './lib/supabase';
import { ProcessSection } from './components/ProcessSection';
import { ServiceModal } from './components/ServiceModal';
import { IntakeForm } from './components/IntakeForm';
import { AuthModal } from './components/AuthModal';
import { ClientDashboard } from './components/ClientDashboard';
import { Service } from './types';

// --- Static Data ---
const SERVICES: Service[] = [
  { id: 1, name: "Bespoke Enterprise Architecture", price: "Tier One", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", category: "Core Development" },
  { id: 2, name: "High-Conversion Landing Engines", price: "Essential", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", category: "Performance" },
  { id: 3, name: "Strategic UI/UX Narratives", price: "Premium", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800", category: "Experience" },
  { id: 4, name: "Global Commerce Integration", price: "Tier Two", image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800", category: "Scale" },
  { id: 5, name: "Identity & Digital Presence", price: "Boutique", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", category: "Branding" },
];

// --- Auxiliary Components ---

const SectionReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <motion.div
      className="cursor-dot hidden md:block"
      animate={{
        x: position.x - 6,
        y: position.y - 6,
        scale: isHovering ? 3 : 1,
        opacity: isHidden ? 0 : 1,
        backgroundColor: isHovering ? '#FFFFFF' : '#D4AF37'
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.2 }}
    />
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-brand-bg flex flex-col items-center justify-center"
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.h1
        className="text-6xl md:text-8xl font-serif tracking-[0.3em] font-bold shimmer-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        GROVEN
      </motion.h1>
      <motion.div
        className="mt-8 h-[1px] bg-brand-gold/30 w-48 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: 192 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <motion.div
          className="h-full bg-brand-gold"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};

interface NavbarProps {
  currentUser: any;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onBeginProject: () => void;
}

const Navbar = ({ currentUser, onOpenAuth, onOpenDashboard, onBeginProject }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-brand-gold z-[100] origin-left" style={{ scaleX }} />
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-brand-black/95 backdrop-blur-xl py-4 shadow-2xl' : 'bg-transparent py-10'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Navigation Links */}
          <div className="hidden md:flex gap-10 items-center">
            {['Solutions', 'Process'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="group relative text-[10px] uppercase tracking-[0.4em] text-white/70 hover:text-white transition-colors duration-500 cursor-none"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Logo brand */}
          <motion.a 
            href="/" 
            className="text-3xl font-serif tracking-[0.4em] font-bold shimmer-text cursor-none"
            whileHover={{ scale: 1.05 }}
          >
            GROVEN
          </motion.a>

          {/* User & Project CTAs */}
          <div className="flex gap-6 items-center">
            {currentUser ? (
              <button
                onClick={onOpenDashboard}
                className="hidden md:flex items-center gap-2 px-6 py-2 border border-brand-gold/30 hover:border-brand-gold text-[10px] uppercase tracking-[0.3em] text-brand-gold hover:text-white bg-brand-gold/5 transition-all duration-500 rounded-full cursor-none"
              >
                <User className="w-3.5 h-3.5" /> Dashboard
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden md:flex items-center gap-2 px-6 py-2 border border-white/15 hover:border-brand-gold text-[10px] uppercase tracking-[0.3em] text-white/80 hover:text-brand-gold transition-all duration-500 rounded-full cursor-none"
              >
                Client Portal
              </button>
            )}

            <button 
              onClick={onBeginProject}
              className="hidden md:block px-6 py-2 bg-brand-gold hover:bg-white text-brand-black text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 rounded-full cursor-none"
            >
              Begin Project
            </button>

            {/* Mobile menu icon */}
            <button className="md:hidden p-2 text-white/80 hover:text-white" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Slideout Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[1000] flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm ml-auto bg-brand-black border-l border-white/5 h-full p-8 flex flex-col justify-between"
            >
              {/* Close pin */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 p-2 text-white/40 hover:text-white border border-white/5 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-16 pt-20">
                <span className="text-3xl font-serif tracking-[0.4em] font-bold shimmer-text block">GROVEN</span>
                
                <div className="flex flex-col gap-8 text-xl font-serif tracking-wide">
                  <a 
                    href="#solutions" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/60 hover:text-brand-gold transition-colors"
                  >
                    Solutions Spectrum
                  </a>
                  <a 
                    href="#process" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/60 hover:text-brand-gold transition-colors"
                  >
                    Custom Blueprint Flow
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full py-4 border border-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold bg-brand-gold/5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" /> Client Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 rounded-xl"
                  >
                    Client Sign In
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onBeginProject();
                  }}
                  className="w-full py-4 bg-brand-gold text-brand-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl"
                >
                  Begin Custom Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

interface HeroProps {
  onBeginProject: () => void;
}

const Hero = ({ onBeginProject }: HeroProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover scale-[1.12]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-loop-close-up-of-electronic-24340-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/50 to-brand-bg" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-left px-6 md:px-20 w-full max-w-7xl mx-auto"
      >
        <div className="gold-line w-24 h-[2px]" />
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[clamp(4rem,10vw,8rem)] font-serif text-white leading-[0.85] mb-12 max-w-5xl font-bold tracking-tighter"
        >
          Elevate Your <br /> Business <span className="italic text-brand-gold/80">Online</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="max-w-xl text-white/70 text-lg md:text-2xl mb-16 font-light leading-relaxed tracking-wide text-balance"
        >
          We build high-converting websites that grow your brand and bring more clients.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <button 
            onClick={onBeginProject}
            className="group relative px-14 py-6 bg-brand-gold text-brand-black uppercase tracking-[0.4em] text-[10px] font-bold overflow-hidden transition-all duration-700 hover:shadow-3xl hover:shadow-brand-gold/40 cursor-none rounded-xl"
          >
            <span className="relative z-10">Get Your Website</span>
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
          </button>
          
          <a
            href="#process"
            className="group px-14 py-6 border border-white/20 text-white uppercase tracking-[0.4em] text-[10px] font-bold overflow-hidden transition-all duration-700 hover:border-brand-gold flex items-center justify-center cursor-none rounded-xl"
          >
            Our Blueprint
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-20 flex items-center gap-10"
      >
        <div className="scroll-indicator-line rotate-180 flex-row-reverse">Our Philosophy</div>
      </motion.div>
    </section>
  );
};

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
  onBeginProject: () => void;
}

const ServicesSection = ({ onSelectService, onBeginProject }: ServicesSectionProps) => {
  return (
    <section id="solutions" className="py-48 px-6 md:px-12 bg-brand-bg relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 blur-[120px] -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold mb-6 block font-bold">Strategic Capabilities</span>
            <h3 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] font-bold tracking-tighter">
              The <span className="italic text-brand-gold/40">Architectural</span> <br /> Spectrum
            </h3>
          </div>
          <button 
            onClick={onBeginProject}
            className="flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] text-brand-gold group font-bold px-6 py-3 transition-all duration-500 hover:scale-[1.05] hover:bg-brand-gold/5 rounded-full cursor-none"
          >
            All Solutions
            <div className="w-20 h-[1px] bg-brand-gold/30 relative">
              <div className="absolute top-0 left-0 h-full bg-brand-gold w-0 group-hover:w-full transition-all duration-700" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              onClick={() => onSelectService(service)}
              className={`group relative cursor-none ${
                idx % 3 === 0 ? 'md:col-span-7' : 'md:col-span-5'
              } ${idx % 2 === 1 ? 'md:mt-32' : ''}`}
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-brand-black rounded-lg border border-white/5 group-hover:border-brand-gold/25 transition-all duration-700">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover opacity-70 grayscale transition-all duration-[1.5s] ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 w-full p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">Tier: {service.price}</span>
                        <h4 className="text-3xl font-serif text-white group-hover:text-brand-gold transition-colors duration-500">{service.name}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-brand-gold/10">
                        <ArrowRight className="w-4 h-4 text-brand-gold" />
                      </div>
                   </div>
                </div>
                
                <div className="absolute top-8 left-8">
                  <span className="text-[40px] font-serif italic text-white/5 group-hover:text-brand-gold/20 transition-colors duration-700">0{idx + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const CapabilitySlideshow = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    { title: "Distributed Architecture", img: "https://images.unsplash.com/photo-1451187530230-b23b994d50c5?auto=format&fit=crop&q=80&w=1200" },
    { title: "Elite UI Performance", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200" },
    { title: "Global Commerce Scale", img: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="h-[90vh] relative overflow-hidden group">
      {/* Background pulse animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-gold/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[150px]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].img} 
            alt={slides[current].title}
            className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center max-w-4xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] uppercase tracking-[0.7em] text-brand-gold mb-8 block font-bold"
              >
                Operational Excellence
              </motion.span>
              <motion.h3 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="text-6xl md:text-9xl font-serif text-white font-bold tracking-tighter leading-none"
              >
                {slides[current].title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'italic text-white/50' : ''}>{word} </span>
                ))}
              </motion.h3>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-16 w-full flex justify-center gap-12 text-white/20">
         {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-700 cursor-none ${current === i ? 'text-brand-gold scale-125' : 'hover:text-white'}`}
            >
              0{i+1}
            </button>
         ))}
      </div>
    </section>
  );
};

interface PortfolioCTAProps {
  onBeginProject: () => void;
}

const PortfolioCTA = ({ onBeginProject }: PortfolioCTAProps) => {
  return (
    <section className="py-60 bg-brand-bg flex items-center justify-center text-center px-6 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
       <div className="max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-7xl md:text-[8rem] font-serif font-bold text-white mb-16 uppercase tracking-tighter leading-[0.8]">
              Ready to <br /> <span className="italic text-brand-gold/60">Ascend?</span>
            </h2>
            <button 
              onClick={onBeginProject}
              className="group relative text-3xl md:text-5xl font-serif italic text-white hover:text-brand-gold transition-colors duration-700 cursor-none"
            >
               Initiate Discovery
               <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
                  <div className="h-full bg-brand-gold w-0 group-hover:w-full transition-all duration-1000 ease-[0.16, 1, 0.3, 1]" />
               </div>
            </button>
          </motion.div>
       </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="py-32 bg-brand-bg border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          <div className="md:col-span-2">
            <h3 className="text-4xl font-serif font-bold mb-10 shimmer-text tracking-[0.4em] uppercase">Groven</h3>
            <p className="max-w-md text-brand-gray/50 leading-relaxed font-light text-base tracking-wide">
              Architecting the next epoch of digital performance. Our studio specializes in high-distributed ecosystems for the clandestine global enterprise.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] uppercase tracking-[0.5em] text-white font-bold mb-10">Solutions</h6>
            <ul className="flex flex-col gap-6 text-[10px] uppercase tracking-[0.4em] text-brand-gray/40">
              <li><a href="#solutions" className="hover:text-brand-gold transition-colors duration-500">Infrastructure</a></li>
              <li><a href="#solutions" className="hover:text-brand-gold transition-colors duration-500">Architecture</a></li>
              <li><a href="#solutions" className="hover:text-brand-gold transition-colors duration-500">Narratives</a></li>
              <li><a href="#solutions" className="hover:text-brand-gold transition-colors duration-500">Deployment</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-white/5">
          <span className="text-[9px] uppercase tracking-[0.5em] text-brand-gray/20">© 2026 GROVEN ARCHITECTURE GROUP. BEYOND CATEGORY.</span>
          <div className="flex gap-16 text-[9px] uppercase tracking-[0.5em] text-brand-gray/20">
             <a href="#" className="hover:text-white transition-colors">Privacy Lexicon</a>
             <a href="#" className="hover:text-white transition-colors">Digital Resilience</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal active states
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [preselectedIntake, setPreselectedIntake] = useState<{
    serviceType: string;
    extraFeaturesNotes: string;
    estimatedCost: string;
  } | null>(null);

  // Authenticate user session state on load
  useEffect(() => {
    const sessionVerification = async () => {
      try {
        const user = await dbService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Session restore failed:', err);
      }
    };
    sessionVerification();
  }, []);

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setIsDashboardOpen(true);
  };

  const handleLogout = async () => {
    try {
      await dbService.signOut();
      setCurrentUser(null);
      setIsDashboardOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleInitiateInquiryFromModal = (data: {
    serviceType: string;
    extraFeaturesNotes: string;
    estimatedCost: string;
  }) => {
    setPreselectedIntake(data);
    setActiveService(null);
    setIsIntakeOpen(true);
  };

  const handleOpenGeneralIntake = () => {
    setPreselectedIntake(null);
    setIsIntakeOpen(true);
  };

  const handleInquiryFinished = () => {
    // If user is authenticated, refresh data or open dashboard to show it!
    if (currentUser) {
      setIsDashboardOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-brand-gold/30">
      <CustomCursor />
      
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            onBeginProject={handleOpenGeneralIntake}
          />

          <main>
            <Hero onBeginProject={handleOpenGeneralIntake} />
            
            <SectionReveal>
              <ServicesSection 
                onSelectService={(service) => setActiveService(service)}
                onBeginProject={handleOpenGeneralIntake}
              />
            </SectionReveal>

            <SectionReveal>
              <ProcessSection />
            </SectionReveal>

            <SectionReveal>
              <CapabilitySlideshow />
            </SectionReveal>

            <SectionReveal>
              <PortfolioCTA onBeginProject={handleOpenGeneralIntake} />
            </SectionReveal>
          </main>

          <Footer />

          {/* Connected Dynamic Interactive Components Modals */}
          
          {/* Solution detail view & customizable pricing addon engine */}
          <ServiceModal 
            service={activeService}
            onClose={() => setActiveService(null)}
            onInitiateInquiry={handleInitiateInquiryFromModal}
          />

          {/* Secure Sign up / Log in Form */}
          <AuthModal 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />

          {/* Client Dashboard with live state progress trackers */}
          <ClientDashboard 
            isOpen={isDashboardOpen}
            onClose={() => setIsDashboardOpen(false)}
            user={currentUser}
            onLogout={handleLogout}
            onOpenIntake={handleOpenGeneralIntake}
          />

          {/* Intake portal configuration wizard */}
          <IntakeForm 
            isOpen={isIntakeOpen}
            onClose={() => setIsIntakeOpen(false)}
            preselectedData={preselectedIntake}
            onCompletion={handleInquiryFinished}
          />

        </motion.div>
      )}
    </div>
  );
}
