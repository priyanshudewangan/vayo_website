import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Dashboard from './Dashboard';
import { LandingPage } from './LandingPage';
import { Modal } from '@/components/ui/modal';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

const GlassInputWrapper = ({ children }) => (
  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md transition-all focus-within:border-violet-400/50 focus-within:bg-white/10">
    {children}
  </div>
);

const App = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  onSignIn = (e) => e.preventDefault(),
  onGoogleSignIn = () => {},
  onResetPassword = () => {},
  onCreateAccount = () => {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('landing'); // Start on landing page
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSignIn?.(e);
    setIsLoginModalOpen(false);
    setView('dashboard');
  };

  const handleDemoLogin = () => {
    setIsLoginModalOpen(false);
    setView('dashboard');
  };

  const handleGoogleSignIn = () => {
    onGoogleSignIn?.();
    setIsLoginModalOpen(false);
    setView('dashboard');
  };

  // Route/View Selector
  if (view === 'dashboard') {
    return <Dashboard onLogout={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen relative w-full font-sans bg-[#030712] text-foreground">
      {/* Landing Page */}
      <LandingPage
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onJoinWaitlistSubmit={(email) => console.log('Joined waitlist:', email)}
      />

      {/* Reusable Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="flex flex-col gap-5 text-left">
          {/* Logo container */}
          <div className="mb-1">
            <img src="/vayo-logo.png" alt="VAYO" className="h-7 w-auto object-contain brightness-110 drop-shadow-sm" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-display text-white leading-tight">{title}</h1>
            <p className="text-xs text-white/50 mt-1 font-light">{description}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/60">Email Address</label>
              <GlassInputWrapper>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-white/30 text-white"
                  required
                />
              </GlassInputWrapper>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/60">Password</label>
              <GlassInputWrapper>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-white/30 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </GlassInputWrapper>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                <span className="text-white/80">Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => onResetPassword?.()}
                className="hover:underline text-violet-400 transition-colors cursor-pointer"
              >
                Reset password
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5 mt-2">
              <button
                type="submit"
                className="w-full rounded-2xl bg-white py-3.5 font-bold text-xs uppercase tracking-wider text-zinc-950 hover:bg-white/95 transition-all cursor-pointer shadow-lg shadow-black/20"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full rounded-2xl bg-violet-600/25 border border-violet-500/30 hover:bg-violet-600/35 hover:border-violet-500/50 py-3.5 font-bold text-xs uppercase tracking-wider text-violet-200 transition-all cursor-pointer shadow-lg"
              >
                Demo Login (Quick Access)
              </button>
            </div>
          </form>

          <div className="relative flex items-center justify-center py-1.5">
            <span className="w-full border-t border-white/10"></span>
            <span className="px-3 text-[10px] text-white/40 bg-zinc-950 border border-white/10 rounded-full py-0.5 absolute">Or continue with</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 border border-white/10 bg-white/5 rounded-2xl py-3 hover:bg-white/10 transition-colors font-medium text-xs text-white cursor-pointer"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-xs text-white/55 mt-2">
            New to our platform?{' '}
            <button
              type="button"
              onClick={() => onCreateAccount?.()}
              className="text-violet-400 hover:underline transition-colors font-semibold cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default App;
