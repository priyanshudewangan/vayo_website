import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "What is your idea of a perfect weekend evening?",
    options: [
      { text: "Dancing to deep house beats on a glowing rooftop", value: "social" },
      { text: "Unwinding with filter coffee and intimate live acoustic sets", value: "acoustic" },
      { text: "Sitting by a campfire after a tiring wilderness hike", value: "outdoor" },
      { text: "Exchanging startup ideas over craft beers with builders", value: "tech" }
    ]
  },
  {
    id: 2,
    question: "Who do you naturally find yourself connecting with?",
    options: [
      { text: "Creatives, musicians, and free-spirited artists", value: "creative" },
      { text: "Founders, designers, and tech enthusiasts", value: "tech" },
      { text: "Hikers, backpackers, and sports lovers", value: "outdoor" },
      { text: "Lounge conversation lovers and board game enthusiasts", value: "acoustic" }
    ]
  },
  {
    id: 3,
    question: "What are you primarily looking for on VAYO?",
    options: [
      { text: "A curated event to meet new people offline (Social Mode)", value: "social_mode" },
      { text: "A crew to hang out with and do hobbies together (BFF Mode)", value: "bff" },
      { text: "Co-founders, investors, and career networks (Bizz Mode)", value: "bizz" },
      { text: "Just general belonging & meeting amazing humans (All)", value: "all" }
    ]
  }
];

const RESULTS_MAP = {
  social: {
    title: "Vibrantly Social",
    desc: "You thrive in high-energy, vibrant gatherings where music, conversation, and mood align. You love making memories on rooftops or underground clubs.",
    event: "Sunset Rooftop Social",
    eventDesc: "A high-fidelity social gathering featuring curated mocktails and deep house beats.",
    members: [
      { name: "Tanya Sharma", role: "AI Dev & DJ", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
      { name: "Mike T.", role: "Motion Designer", image: "https://i.pravatar.cc/150?img=32" }
    ]
  },
  acoustic: {
    title: "Cozy & Conversational",
    desc: "You appreciate intimate spaces, cozy acoustics, and deep, low-pressure conversations. You connect best when the lights are low and the lyrics are real.",
    event: "Acoustic Indie Session",
    eventDesc: "An intimate night showcasing local singer-songwriters with warm lounge seating.",
    members: [
      { name: "Rohan Das", role: "Indie Singer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
      { name: "Sarah J.", role: "Journalist", image: "https://i.pravatar.cc/150?img=11" }
    ]
  },
  outdoor: {
    title: "Spontaneous Adventurer",
    desc: "You belong in the wild, scaling ridges or swapping tales under starlit skies. You value friendships forged over shared physical struggles and scenic rewards.",
    event: "Yosemite Ridge Hike",
    eventDesc: "A weekend trip exploring forest trails and camping under a clear night sky.",
    members: [
      { name: "Aarav Mehta", role: "Trek Leader", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
      { name: "Elena R.", role: "Travel Blogger", image: "https://i.pravatar.cc/150?img=45" }
    ]
  },
  tech: {
    title: "Future Architect",
    desc: "You get excited about ideas, innovation, and finding new ways to solve hard problems. You look for partners in crime to build, scale, and fund the next big things.",
    event: "Tech & VC Founder Mixer",
    eventDesc: "An exclusive networking mixer with investors and Silicon Valley founders.",
    members: [
      { name: "Meera Nair", role: "Fintech Founder", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
      { name: "Alex K.", role: "Venture Partner", image: "https://i.pravatar.cc/150?img=12" }
    ]
  }
};

export const VibeQuiz = ({ onJoinWaitlist }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectOption = (value) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
  };

  // Determine result based on primary choices (fallback to 'social')
  const getResult = () => {
    const counts = answers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    
    // Find the most selected value
    let primaryVibe = answers[0] || 'social';
    let max = 0;
    
    Object.entries(counts).forEach(([key, val]) => {
      // Map result value to one of the 4 key categories
      if (['social_mode', 'bff', 'bizz', 'all'].includes(key)) return; // skip target modes
      if (val > max) {
        max = val;
        primaryVibe = key;
      }
    });

    // Make sure we resolve to a valid RESULTS_MAP key
    if (!RESULTS_MAP[primaryVibe]) {
      primaryVibe = 'social';
    }
    return RESULTS_MAP[primaryVibe];
  };

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto border border-white/10 bg-black/40 backdrop-blur-2xl p-6 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase mb-4">
              <span>Vibe Check</span>
              <span>Step {currentStep + 1} of {QUESTIONS.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
              <motion.div
                className="h-full bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-xl md:text-2xl font-bold font-display text-white mb-6 md:mb-8 leading-tight text-center">
              {currentQuestion.question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3.5">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.value)}
                  className="w-full text-left p-4.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/40 text-sm md:text-base text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] duration-150"
                >
                  <span>{opt.text}</span>
                  <div className="w-6 h-6 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Results Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center"
          >
            {/* Vibe badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">
              ✨ Match Result
            </div>

            {/* Title */}
            <h4 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight leading-none mb-3">
              {getResult().title}
            </h4>
            
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 font-normal">
              {getResult().desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              {/* Recommended Event */}
              <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Recommended Event
                  </span>
                  <h5 className="text-base font-bold text-white leading-tight">{getResult().event}</h5>
                  <p className="text-xs text-white/50 mt-1 leading-normal">{getResult().eventDesc}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span>Guaranteed entry spot</span>
                  <ShieldCheck className="w-4 h-4 fill-emerald-400/10" />
                </div>
              </div>

              {/* Matched Members */}
              <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1 mb-3.5">
                  <Users className="w-3.5 h-3.5" /> Shared Vibe Members
                </span>
                <div className="flex flex-col gap-3">
                  {getResult().members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={member.image} className="w-9 h-9 rounded-xl object-cover border border-white/10" alt={member.name} />
                      <div>
                        <h6 className="text-xs font-bold text-white">{member.name}</h6>
                        <p className="text-[10px] text-white/40">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              
              <button
                onClick={() => onJoinWaitlist?.()}
                className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-97 transition-all cursor-pointer"
              >
                Join Waitlist to Match
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
