import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-white/5 hover:bg-white/10 border border-white/10 text-white shadow-lg shadow-black/20 px-6 py-3 cursor-pointer duration-200 active:scale-97 backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";
