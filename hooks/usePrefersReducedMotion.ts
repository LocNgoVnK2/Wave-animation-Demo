
import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * A custom React hook to detect if the user has a preference for reduced motion.
 * @returns {boolean} - True if the user prefers reduced motion, false otherwise.
 */
export function usePrefersReducedMotion(): boolean {
  // Check if we are in a browser environment before using window.matchMedia
  const isClient = typeof window === 'object';
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    isClient ? window.matchMedia(QUERY).matches : false
  );

  useEffect(() => {
    if (!isClient) return;

    const mediaQueryList = window.matchMedia(QUERY);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener for changes to the media query
    mediaQueryList.addEventListener('change', listener);
    
    // Cleanup function to remove the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [isClient]);

  return prefersReducedMotion;
}
