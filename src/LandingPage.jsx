import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Heart,
  Users,
  Briefcase,
  ChevronRight,
  Zap,
  Clock,
  Compass,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { VibeQuiz } from './components/VibeQuiz';
import { Button } from './components/ui/button';
import { ChromaKeyVideo } from './components/ChromaKeyVideo';

export const LandingPage = ({ onOpenLogin, onJoinWaitlistSubmit }) => {
  const [activeTab, setActiveTab] = useState('social');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setWaitlistStatus('loading');
    setTimeout(() => {
      setWaitlistStatus('success');
      onJoinWaitlistSubmit?.(waitlistEmail);
      setWaitlistEmail('');
    }, 1200);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const modes = {
    social: {
      title: "VAYO Social",
      badge: "Curated Meetups",
      accent: "from-rose-500 to-amber-500",
      icon: <Sparkles className="w-6 h-6 text-rose-500" />,
      tagline: "Form genuine friendships through curated offline experiences.",
      description: "Skip the awkward icebreakers and group chats. Connect at low-pressure, host-led activities like painting workshops, clay-sculpting socials, and cozy acoustic mixers. Organic, safe, and welcoming.",
      bullets: ["Host-facilitated events", "Curated group size & gender ratio", "Low-pressure, high-interaction formats"]
    },
    bff: {
      title: "VAYO BFF",
      badge: "Local Crews",
      accent: "from-violet-500 to-indigo-500",
      icon: <Users className="w-6 h-6 text-violet-500" />,
      tagline: "Build a lifetime crew around the things you love.",
      description: "Moving to a new city? Want to find your weekend trek group? VAYO BFF groups friends into local activity clubs (Trekking, Board games, Jam sessions) that meet weekly in Koramangala, Indiranagar, and Kochi.",
      bullets: ["Weekly host-led hangouts", "Vibe-matched friend squads", "Focus on screen-free, active hobbies"]
    },
    bizz: {
      title: "VAYO Bizz",
      badge: "Co-founder & Network",
      accent: "from-emerald-500 to-teal-500",
      icon: <Briefcase className="w-6 h-6 text-emerald-500" />,
      tagline: "Form professional relationships with creators & builders.",
      description: "Pitch projects, share tech insights, and meet potential co-founders and venture partners. No stuffy hotel conferences—our mixers happen at cozy local cafes and structured evening social hours.",
      bullets: ["VC & Startup Founder mixers", "Verified developer & creator directories", "Structured pitch-free networking sessions"]
    }
  };

  const testimonials = [
    {
      quote: "VAYO changed my life when I moved to Bangalore. Instead of swiping on photos, I joined a sunset hike and met my three best friends on the first day.",
      author: "Sarah Jenkins",
      role: "Product Designer, 27",
      image: "https://i.pravatar.cc/150?img=11",
      mode: "BFF Mode"
    },
    {
      quote: "I was tired of scrolling through noisy social media groups to find activities. VAYO Social's pottery mixer was the perfect way to spend a Saturday and make new friends naturally.",
      author: "Kabir Malhotra",
      role: "Software Dev, 26",
      image: "https://i.pravatar.cc/150?img=32",
      mode: "Social Mode"
    },
    {
      quote: "Found my technical co-founder at the Koramangala Founder Mixer. We started our SaaS company last year. The structured group format is brilliant.",
      author: "Elena Rostov",
      role: "Fintech Founder, 29",
      image: "https://i.pravatar.cc/150?img=45",
      mode: "Bizz Mode"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-800 font-sans overflow-hidden selection:bg-violet-200">

      {/* 1. Transparent Navigation Header (Overlay) */}
      <header className={`sticky top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50'
          : 'bg-transparent border-b-0'
        }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/vayo-logo.png" alt="VAYO" className="h-8 w-auto object-contain brightness-[0.2] hover:opacity-85 transition-opacity" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('modes')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Modes</button>
            <button onClick={() => scrollToSection('vibe-quiz')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Vibe Quiz</button>
            <button onClick={() => scrollToSection('events')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Mixers</button>
            <button onClick={() => scrollToSection('safety')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Safety</button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold tracking-wider uppercase text-slate-700 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => scrollToSection('waitlist-section')}
              className="px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-xs font-bold tracking-wider uppercase text-white shadow-md transition-all cursor-pointer"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </header>

      {/* 2. Redesigned Hero Section (Animated Hero Scene Video) */}
      <section
        className="relative z-10 bg-[#f5f4fb] w-full overflow-hidden flex flex-col items-center border-b border-gray-200 -mt-20 pt-24"
      >
        {/* Responsive wrapper: 
            On mobile (width < 640px) we set a height of 480px.
            On small tablet/phablet (width 640px to 768px) we set a height of 560px.
            On desktop/tablet (width >= 768px) we use aspect-video (16:9).
        */}
        <div className="relative w-full h-[480px] sm:h-[560px] md:h-auto md:aspect-video overflow-hidden">
          <video
            src="/Animated_hero_scene_VAYO_website_202605220210.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Overlay Pulsing Red Swipe Track at the bottom center of the video */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-[160px] h-[20px] md:w-[220px] md:h-[28px] bg-[#ef4444]/25 border border-[#ef4444]/40 rounded-full flex items-center p-1 relative shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="h-full aspect-square bg-[#ef4444] rounded-full shadow-[0_0_12px_#ef4444] animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[7px] md:text-[9px] text-white/50 font-bold uppercase tracking-widest animate-pulse">Swipe to join</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Modes Section (Light Theme Styled) */}
      <section id="modes" className="py-20 md:py-28 bg-white relative z-10 border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Layers className="w-3.5 h-3.5" /> Core Feature
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">One platform. Three separate modes.</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
              Toggle between separate profiles to connect for community events, friendships, or career growth, keeping your objectives clean and organized.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex justify-center gap-2 mt-8 p-1.5 bg-gray-100 border border-gray-200 rounded-full w-fit mx-auto">
              {Object.keys(modes).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveTab(m)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === m
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                >
                  {modes[m].title}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Feature Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center bg-gray-50 border border-gray-100 shadow-xl rounded-[32px] p-8 md:p-14 w-full"
            >
              {/* Left Column: Visual details */}
              <div className="lg:col-span-5 flex flex-col justify-center text-left">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${modes[activeTab].accent} text-white text-[10px] font-bold uppercase tracking-wider mb-4 w-fit`}>
                  {modes[activeTab].badge}
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight font-display mb-3">
                  {modes[activeTab].title}
                </h3>
                <p className="text-base text-slate-700 font-medium mb-4 leading-relaxed">
                  {modes[activeTab].tagline}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed font-light mb-6">
                  {modes[activeTab].description}
                </p>

                {/* Bullets */}
                <div className="flex flex-col gap-2.5">
                  {modes[activeTab].bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual illustration/mockup */}
              <div className="lg:col-span-7 relative h-[280px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center p-6 shadow-inner">
                {/* Simulated Mode App View */}
                <div className="w-[280px] aspect-[9/16] bg-zinc-900 border border-white/10 rounded-[28px] p-2 flex flex-col overflow-hidden shadow-2xl relative">
                  <div className="absolute top-1 right-1/2 transform translate-x-1/2 w-14 h-3 bg-black rounded-b-xl z-20" />

                  {/* Mock Navbar */}
                  <div className="h-10 flex items-center justify-between px-3 border-b border-white/5 bg-zinc-950/80">
                    <span className="text-[10px] font-black text-white/40 font-mono tracking-widest">VAYO</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${modes[activeTab].accent} text-white`}>
                      {activeTab.toUpperCase()}
                    </span>
                  </div>

                  {/* Mock Profile Card */}
                  <div className="flex-1 p-2 flex flex-col gap-2 relative bg-zinc-950">
                    {/* Dummy image matching mode */}
                    <div className="w-full h-2/3 rounded-xl overflow-hidden relative">
                      <img
                        src={
                          activeTab === 'social'
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                            : activeTab === 'bff'
                              ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300"
                              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
                        }
                        className="w-full h-full object-cover"
                        alt="mock-profile"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    </div>

                    {/* Profile text */}
                    <div className="px-1 text-left">
                      <h4 className="text-xs font-bold text-white">
                        {activeTab === 'social' ? 'Tanya, 25' : activeTab === 'bff' ? 'Aarav, 26' : 'Meera, 24'}
                      </h4>
                      <p className="text-[8px] text-white/50 font-light truncate mt-0.5">
                        {activeTab === 'social' ? 'AI Dev & Musician • Koramangala' : activeTab === 'bff' ? 'UX Researcher • Indiranagar' : 'Fintech Co-founder • Kochi'}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                          {activeTab === 'social' ? '#Acoustic' : activeTab === 'bff' ? '#Trekking' : '#Founder'}
                        </span>
                        <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                          {activeTab === 'social' ? '#Cafes' : activeTab === 'bff' ? '#Indie' : '#Scaleup'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>


      {/* 5. Vibe Quiz Section */}
      <section id="vibe-quiz" className="py-20 md:py-28 bg-gray-50 border-y border-gray-100 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5" /> Stop Swiping, Start Vibe-Checking
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">Find Your Community</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
              Answer three quick questions to reveal your primary community style, matched VAYO offline events, and active members who share your frequency.
            </p>
          </div>

          {/* Quiz Container */}
          <VibeQuiz onJoinWaitlist={() => scrollToSection('waitlist-section')} />
        </div>
      </section>

      {/* 6. Upcoming Events Showcase (Light Theme Styled) */}
      <section id="events" className="py-20 md:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Calendar className="w-3.5 h-3.5" /> Offline Commune
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">Featured VAYO Mixers</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
              VAYO events are organized weekly at curated local spaces. Entry spots are limited to ensure safe ratios and premium networking.
            </p>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="group border border-gray-100 hover:border-gray-200 bg-white rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <div className="relative overflow-hidden rounded-[24px] aspect-video border border-gray-100 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Rooftop Mixer"
                />
                <span className="absolute top-4 left-4 text-[10px] font-bold bg-violet-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Social Gathering
                </span>
              </div>
              <div className="text-left flex flex-col gap-2">
                <h4 className="text-xl font-bold font-display text-slate-900">Sunset Rooftop Social</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" /> Koramangala Skyline, BLR
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                  Meet creators and active professionals, and enjoy curated mocktails and deep house beats during sunset.
                </p>

                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Registered: <strong className="text-slate-800">124</strong>/200</span>
                  <span className="text-violet-600 font-extrabold text-sm">₹899</span>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="group border border-gray-100 hover:border-gray-200 bg-white rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <div className="relative overflow-hidden rounded-[24px] aspect-video border border-gray-100 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Founder Mixer"
                />
                <span className="absolute top-4 left-4 text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Networking Meetup
                </span>
              </div>
              <div className="text-left flex flex-col gap-2">
                <h4 className="text-xl font-bold font-display text-slate-900">Tech & VC Founder Mixer</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> HSR Lounge Hub, BLR
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                  Connect with startup founders, technical advisors, and venture funds. Finger food and mocktails included.
                </p>

                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Registered: <strong className="text-slate-800">88</strong>/120</span>
                  <span className="text-emerald-600 font-extrabold text-sm">₹1,499</span>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="group border border-gray-100 hover:border-gray-200 bg-white rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <div className="relative overflow-hidden rounded-[24px] aspect-video border border-gray-100 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Acoustic live"
                />
                <span className="absolute top-4 left-4 text-[10px] font-bold bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live Music Night
                </span>
              </div>
              <div className="text-left flex flex-col gap-2">
                <h4 className="text-xl font-bold font-display text-slate-900">Acoustic Indie Session</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> Panampilly Nagar, Kochi
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                  An intimate evening showcasing local singer-songwriters. Cozy floor seating and filter coffee provided.
                </p>

                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Registered: <strong className="text-slate-800">42</strong>/60</span>
                  <span className="text-amber-500 font-extrabold text-sm">₹499</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Success Stories Testimonials (Light Theme Styled) */}
      <section className="py-20 md:py-28 bg-gray-50 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">True stories from our commune.</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
              Discover how our verified members found friendship, community connection, and professional partners at VAYO offline activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="border border-gray-100 bg-white p-8 rounded-[30px] flex flex-col justify-between items-start text-left relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-current" />
                  ))}
                </div>

                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic mb-8 font-light">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-gray-100 w-full">
                  <img src={t.image} className="w-10 h-10 rounded-xl object-cover border border-gray-100" alt={t.author} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{t.author}</h5>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-full">
                    {t.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Safety & Trust (The Bumble Difference for Vayo) */}
      <section id="safety" className="py-20 md:py-28 relative z-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Graphics */}
            <div className="lg:col-span-5 relative h-[300px] md:h-[400px] border border-emerald-100 bg-white/70 backdrop-blur-xl rounded-[32px] flex items-center justify-center p-6 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.12),0_15px_30px_-10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_60px_-10px_rgba(16,185,129,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/8 to-teal-500/4 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/4 to-teal-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col gap-6 text-center max-w-sm relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 animate-pulse-slow">
                  <Shield className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">Safety is Our First Priority</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    VAYO implements rigid verification checkups for every member to guarantee a zero-harassment, premium offline experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Bullet List */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
                <Shield className="w-3.5 h-3.5" /> Vayo Safety Protocols
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-6">Connect Safely. <br />No Surprises.</h2>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Host-Verified Group Events Only</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-0.5">Every single activity is managed by a trained VAYO Commune Host who maintains boundaries and safety guidelines, preventing uncomfortable situations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Selfie & Identity Verification</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-0.5">We enforce photo checks. Users who do not verify their identities cannot reserve spots or swipe on members in the hive.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Zero Tolerance Community Ban</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mt-0.5">Any breach of mutual respect results in immediate and permanent account suspension. VAYO is a sanctuary of belonging.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Final Call to Action & Waitlist (Light Theme Styled) */}
      <section id="waitlist-section" className="py-24 md:py-32 relative z-10 border-t border-gray-100 bg-[#eef1f6]">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-900 mb-6">
            Ready to find your vibe?
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed mb-10 font-light">
            Spots for our local Indiranagar, Koramangala, and Kochi weekly events fill up extremely fast. Enter your email below to join the priority waitlist.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-1.5 bg-white border border-gray-200 rounded-2xl md:rounded-full shadow-lg">
              <input
                type="email"
                placeholder="Enter your email address"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="w-full bg-transparent px-5 py-3.5 text-sm focus:outline-none placeholder:text-gray-400 text-slate-800 rounded-full text-center sm:text-left font-medium"
                disabled={waitlistStatus === 'success'}
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl md:rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer active:scale-95 duration-100"
                disabled={waitlistStatus === 'success'}
              >
                {waitlistStatus === 'loading' ? 'Joining...' : waitlistStatus === 'success' ? 'Joined!' : 'Join Waitlist'}
              </button>
            </div>

            {/* Waitlist Success Message */}
            <AnimatePresence>
              {waitlistStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-600 text-xs font-bold font-mono tracking-wider mt-4"
                >
                  🎉 Welcome aboard! We've saved your spot and will contact you shortly.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* 10. Footer (Dark slate themed for grounding) */}
      <footer className="relative z-10 bg-[#0f172a] border-t border-slate-900 py-14 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo and Description */}
          <div className="text-center md:text-left max-w-sm">
            <img src="/vayo-logo.png" alt="VAYO Logo" className="h-7 w-auto object-contain brightness-110 mb-4 mx-auto md:mx-0" />
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Vayo Commune is a community-driven social platform and offline community that helps people meet others through real-life activities, hobbies, and shared experiences in Bangalore & Kerala.
            </p>
          </div>

          {/* Contact Details & Links */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h5>
            <p className="text-xs text-slate-400">
              Operational Office: Koramangala 8th Block, Bangalore, India
            </p>
            <p className="text-xs text-slate-400">
              Email: <a href="mailto:vayocommune@gmail.com" className="text-violet-400 hover:underline">vayocommune@gmail.com</a>
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-2">
              <a href="https://www.youtube.com/@vayobangalore" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Youtube">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://www.instagram.com/vayo.bangalore/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/vayo-commune/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>&copy; 2026 VAYO. Powered by <a href="https://www.laneway.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">Laneway</a>. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Community Guidelines</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
