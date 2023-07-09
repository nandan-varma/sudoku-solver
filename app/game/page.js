'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 2;
const BALL_RADIUS = 2;
const BLOCK_WIDTH = 10;
const BLOCK_HEIGHT = 4;
const BLOCKS_PER_ROW = 10;
const BLOCK_ROWS = 5;

export default function Home() {
  const [paddleX, setPaddleX] = useState(40);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(75);
  const [ballDX, setBallDX] = useState(0.2);
  const [ballDY, setBallDY] = useState(-0.2);
  const [blocks, setBlocks] = useState(
    new Array(BLOCK_ROWS * BLOCKS_PER_ROW).fill(true)
  );
  const [gameOver, setGameOver] = useState(false);
  const [leftInterval, setLeftInterval] = useState(null);
  const [rightInterval, setRightInterval] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setPaddleX((x) => Math.max(0, x - 2));
      } else if (event.key === 'ArrowRight') {
        setPaddleX((x) => Math.min(100 - PADDLE_WIDTH, x + 2));
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
        newBallY > 100 - PADDLE_HEIGHT - BALL_RADIUS &&
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
      if (newBallX < BALL_RADIUS || newBallX > 100 - BALL_RADIUS) {
        setBallDX(-ballDX);
        newBallX = ballX + ballDX;
      }
      if (newBallY < BALL_RADIUS) {
        setBallDY(-ballDY);
        newBallY = ballY + ballDY;
      }

      // Check for game over
      if (newBallY > 100) {
        setGameOver(true);
        clearInterval(interval);
      }

      setBallX(newBallX);
      setBallY(newBallY);
    }, 10);
    return () => clearInterval(interval);
  }, [ballDX, ballDY, ballX, ballY, blocks, gameOver, paddleX]);

  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
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
          y={100 - PADDLE_HEIGHT}
          width={PADDLE_WIDTH}
          height={PADDLE_HEIGHT}
          fill="black"
        />

        {/* Draw ball */}
        <circle cx={ballX} cy={ballY} r={BALL_RADIUS} fill="red" />

        {/* Draw game over text */}
        {gameOver && (
          <text x="50" y="50" textAnchor="middle" fontSize="10">
            Game Over
          </text>
        )}
      </svg>

      {/* Draw left and right buttons */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={{ width: '100px', height: '100px' }}
          onMouseDown={() =>
            setLeftInterval(
              setInterval(() => setPaddleX((x) => Math.max(0, x - 2)), 50)
            )
          }
          onMouseUp={() => {
            clearInterval(leftInterval);
            setLeftInterval(null);
          }}
          onTouchStart={() =>
            setLeftInterval(
              setInterval(() => setPaddleX((x) => Math.max(0, x - 2)), 50)
            )
          }
          onTouchEnd={() => {
            clearInterval(leftInterval);
            setLeftInterval(null);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <button
          style={{ width: '100px', height: '100px' }}
          onMouseDown={() =>
            setRightInterval(
              setInterval(
                () => setPaddleX((x) => Math.min(100 - PADDLE_WIDTH, x + 2)),
                50
              )
            )
          }
          onMouseUp={() => {
            clearInterval(rightInterval);
            setRightInterval(null);
          }}
          onTouchStart={() =>
            setRightInterval(
              setInterval(
                () => setPaddleX((x) => Math.min(100 - PADDLE_WIDTH, x + 2)),
                50
              )
            )
          }
          onTouchEnd={() => {
            clearInterval(rightInterval);
            setRightInterval(null);
          }}
        >
          <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
}
