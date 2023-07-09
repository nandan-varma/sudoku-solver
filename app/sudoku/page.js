'use client'
import { useState } from 'react';

const SudokuPage = () => {
  const [grid, setGrid] = useState(Array(9).fill(0).map(() => Array(9).fill('')));
  const [solution, setSolution] = useState(Array(9).fill(Array(9).fill('')));

  const handleInputChange = (e, row, col) => {
    const updatedGrid = [...grid];
    updatedGrid[row][col] = e.target.value;
    setGrid(updatedGrid);
  };

  const isValid = (num, row, col) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const solveSudoku = () => {
    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === '') {
            for (let num = 1; num <= 9; num++) {
              if (isValid(num.toString(), row, col)) {
                grid[row][col] = num.toString();
                if (solve()) {
                  return true;
                }
                grid[row][col] = '';
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const clonedGrid = JSON.parse(JSON.stringify(grid));
    if (solve()) {
      setSolution(clonedGrid);
    } else {
      setSolution(Array(9).fill(Array(9).fill('')));
    }
  };

  return (
    <div>
      <h1>Sudoku Solver</h1>
      <div>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="number"
                min="1"
                max="9"
                value={cell}
                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                style={{ width: '30px', height: '30px', textAlign: 'center', margin: '2px' }}
              />
            ))}
          </div>
        ))}
      </div>
      <button style={{margin : '20px'}} onClick={solveSudoku}>Solve</button>
      {/* <h2>Solution:</h2>
      <div>
        {solution.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '30px',
                  height: '30px',
                  textAlign: 'center',
                  margin: '2px',
                  fontWeight: 'bold',
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default SudokuPage;
