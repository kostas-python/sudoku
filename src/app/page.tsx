'use client';

import { useEffect, useState } from "react";


// Boards for each difficulty level
const boardsByDifficulty = {
  easy: [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    // more here...
  ],
  medium: [
    [
      [1, 0, 0, 4, 0, 0, 0, 0, 0],
      [0, 3, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 9, 0, 0, 0, 7, 0, 0],
      [0, 0, 0, 8, 0, 3, 0, 0, 0],
      [4, 0, 0, 0, 5, 0, 0, 0, 9],
      [0, 0, 0, 6, 0, 7, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 8, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 7, 0],
      [0, 0, 0, 0, 0, 6, 0, 0, 1],
    ],
    [
      [0, 6, 0, 1, 0, 4, 0, 5, 0],
      [0, 0, 8, 3, 0, 5, 6, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 1],
      [8, 0, 0, 4, 0, 7, 0, 0, 6],
      [0, 0, 6, 0, 0, 0, 3, 0, 0],
      [7, 0, 0, 9, 0, 1, 0, 0, 4],
      [5, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 7, 2, 0, 6, 9, 0, 0],
      [0, 4, 0, 5, 0, 8, 0, 7, 0],
    ],
    // more here...
  ],
  hard: [
    [
      [0, 2, 0, 0, 6, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 9, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 0, 0, 0, 8],
      [7, 0, 0, 0, 0, 0, 0, 0, 6],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 4, 0, 0],
      [0, 0, 8, 0, 0, 0, 0, 0, 0],
      [6, 0, 0, 0, 7, 0, 0, 0, 0],
    ],
    [
      [4, 0, 0, 0, 0, 0, 8, 0, 5],
      [0, 3, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 8, 0, 4, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 2, 0, 0, 0, 7],
    ],
    // more here...
  ],
};


// Function to generate a new Sudoku board based on the selected difficulty
const generateNewBoard = (difficulty: keyof typeof boardsByDifficulty) => {
  const boards = boardsByDifficulty[difficulty];
  return boards[Math.floor(Math.random() * boards.length)];
};


// Function to check if a move is valid in the Sudoku board
const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check if the number already exists in the row
  if (board[row].includes(num)) return false;
  // Check if the number already exists in the column
  if (board.some((r) => r[col] === num)) return false;


  // Check if the number already exists in the 3x3 subgrid
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxStartRow + i][boxStartCol + j] === num) return false;
    }
  }
  return true;
};


// Function to check if the Sudoku board is solvable
const isSolvable = (board: number[][]): boolean => {
  const boardCopy = board.map((row) => [...row]); // Create a deep copy of the board


  // Function to find the next empty cell (cell with value 0)
  const findEmptyCell = (board: number[][]): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  };


  // Function to check if a number can be placed in a specific cell
  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }

    
    // Check the 3x3 subgrid
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRowStart + r][boxColStart + c] === num) {
          return false;
        }
      }
    }
    return true;
  };


  // Recursive function to solve the Sudoku board using backtracking
  const solveSudoku = (board: number[][]): boolean => {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true; // If no empty cells, the board is solved
    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num; // Place the number in the cell

        if (solveSudoku(board)) {
          return true; // If the board is solved, return true
        }

        board[row][col] = 0; // Backtrack if the number doesn't lead to a solution
      }
    }
    return false; // If no number works, return false
  };

  return solveSudoku(boardCopy); // Attempt to solve the board
};


export default function Sudoku() {
  // State variables
  const [board, setBoard] = useState<number[][]>([]); // Current Sudoku board
  const [initialBoard, setInitialBoard] = useState<number[][]>([]); // Initial Sudoku board (for resetting)
  const [isSolved, setIsSolved] = useState<boolean>(false); // Whether the board is solved
  const [difficulty, setDifficulty] = useState<keyof typeof boardsByDifficulty>("easy"); // Selected difficulty level


  // Effect to reset the game when the difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null); // Selected cell coordinates


  // Function to check if the board is solved
  const checkIfSolved = (newBoard: number[][]) => {
    if (newBoard.every((row) => row.every((cell) => cell !== 0))) {
      setIsSolved(true);
    }
  };


  // Function to handle cell clicks
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };


  // Function to handle number clicks (placing a number in the selected cell)
  const handleNumberClick = (num: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;

      // Prevent modifying the initial board
      if (initialBoard[row][col] !== 0) {
        alert("This cell is part of the initial board and cannot be changed.");
        return;
      }

      // Check if the move is valid
      if (!isValidMove(board, row, col, num)) {
        alert("Invalid move! Please try a different number.");
        return;
      }

      // Update the board with the new number
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? num : cell))
      );

      setBoard(newBoard);
      setSelectedCell(null);
      checkIfSolved(newBoard); // Check if the board is solved
    }
  };


  // Function to solve the board automatically for testing with button at the bottom
  // const solveBoard = () => {
  //   const boardCopy = board.map((row) => [...row]); // Create a deep copy of the board
  //   if (isSolvable(boardCopy)) {
  //     setBoard(boardCopy);
  //     setIsSolved(true);
  //     alert("The board has been solved!");
  //   } else {
  //     alert("This board cannot be solved.");
  //   }
  // };


  // Function to reset the game with a new board
  const resetGame = () => {
    let newBoard;
    do {
      newBoard = generateNewBoard(difficulty); // Generate a new board
    } while (!isSolvable(newBoard)); // Ensure the board is solvable

    setBoard(newBoard);
    setInitialBoard(newBoard.map((row) => [...row])); // Set the initial board
    setSelectedCell(null);
    setIsSolved(false);
  };


  // Function to reset the current board to its initial state
  const resetCurrentBoard = () => {
    setBoard(initialBoard.map((row) => [...row]));
    setSelectedCell(null);
    setIsSolved(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-b from-green-800 via-gray-700 to-black">
      <h1 className="text-xl md:text-3xl font-bold mb-4 text-gray-200 text-center">Sudoku Game</h1>
      {isSolved && <p className="text-green-400 mb-4 text-lg tracking-wide font-bold">Congratulations! You solved the Sudoku!</p>}


      {/* Difficulty selection buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            className={`px-4 py-2 rounded-lg transition ${
              difficulty === diff
                ? "bg-blue-600 text-white"
                : "bg-gray-500 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setDifficulty(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>


      {/* Sudoku grid */}
      <div className="grid grid-cols-9 gap-1 bg-white p-4 rounded-lg shadow-lg overflow-auto max-w-full">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell !== 0 ? cell : ""}
              readOnly
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-center border border-gray-400 text-lg font-semibold focus:outline-none cursor-pointer
                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "bg-green-200" : ""}
                ${initialBoard[rowIndex][colIndex] !== 0 ? "bg-gray-300 cursor-not-allowed" : ""}
                ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-4 border-gray-950" : ""}
                ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-4 border-gray-950" : ""}
              `}
            />
          ))
        )}
      </div>


      {/* Number selection buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-800 transition"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>


      {/* Game control buttons */}
      <div className="flex flex-row space-x-4 mt-4">
        <button
          className="px-4 py-2 md:px-6 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={resetGame}
        >
          Change Board
        </button>

        <button
          className="px-4 py-2 md:px-6 md:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          onClick={resetCurrentBoard}
        >
          Reset Current Board
        </button>

        {/*  // Optional to test new boards

         <button
          className="px-4 py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={solveBoard}
        >
          Solve for Me
        </button> */}

      </div>
    </div>
  );
}