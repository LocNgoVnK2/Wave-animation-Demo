import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Pole } from './Pole';
import { OrbitingText } from './OrbitingText';

// --- ANIMATION PARAMETERS ---
const TEXT_SINE_WAVES_COUNT = 3.0;
const TEXT_AMPLITUDE_AS_WIDTH_PERCENTAGE = 8; // Horizontal amplitude
const TEXT_PHASE_SHIFT_RADIANS = 0; // Set to 0 to match the red line's sine wave

const ScrollAnimationScene: React.FC = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sceneRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const [textHeight, setTextHeight] = useState(0);

    // Measure the text component's height once it's rendered
    useLayoutEffect(() => {
        if (textRef.current) {
            setTextHeight(textRef.current.offsetHeight);
        }
    }, []);


    useEffect(() => {
        const sceneElement = sceneRef.current;
        const textElement = textRef.current;
        
        if (!sceneElement || !textElement || prefersReducedMotion || textHeight === 0) return;
        
        textElement.style.opacity = '1';

        const handleScroll = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            animationFrameId.current = requestAnimationFrame(() => {
                const { top } = sceneElement.getBoundingClientRect();
                const sceneHeight = sceneElement.offsetHeight;
                const viewportHeight = window.innerHeight;
                
                const totalScrollableDistance = sceneHeight - viewportHeight;
                const currentScrollDistance = -top;
                let scrollProgress = Math.max(0, Math.min(1, currentScrollDistance / totalScrollableDistance));
                // Ease the progress for smoother start/end
                scrollProgress = 0.5 - 0.5 * Math.cos(scrollProgress * Math.PI);

                // Y POSITION: Mapped from scroll progress to the available vertical space
                const verticalTravelDistance = viewportHeight - textHeight;
                const currentY = scrollProgress * verticalTravelDistance;

                // X POSITION: Calculated using a sine wave based on the vertical position
                const sceneWidth = sceneElement.offsetWidth;
                const amplitude_text = (TEXT_AMPLITUDE_AS_WIDTH_PERCENTAGE / 100) * sceneWidth;
                const frequency = (TEXT_SINE_WAVES_COUNT * 2 * Math.PI) / viewportHeight;
                const currentX_text = amplitude_text * Math.sin(frequency * currentY + TEXT_PHASE_SHIFT_RADIANS);

                textElement.style.transform = `translate(calc(-50% + ${currentX_text}px), ${currentY}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call to set position

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [prefersReducedMotion, textHeight]);

    return (
        <section ref={sceneRef} className="relative h-[500vh] w-full">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full">
                   <Pole />
                   <OrbitingText ref={textRef} isMotionReduced={prefersReducedMotion} />
                </div>
            </div>
        </section>
    );
};

export default ScrollAnimationScene;