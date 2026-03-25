import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speed = Math.max(100, 200 - Math.floor(score / 5) * 10);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check self-collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 1;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateTimeRef.current > speed) {
        moveSnake();
        lastUpdateTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 border-4 border-[#0ff] bg-[#000] shadow-[10px_10px_0_#f0f] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      <div className="flex justify-between w-full px-4 font-display text-[#0ff] z-10">
        <div className="flex flex-col gap-1">
          <span className="text-sm uppercase tracking-[0.2em] text-[#f0f]">DATA_LOAD</span>
          <div className="p-2 border-2 border-[#0ff] bg-[#000] shadow-[4px_4px_0_#f0f]">
            <span className="text-xl font-black tracking-tighter glitch-heavy" data-text={score}>{score}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm uppercase tracking-[0.2em] text-[#f0f]">PEAK_SYNC</span>
          <div className="p-2 border-2 border-[#f0f] bg-[#000] shadow-[4px_4px_0_#0ff]">
            <span className="text-xl font-black tracking-tighter glitch-heavy text-[#f0f]" data-text={highScore}>{highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-[#111] border-4 border-[#f0f] overflow-hidden z-10"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#0ff]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-100 ${
              i === 0 
                ? 'bg-[#0ff] shadow-[0_0_10px_#0ff] z-10' 
                : 'bg-[#f0f] shadow-[0_0_5px_#f0f]'
            }`}
            style={{
              width: '20px',
              height: '20px',
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              clipPath: i === 0 ? 'none' : 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)'
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          className="absolute bg-[#f0f] shadow-[0_0_15px_#f0f]"
          style={{
            width: '16px',
            height: '16px',
            left: `${food.x * 20 + 2}px`,
            top: `${food.y * 20 + 2}px`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#000]/90 backdrop-blur-md border-4 border-[#0ff]"
            >
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-black text-[#f0f] mb-6 tracking-tighter uppercase font-display glitch-heavy" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                  <button
                    onClick={resetGame}
                    className="jarring-contrast px-10 py-4 font-display text-sm uppercase tracking-widest transition-all active:translate-y-1"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-[#0ff] mb-6 tracking-tighter uppercase font-display glitch-heavy" data-text="SYNC_PAUSED">SYNC_PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="jarring-contrast px-10 py-4 font-display text-sm uppercase tracking-widest transition-all active:translate-y-1"
                  >
                    RESUME_STREAM
                  </button>
                  <p className="mt-6 text-[#f0f] text-xl uppercase tracking-[0.2em] font-mono animate-pulse">INPUT_SPACE_TO_TOGGLE</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[#0ff] text-xl uppercase tracking-[0.2em] font-mono z-10 bg-[#000] px-4 border-x-2 border-[#f0f]">
        [NAV: ARROWS] • [PAUSE: SPACE]
      </div>
    </div>
  );
}
