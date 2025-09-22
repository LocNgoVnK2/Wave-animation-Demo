
import React from 'react';
import ScrollAnimationScene from './components/ScrollAnimationScene';

const DownArrowIcon: React.FC = () => (
  <svg 
    className="animate-bounce w-8 h-8 mx-auto mt-16 text-gray-400" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
  </svg>
);

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans antialiased">
      <header className="h-screen flex items-center justify-center text-center p-8 bg-gradient-to-b from-gray-900 to-indigo-900/50">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Scroll-Driven Animation</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            An interactive demonstration of mapping scroll position to complex CSS transforms. Scroll down to see the magic.
          </p>
          <DownArrowIcon />
        </div>
      </header>

      <ScrollAnimationScene />

      <footer className="h-screen flex items-center justify-center text-center p-8 bg-gradient-to-t from-gray-900 to-indigo-900/50">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold">Animation Complete</h2>
          <p className="text-lg text-gray-400 mt-4">You've reached the end of the scroll animation.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
