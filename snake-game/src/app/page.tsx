'use client';

import { useEffect, useRef, useState } from 'react';

const canvasSize = { width: 400, height: 400 };
const initialSnake = [
  { x: 8, y: 8 },
];
const initialFood = { x: 12, y: 12 };
const scale = 20;
const speed = 100; // milliseconds per frame

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [dir, setDir] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (dir !== 'DOWN') setDir('UP');
          break;
        case 'ArrowDown':
          if (dir !== 'UP') setDir('DOWN');
          break;
        case 'ArrowLeft':
          if (dir !== 'RIGHT') setDir('LEFT');
          break;
        case 'ArrowRight':
          if (dir !== 'LEFT') setDir('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        // Move head
        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * (canvasSize.width / scale)),
            y: Math.floor(Math.random() * (canvasSize.height / scale)),
          });
        } else {
          newSnake.pop(); // Remove tail if not eating
        }

        // Check collisions
        if (
          head.x < 0 || head.x >= canvasSize.width / scale ||
          head.y < 0 || head.y >= canvasSize.height / scale ||
          newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          clearInterval(interval);
        }

        return newSnake;
      });

      // Draw everything
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      ctx.fillStyle = 'lime';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
      });

      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

    }, speed);

    return () => clearInterval(interval);
  }, [dir, snake, food, gameOver]);

  const handleRestart = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDir('RIGHT');
    setGameOver(false);
  };

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#111', 
      color: '#0f0' 
    }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ border: '2px solid white', backgroundColor: 'black' }}
      />
      {gameOver && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>Game Over!</h2>
          <button onClick={handleRestart} style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}>
            Restart
          </button>
        </div>
      )}
    </main>
  );
}
