import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Zap,
  MessageSquare,
  Users,
  User,
  Compass,
  Settings,
  LogOut,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  CircleDollarSign,
  Camera,
  Award,
  ImageIcon,
  MapPin,
  Pencil,
  Link as LinkIcon
} from 'lucide-react';

function getRandomNumberInRange(min, max) {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

// Countdown Custom Hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        remaining = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Countdown Timer Component
const EventTimer = ({ targetDate }) => {
  const timeLeft = useCountdown(targetDate);
  const pad = (num) => String(num).padStart(2, '0');
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <span className="text-red-400 text-xs font-semibold uppercase tracking-wider bg-red-950/30 border border-red-500/20 px-2 py-0.5 rounded-full">
        Closed
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm font-mono text-amber-300 font-semibold bg-amber-950/30 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
      <span>{pad(timeLeft.days)}d</span>:
      <span>{pad(timeLeft.hours)}h</span>:
      <span>{pad(timeLeft.minutes)}m</span>:
      <span>{pad(timeLeft.seconds)}s</span>
    </div>
  );
};

// Photo Gallery Components
export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  onTap,
  ...props
}) => {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [direction]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      onTap={onTap}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.15, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.08,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
        willChange: "transform",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm border border-white/5 bg-white/5">
        <motion.img
          className={cn("rounded-3xl object-cover w-full h-full")}
          src={src}
          alt={alt}
          draggable={false}
          {...props}
        />
      </div>
    </motion.div>
  );
};

