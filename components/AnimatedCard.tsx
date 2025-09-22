import React, { forwardRef } from 'react';

interface AnimatedCardProps {
  isMotionReduced: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({ isMotionReduced }, ref) => {
  const reducedMotionStyles = "opacity-100 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2";
  const initialStyles = "opacity-0 left-1/2"; // Centered horizontally by default

  return (
    <div
      ref={ref}
      className={`absolute w-64 h-80 p-6 rounded-2xl shadow-2xl transition-opacity duration-500
                  bg-white/10 backdrop-blur-md border border-white/20
                  will-change-transform ${isMotionReduced ? reducedMotionStyles : initialStyles}`}
      style={{ perspective: '1000px' }} // Adds depth to the 3D rotation
    >
      <div className="absolute bottom-6 left-6 right-6 h-2 bg-indigo-500/30 rounded-full">
          <div className="h-2 bg-indigo-400 rounded-full" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';
