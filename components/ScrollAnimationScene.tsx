import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Pole } from './Pole';
import { OrbitingText } from './OrbitingText';

// --- SCENE & SCALING CONFIGURATION ---
const SCROLL_HEIGHT_VH = 800; // New extended scroll height
const BASE_SCROLL_HEIGHT_VH = 500; // Original scroll height for reference
const SCALING_FACTOR = SCROLL_HEIGHT_VH / BASE_SCROLL_HEIGHT_VH;

// --- BASE ANIMATION PARAMETERS ---
const BASE_SINE_WAVES_COUNT = 3.0;
const BASE_AMPLITUDE_PERCENTAGE = 8; // Horizontal amplitude as a percentage of scene width

// --- SCALED ANIMATION PARAMETERS ---
const TEXT_SINE_WAVES_COUNT = BASE_SINE_WAVES_COUNT * SCALING_FACTOR;
const TEXT_AMPLITUDE_AS_WIDTH_PERCENTAGE = BASE_AMPLITUDE_PERCENTAGE * SCALING_FACTOR;
const TEXT_PHASE_SHIFT_RADIANS = 0;

const ScrollAnimationScene: React.FC = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sceneRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const [textHeight, setTextHeight] = useState(0);
    const [textPath, setTextPath] = useState('');

    // Measure the text component's height once it's rendered
    useLayoutEffect(() => {
        if (textRef.current) {
            setTextHeight(textRef.current.offsetHeight);
        }
    }, []);

    // Calculate the SVG path for the sine wave
    useLayoutEffect(() => {
        const calculateAndSetPath = () => {
            const sceneElement = sceneRef.current;
            if (!sceneElement) return;

            const sceneWidth = sceneElement.offsetWidth;
            const viewportHeight = window.innerHeight;

            const amplitude = (TEXT_AMPLITUDE_AS_WIDTH_PERCENTAGE / 100) * sceneWidth;
            const frequency = (TEXT_SINE_WAVES_COUNT * 2 * Math.PI) / viewportHeight;

            let pathData = '';
            const pathSteps = 200; // Increase for a smoother curve

            for (let i = 0; i <= pathSteps; i++) {
                const y = (i / pathSteps) * viewportHeight;
                const x = amplitude * Math.sin(frequency * y + TEXT_PHASE_SHIFT_RADIANS) + sceneWidth / 2;

                if (i === 0) {
                    pathData += `M ${x} ${y}`;
                } else {
                    pathData += ` L ${x} ${y}`;
                }
            }
            setTextPath(pathData);
        };
        
        calculateAndSetPath();
        window.addEventListener('resize', calculateAndSetPath);
        return () => window.removeEventListener('resize', calculateAndSetPath);

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
        <section 
            ref={sceneRef} 
            className="relative w-full"
            style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" className="absolute top-0 left-0" aria-hidden="true">
                    <path
                        d={textPath}
                        stroke="rgba(239, 68, 68, 0.4)" // semi-transparent red
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
                <div className="relative w-full h-full">
                   <Pole />
                   <OrbitingText ref={textRef} isMotionReduced={prefersReducedMotion} />
                </div>
            </div>
        </section>
    );
};

export default ScrollAnimationScene;