import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Lights",
    artist: "Cyber Synth",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3",
    color: "cyan"
  },
  {
    id: 2,
    title: "Cyberpunk Night",
    artist: "Digital Nomad",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "Retro Future",
    artist: "Synthwave King",
    url: "https://cdn.pixabay.com/audio/2021/11/23/audio_0c9998053a.mp3",
    color: "indigo"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const onEnded = () => handleNext();

  return (
    <div className="w-full max-w-md p-6 border-4 border-[#f0f] bg-[#000] shadow-[10px_10px_0_#0ff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <div className="flex items-center gap-6 z-10 relative">
        {/* Album Art Placeholder */}
        <motion.div 
          animate={{ 
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? 1.1 : 1
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 5, ease: "linear" },
            scale: { duration: 0.2 }
          }}
          className={`w-24 h-24 flex items-center justify-center border-4 ${
            currentTrack.color === 'cyan' ? 'border-[#0ff] shadow-[0_0_15px_#0ff]' :
            currentTrack.color === 'fuchsia' ? 'border-[#f0f] shadow-[0_0_15px_#f0f]' :
            'border-[#0ff] shadow-[0_0_15px_#0ff]'
          } bg-[#000]`}
          style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
        >
          <Music className={`w-10 h-10 ${
            currentTrack.color === 'cyan' ? 'text-[#0ff]' :
            currentTrack.color === 'fuchsia' ? 'text-[#f0f]' :
            'text-[#0ff]'
          } animate-pulse`} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-2xl font-display text-[#f0f] truncate tracking-tighter uppercase glitch-heavy" data-text={currentTrack.title}>
                {currentTrack.title}
              </h3>
              <p className="text-xl text-[#0ff] font-mono uppercase tracking-[0.2em]">
                {'>'} {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-6">
            <button 
              onClick={handlePrev} 
              className="text-[#0ff] hover:text-[#f0f] transition-all hover:scale-110 active:scale-95"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={handlePlayPause}
              className={`w-14 h-14 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 ${
                isPlaying 
                  ? 'bg-[#f0f] border-[#0ff] text-[#000] shadow-[0_0_20px_#f0f]' 
                  : 'bg-[#0ff] border-[#f0f] text-[#000] shadow-[0_0_20px_#0ff]'
              }`}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={handleNext} 
              className="text-[#0ff] hover:text-[#f0f] transition-all hover:scale-110 active:scale-95"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 z-10 relative">
        <div className="h-4 w-full bg-[#111] border-2 border-[#0ff] overflow-hidden">
          <motion.div 
            className={`h-full ${
              currentTrack.color === 'cyan' ? 'bg-[#0ff]' :
              currentTrack.color === 'fuchsia' ? 'bg-[#f0f]' :
              'bg-[#0ff]'
            } shadow-[0_0_10px_currentColor]`}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
          />
        </div>
      </div>

      {/* Volume Control */}
      <div className="mt-4 flex items-center gap-3 text-[#f0f] z-10 relative">
        <Volume2 size={20} />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-[#111] border-2 border-[#f0f] appearance-none cursor-pointer accent-[#0ff]"
        />
      </div>
    </div>
  );
}
