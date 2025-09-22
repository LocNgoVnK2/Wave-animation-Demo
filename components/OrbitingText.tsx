import React, { forwardRef } from 'react';

interface OrbitingTextProps {
  isMotionReduced: boolean;
}

export const OrbitingText = forwardRef<HTMLDivElement, OrbitingTextProps>(({ isMotionReduced }, ref) => {
  // For reduced motion, place it statically in the dead center of the screen.
  const reducedMotionStyles = "opacity-100 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2";
  // Animation starts from the top-center. Transform will be handled by JS.
  const initialStyles = "opacity-0 left-1/2 top-0"; 

  const textShadow = '0 0 10px rgba(165, 180, 252, 0.5)';

  return (
    <div
      ref={ref}
      className={`absolute flex flex-col items-center justify-center p-4 rounded-lg shadow-lg
                  bg-indigo-500/10 backdrop-blur-sm border border-indigo-400/20
                  will-change-transform transition-opacity duration-500 ${isMotionReduced ? reducedMotionStyles : initialStyles}`}
    >
      <span className="text-5xl font-black text-indigo-300 tracking-widest" style={{ textShadow }}>2</span>
      <span className="text-5xl font-black text-indigo-300 tracking-widest" style={{ textShadow }}>0</span>
      <span className="text-5xl font-black text-indigo-300 tracking-widest" style={{ textShadow }}>2</span>
      <span className="text-5xl font-black text-indigo-300 tracking-widest" style={{ textShadow }}>5</span>
    </div>
  );
});

OrbitingText.displayName = 'OrbitingText';