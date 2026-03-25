import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-[#0ff] flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-[#f0f] selection:text-[#000]">
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 font-display glitch-heavy">
          <span 
            className="text-[#f0f] drop-shadow-[0_0_10px_#f0f]"
            data-text="SYSTEM_SNAKE"
          >
            SYSTEM_SNAKE
          </span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-xl uppercase tracking-[0.4em] font-mono text-[#0ff]">
          <span>[PROTOCOL_ARCADE]</span>
          <span className="w-2 h-2 bg-[#f0f] animate-ping" />
          <span>[SIGNAL_SYNTH]</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 z-10 w-full max-w-7xl">
        {/* Game Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-[#f0f] opacity-20 blur-lg animate-pulse" />
          <SnakeGame />
        </motion.div>

        {/* Sidebar / Music Player */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-8 w-full max-w-md"
        >
          <MusicPlayer />
          
          {/* Stats / Info Card */}
          <div className="p-6 border-4 border-[#f0f] bg-[#000] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0ff] animate-pulse" />
            <h4 className="text-lg font-display uppercase tracking-widest text-[#f0f]">COMMAND_LOG</h4>
            <ul className="text-xl text-[#0ff] space-y-2 font-mono">
              <li className="flex items-center gap-2">
                <span className="text-[#f0f]">{'>'}</span>
                CONSUME_ORBS_TO_EXPAND
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#f0f]">{'>'}</span>
                AVOID_SELF_TERMINATION
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#f0f]">{'>'}</span>
                WRAP_PROTOCOL_ACTIVE
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-16 text-[#f0f]/40 text-sm uppercase tracking-widest font-mono z-10">
        [TERMINAL_ID: 2026-ARCADE-SYS] • [STATUS: ONLINE]
      </footer>
    </div>
  );
}