export const PhotoGallery = ({ animationDelay = 0.5 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    );

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  const photos = [
    {
      id: 1,
      order: 0,
      x: "-240px",
      y: "15px",
      zIndex: 40,
      direction: "left",
      src: "/img1.png",
      alt: "Hiking path and ruins at sunset",
      location: "Yosemite Trails, CA",
      caption: "An unforgettable sunset hike passing through beautiful wilderness trails and rock arches."
    },
    {
      id: 2,
      order: 1,
      x: "-80px",
      y: "32px",
      zIndex: 30,
      direction: "left",
      src: "/img2.png",
      alt: "Scenic lake during winter",
      location: "Lake Louise, Canada",
      caption: "Stunning frozen lakeside panorama on a peaceful, crystal-clear winter morning."
    },
    {
      id: 3,
      order: 2,
      x: "80px",
      y: "12px",
      zIndex: 20,
      direction: "right",
      src: "/img3.png",
      alt: "Heart lights indoor profile portrait",
      location: "Downtown Studio, SF",
      caption: "Playing around with heart-shaped bokeh and warm neon glow filters during our indoor portrait session."
    },
    {
      id: 4,
      order: 3,
      x: "240px",
      y: "28px",
      zIndex: 10,
      direction: "right",
      src: "/img4.png",
      alt: "Climbing mountaintop with misty sky",
      location: "Mount Tamalpais, CA",
      caption: "Watching the thick fog and clouds roll beneath the mountaintop ridge just after sunrise."
    },
  ];

  return (
    <div className="mt-12 relative">
      <div className="absolute inset-0 max-md:hidden top-[100px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>
      <p className="lg:text-md my-2 text-center text-xs font-light uppercase tracking-widest text-white/50">
        A Journey Through Visual Stories
      </p>
      <h3 className="z-20 mx-auto max-w-2xl justify-center bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text py-3 text-center text-4xl text-transparent font-semibold md:text-7xl leading-tight">
        Welcome to My <span className="text-rose-500"> Stories</span>
      </h3>
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                    onTap={() => setSelectedPhoto(photo)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="flex w-full justify-center">
        <Button>
          View All Stories
        </Button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-black/60 border border-white/10 rounded-[32px] p-4 shadow-2xl backdrop-blur-2xl flex flex-col items-center cursor-default"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full aspect-square overflow-hidden rounded-[24px] mb-5 border border-white/5 select-none">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              <div className="text-center px-4 pb-2 max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
                  📍 {selectedPhoto.location}
                </span>
                <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Repurposed Circular Slider for Events
export const CircularEvents = () => {
  const events = [
    {
      id: 1,
      title: "Sunset Rooftop Social",
      category: "Social Gathering",
      description: "Join the most exclusive rooftop social of the season. Watch the sunset over the skyline, meet creators and professionals, and enjoy curated mocktails and deep house beats.",
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600",
      cost: 899,
      registered: 124,
      maxCapacity: 200,
      targetDate: "2026-05-28T18:00:00"
    },
    {
      id: 2,
      title: "Tech & VC Founder Mixer",
      category: "Networking Meetup",
      description: "Pitch ideas, share insights, and connect with top founders and venture investors in the Bay Area startup ecosystem. Finger foods and craft beverages included.",
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
      cost: 1499,
      registered: 88,
      maxCapacity: 120,
      targetDate: "2026-06-02T19:00:00"
    },
    {
      id: 3,
      title: "Acoustic Indie Session",
      category: "Live Music Night",
      description: "An intimate evening showcasing local singer-songwriters and indie bands. Unwind with acoustic sets, ambient lighting, and cozy lounge seating. Includes one welcome drink.",
      src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600",
      cost: 499,
      registered: 42,
      maxCapacity: 60,
      targetDate: "2026-05-25T20:00:00"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const eventsLength = events.length;
  const activeEvent = events[activeIndex];

  // Width tracker
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % eventsLength);
  };
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + eventsLength) % eventsLength);
  };

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.4;
    const offset = (index - activeIndex + eventsLength) % eventsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + eventsLength) % eventsLength === index;
    const isRight = (activeIndex + 1) % eventsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.6,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.8) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.6,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.8) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(0px) scale(0.5)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 mt-8">
      <div className="text-center mb-10">
        <p className="text-rose-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Exclusive Gatherings</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Upcoming Events</h2>
        {/* View All / Back toggle */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-sm font-medium backdrop-blur-xl transition-all duration-200 cursor-pointer active:scale-95"
        >
          {showAll ? (
            <>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Showcase
            </>
          ) : (
            <>
              View All Events
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showAll ? (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center border border-white/15 bg-white/[0.04] backdrop-blur-3xl backdrop-saturate-[1.6] p-8 md:p-14 rounded-[40px] shadow-[0_32px_60px_-15px_rgba(0,0,0,0.6)]">
              {/* Carousel Slider Images */}
              <div className="lg:col-span-6 relative w-full h-[280px] md:h-[400px] flex items-center justify-center overflow-visible" ref={imageContainerRef}>
                {events.map((event, index) => (
                  <img
                    key={event.id}
                    src={event.src}
                    alt={event.title}
                    style={getImageStyle(index)}
                    className="absolute w-[210px] md:w-[300px] h-[260px] md:h-[370px] object-cover rounded-[32px] shadow-2xl border border-white/20 select-none pointer-events-none"
                  />
                ))}
              </div>

              {/* Selected Event Details */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full mb-1">
                        {activeEvent.category}
                      </span>
                      <h3 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight mt-0.5 leading-tight">
                        {activeEvent.title}
                      </h3>
                    </div>

                    {/* Timer, attendees, and cost info */}
                    <div className="flex flex-col gap-3 py-3 border-y border-white/10">
                      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                        <span className="text-white/50 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-violet-400" />
                          Register Countdown:
                        </span>
                        <EventTimer targetDate={activeEvent.targetDate} />
                      </div>

                      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                        <span className="text-white/50 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-violet-400" />
                          People Registered:
                        </span>
                        <div className="flex items-center gap-1.5 font-medium text-white/90">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{activeEvent.registered} attending</span>
                          <span className="text-white/40">/ {activeEvent.maxCapacity} max</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                        <span className="text-white/50 flex items-center gap-1.5">
                          <CircleDollarSign className="w-4 h-4 text-violet-400" />
                          Entry Cost:
                        </span>
                        <span className="font-extrabold text-violet-300 text-lg">
                          ₹{activeEvent.cost} <span className="text-xs text-white/50 font-normal font-sans">(includes tax)</span>
                        </span>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-white/70 text-sm md:text-base leading-relaxed font-normal">
                      {activeEvent.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls and Call-to-action */}
                <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-white/5 flex-wrap">
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 text-white/70 hover:text-violet-300"
                      aria-label="Previous event"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 text-white/70 hover:text-violet-300"
                      aria-label="Next event"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <Button className="py-2.5 px-7 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/35 text-white font-bold tracking-wide shadow-lg hover:shadow-xl backdrop-blur-xl active:scale-95 duration-200 transition-all">
                    Reserve Spot
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ===== VIEW ALL EVENTS - Scrollable List ===== */
          <motion.div
            key="allEvents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center border border-white/15 bg-white/[0.04] backdrop-blur-3xl backdrop-saturate-[1.6] p-6 md:p-10 rounded-[32px] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]"
              >
                {/* Event Image */}
                <div className="md:col-span-4 relative overflow-hidden rounded-[24px]">
                  <img
                    src={event.src}
                    alt={event.title}
                    className="w-full h-[220px] md:h-[260px] object-cover rounded-[24px] border border-white/10 select-none"
                  />
                </div>

                {/* Event Details */}
                <div className="md:col-span-8 flex flex-col gap-4">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full mb-1.5">
                      {event.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2.5 py-3 border-y border-white/10">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-white/50 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-violet-400" />
                        Countdown:
                      </span>
                      <EventTimer targetDate={event.targetDate} />
                    </div>
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-white/50 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-violet-400" />
                        Registered:
                      </span>
                      <div className="flex items-center gap-1.5 font-medium text-white/90">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{event.registered} attending</span>
                        <span className="text-white/40">/ {event.maxCapacity} max</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-white/50 flex items-center gap-1.5">
                        <CircleDollarSign className="w-4 h-4 text-violet-400" />
                        Cost:
                      </span>
                      <span className="font-extrabold text-violet-300 text-lg">
                        ₹{event.cost} <span className="text-xs text-white/50 font-normal">(incl. tax)</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex justify-end pt-1">
                    <Button className="py-2 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/35 text-white font-bold tracking-wide shadow-lg hover:shadow-xl backdrop-blur-xl active:scale-95 duration-200 transition-all text-sm">
                      Reserve Spot
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== PROFILE VIEW ====================

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration / end) * 1000;
    if (end === 0) { setCount(0); return; }
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime / 40);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
};

const ProfileBadge = ({ label, variant }) => {
  const styles = {
    violet: "text-violet-400 bg-violet-950/30 border-violet-900/30",
    amber: "text-amber-400 bg-amber-950/30 border-amber-900/30",
    default: "text-zinc-400 bg-zinc-900/30 border-zinc-800/80"
  };
  const badgeStyle = styles[variant] || styles.default;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider border ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

const EventTimelineItem = ({ event, index, total }) => (
  <div className="group relative flex gap-4">
    {/* Timeline Point & Vertical Line */}
    <div className="flex flex-col items-center">
      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-950 z-10 mt-1.5 transition-colors group-hover:bg-zinc-400" />
      {index < total - 1 && <div className="w-[1px] flex-1 bg-zinc-800" />}
    </div>
    
    {/* Clean Activity Description */}
    <div className="flex-1 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-zinc-100">{event.title}</h4>
          <p className="text-xs text-zinc-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>{event.category}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>with {event.friends} friends</span>
          </p>
        </div>
        <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">{event.date}</span>
      </div>
    </div>
  </div>
);

const MomentCard = ({ img }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 aspect-video bg-zinc-950">
      <img
        src={img.src}
        alt={img.caption}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-103 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-zinc-200 transform translate-y-0.5 -translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300" />
        </div>
      </div>
    </div>
    <div className="mt-2 px-1">
      <p className="text-xs font-medium text-zinc-300 group-hover:text-zinc-200 transition-colors">{img.caption}</p>
      <p className="text-[10px] text-zinc-500 mt-0.5">{img.location}</p>
    </div>
  </div>
);

const ProfileView = () => {
  const user = {
    name: "Sam Geller",
    handle: "@samgeller",
    bio: "Explorer of hidden trails, collector of sunsets, and lover of spontaneous adventures. Always chasing the next story worth telling.",
    location: "San Francisco, CA",
    joinedDate: "January 2025",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    karma: 340,
    eventsAttended: 12,
    imagesUploaded: 4,
  };

  const uploadedImages = [
    { id: 1, src: "/img1.png", caption: "Yosemite sunset hike", location: "Yosemite, CA" },
    { id: 2, src: "/img2.png", caption: "Frozen lake morning", location: "Lake Louise" },
    { id: 3, src: "/img3.png", caption: "Studio portrait session", location: "SF Studio" },
    { id: 4, src: "/img4.png", caption: "Mountaintop sunrise", location: "Mt. Tamalpais" },
  ];

  const recentEvents = [
    { id: 1, title: "Sunset Rooftop Social", category: "Social Gathering", date: "May 10, 2026", friends: 4 },
    { id: 2, title: "Indie Music Live Session", category: "Live Music", date: "Apr 28, 2026", friends: 2 },
    { id: 3, title: "Tech & VC Founder Mixer", category: "Networking", date: "Apr 15, 2026", friends: 6 },
  ];

  const stats = [
    { label: "Events", value: user.eventsAttended, icon: Calendar },
    { label: "Karma", value: user.karma, icon: Award },
    { label: "Moments", value: user.imagesUploaded, icon: ImageIcon },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-20">
      {/* ====== COVER + HEADER ====== */}
      <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/20 overflow-hidden backdrop-blur-md">
        {/* Cover Image */}
        <div className="relative h-32 md:h-44 overflow-hidden border-b border-zinc-800/80">
          <img src={user.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        {/* Profile Info Grid */}
        <div className="relative px-6 pb-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-zinc-950 bg-zinc-900 shadow-2xl">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer shadow-lg active:scale-90">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">{user.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <ProfileBadge label="Pro Member" variant="violet" />
                  <ProfileBadge label="Top 5%" variant="amber" />
                </div>
              </div>
              <p className="text-zinc-500 text-xs font-medium mb-3">{user.handle}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-zinc-500" />{user.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-zinc-500" />Joined {user.joinedDate}</span>
                <a href="https://vayo.me/sam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors"><LinkIcon className="w-3.5 h-3.5 text-zinc-500" />vayo.me/sam</a>
              </div>
            </div>

            {/* Edit Button */}
            <div className="sm:mb-1">
              <button className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer active:scale-97">
                <Pencil className="w-3.5 h-3.5 text-zinc-400" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MAIN CONTENT GRID ====== */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Identity + Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Bio Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-5 backdrop-blur-md">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">About Me</h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              {user.bio}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/20 hover:bg-zinc-900/30 transition-all text-center backdrop-blur-md"
                >
                  <StatIcon className="w-4 h-4 text-zinc-500 mb-1.5" />
                  <div className="text-base font-semibold text-zinc-100">
                    {stat.label === "Karma" ? user.karma : <AnimatedCounter value={stat.value} />}
                  </div>
                  <div className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                  
                  {stat.label === "Karma" && (
                    <div className="mt-2 w-full bg-zinc-800/50 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(user.karma / 500) * 100}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-5 backdrop-blur-md">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Achievements</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "🔥", label: "Streak" },
                { icon: "📸", label: "Artist" },
                { icon: "🎉", label: "Social" },
                { icon: "⭐", label: "Rated" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-zinc-800/60 bg-zinc-900/5 hover:bg-zinc-900/15 transition-all cursor-default"
                  title={badge.label}
                >
                  <span className="text-xl" role="img" aria-label={badge.label}>{badge.icon}</span>
                  <span className="text-[9px] text-zinc-500 font-medium mt-1">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Moments Grid */}
          <section className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Captured Moments</h3>
              </div>
              <button className="text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors font-medium">View Gallery</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((img) => (
                <MomentCard key={img.id} img={img} />
              ))}
              <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/5 hover:bg-zinc-900/10 transition-all cursor-pointer group aspect-video min-h-[120px]">
                <Camera className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors mb-1.5" />
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium uppercase tracking-wider">Add Moment</span>
              </div>
            </div>
          </section>

          {/* Events Activity */}
          <section className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Recent Activity</h3>
              </div>
              <button className="text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors font-medium">See All</button>
            </div>
            
            <div className="space-y-1">
              {recentEvents.map((event, index) => (
                <EventTimelineItem key={event.id} event={event} index={index} total={recentEvents.length} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [karma] = useState(340);

  return (
    <div className="min-h-screen relative w-full font-sans bg-[#030712] text-foreground overflow-x-hidden pt-24 pb-12">
      {/* ===== Background Layer ===== */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#030712]">
        {/* Dashboard Glow */}
        <div
          className={cn(
            "absolute inset-0 bg-dashboard-ambient transition-opacity duration-1000 ease-in-out",
            activeTab === 'Dashboard' ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Events Glow */}
        <div
          className={cn(
            "absolute inset-0 bg-events-ambient transition-opacity duration-1000 ease-in-out",
            activeTab === 'Events' ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Messages Glow */}
        <div
          className={cn(
            "absolute inset-0 bg-messages-ambient transition-opacity duration-1000 ease-in-out",
            activeTab === 'Messages' ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Profile Glow */}
        <div
          className={cn(
            "absolute inset-0 profile-dawn-bg transition-opacity duration-1000 ease-in-out",
            activeTab === 'Profile' ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Shared fine texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.008] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Navigation Bar (Glassmorphic design matching screenshot) */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-6xl z-50 flex items-center justify-between border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full shadow-2xl">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 border border-white/5 rounded-full py-1.5 px-4 bg-white/5">
          <img src="/vayo-logo.png" alt="VAYO" className="h-6 w-auto object-contain brightness-110" />
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 border border-white/5 rounded-full p-1 bg-white/5">
          {[
            { name: 'Dashboard', icon: LayoutGrid },
            { name: 'Events', icon: Zap },
            { name: 'Messages', icon: MessageSquare },
            { name: 'Profile', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-2 py-1.5 px-4 rounded-full transition-all duration-200 relative cursor-pointer ${isActive ? 'text-white font-medium bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-violet-400/40 rounded-full blur-[0.5px] animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: User Information and Actions */}
        <div className="flex items-center gap-3 border border-white/5 rounded-full py-1 px-1 bg-white/5 pl-4 relative">
          <div className="flex items-center gap-1.5 text-violet-300 font-medium text-sm pr-1">
            <Compass className="w-4 h-4 text-violet-400 animate-spin-slow" />
            <span>{karma} Karma</span>
          </div>

          {/* Profile Dropdown Trigger */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 hover:text-violet-200 transition-all flex items-center justify-center text-xs font-bold font-sans cursor-pointer relative shadow-md shadow-violet-500/10"
          >
            SG
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 mt-2 w-48 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-2 shadow-2xl z-50 flex flex-col gap-1">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs text-white/40">Signed in as</p>
                <p className="text-sm font-semibold text-white">Sam Geller</p>
              </div>
              <button className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer text-left w-full">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors cursor-pointer text-left w-full"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 mt-6">
        {activeTab === 'Dashboard' && <PhotoGallery />}
        {activeTab === 'Events' && <CircularEvents />}
        {activeTab === 'Profile' && <ProfileView />}
        {activeTab !== 'Dashboard' && activeTab !== 'Events' && activeTab !== 'Profile' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-white/5 bg-black/45 backdrop-blur-2xl rounded-3xl p-8">
            <p className="text-white/40 text-sm font-semibold uppercase tracking-wider mb-2">{activeTab}</p>
            <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-white/60 text-sm text-center max-w-md">This view is currently in development. Check back later for updates!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
