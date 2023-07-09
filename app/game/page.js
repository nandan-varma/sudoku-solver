'use client'
import { useState, useEffect } from 'react';

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 20;
const BLOCKS_PER_ROW = 10;
const BLOCK_ROWS = 5;

export default function Home() {
  const [paddleX, setPaddleX] = useState(250);
  const [ballX, setBallX] = useState(300);
  const [ballY, setBallY] = useState(300);
  const [ballDX, setBallDX] = useState(2);
  const [ballDY, setBallDY] = useState(-2);
  const [blocks, setBlocks] = useState(
    new Array(BLOCK_ROWS * BLOCKS_PER_ROW).fill(true)
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setPaddleX((x) => Math.max(0, x - 20));
      } else if (event.key === 'ArrowRight') {
        setPaddleX((x) => Math.min(500 - PADDLE_WIDTH, x + 20));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      let newBallX = ballX + ballDX;
      let newBallY = ballY + ballDY;

      // Check for collision with paddle
      if (
        newBallY > 500 - PADDLE_HEIGHT - BALL_RADIUS &&
        newBallX > paddleX &&
        newBallX < paddleX + PADDLE_WIDTH
      ) {
        setBallDY(-ballDY);
        newBallY = ballY + ballDY;
      }

      // Check for collision with blocks
      for (let row = 0; row < BLOCK_ROWS; row++) {
        for (let col = 0; col < BLOCKS_PER_ROW; col++) {
          const blockIndex = row * BLOCKS_PER_ROW + col;
          if (!blocks[blockIndex]) continue;

          const blockX = col * BLOCK_WIDTH;
          const blockY = row * BLOCK_HEIGHT;
          if (
            newBallX > blockX &&
            newBallX < blockX + BLOCK_WIDTH &&
            newBallY > blockY &&
            newBallY < blockY + BLOCK_HEIGHT
          ) {
            setBlocks((blocks) =>
              blocks.map((block, index) =>
                index === blockIndex ? false : block
              )
            );
            setBallDY(-ballDY);
            newBallY = ballY + ballDY;
            break;
          }
        }
      }

      // Check for collision with borders
      if (newBallX < BALL_RADIUS || newBallX > 500 - BALL_RADIUS) {
        setBallDX(-ballDX);
        newBallX = ballX + ballDX;
      }
      if (newBallY < BALL_RADIUS) {
        setBallDY(-ballDY);
        newBallY = ballY + ballDY;
      }

      // Check for game over
      if (newBallY > 500) {
        setGameOver(true);
        clearInterval(interval);
      }

      setBallX(newBallX);
      setBallY(newBallY);
    }, 10);
    return () => clearInterval(interval);
  }, [ballDX, ballDY, ballX, ballY, blocks, gameOver, paddleX]);

  return (
    <div style={{width : '500px', borderColor : 'black' , borderWidth: '2px' , borderStyle : 'dotted'}}>
      <svg width="500" height="500">
        {/* Draw blocks */}
        {blocks.map((block, index) => {
          if (!block) return null;

          const row = Math.floor(index / BLOCKS_PER_ROW);
          const col = index % BLOCKS_PER_ROW;
          const x = col * BLOCK_WIDTH;
          const y = row * BLOCK_HEIGHT;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={BLOCK_WIDTH}
              height={BLOCK_HEIGHT}
              fill="blue"
            />
          );
        })}

        {/* Draw paddle */}
        <rect
          x={paddleX}
          y={500 - PADDLE_HEIGHT}
          width={PADDLE_WIDTH}
          height={PADDLE_HEIGHT}
          fill="black"
        />

        {/* Draw ball */}
        <circle cx={ballX} cy={ballY} r={BALL_RADIUS} fill="red" />

        {/* Draw game over text */}
        {gameOver && (
          <text x="250" y="250" textAnchor="middle" fontSize="30">
            Game Over
          </text>
        )}
      </svg>

      {/* Draw left and right buttons */}
      <div>

      <button style={{padding : '40px', margin: '20px', marginLeft : '100px'}} onClick={() => setPaddleX((x) => Math.max(0, x - 20))}>
        Left
      </button>
      <button style={{padding : '40px', margin: '20px'}} onClick={() => setPaddleX((x) => Math.min(500 - PADDLE_WIDTH, x + 20))}>
        Right
      </button>
      </div>
    </div>
  );
}
