'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ROWS = 30
const COLS = 50
const CELL_SIZE = 10

type Grid = boolean[][]

const createEmptyGrid = (): Grid => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false))
}

const createRandomGrid = (): Grid => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() > 0.7)
  )
}

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const runSimulation = (grid: Grid): Grid => {
  const newGrid = grid.map(arr => [...arr])
  for (let i = 0; i < ROWS; i++) {
    for (let k = 0; k < COLS; k++) {
      let neighbors = 0
      operations.forEach(([x, y]) => {
        const newI = i + x
        const newK = k + y
        if (newI >= 0 && newI < ROWS && newK >= 0 && newK < COLS) {
          neighbors += grid[newI][newK] ? 1 : 0
        }
      })

      if (neighbors < 2 || neighbors > 3) {
        newGrid[i][k] = false
      } else if (grid[i][k] === false && neighbors === 3) {
        newGrid[i][k] = true
      }
    }
  }
  return newGrid
}

export default function Home() {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid())
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current) return
    setGrid(currentGrid => runSimulation(currentGrid))
    setTimeout(runSimulationStep, 100)
  }, [])

  const handleStart = () => {
    setRunning(!running)
    if (!running) {
      runningRef.current = true
      runSimulationStep()
    }
  }

  const handleStep = () => {
    setGrid(currentGrid => runSimulation(currentGrid))
  }

  const handleReset = () => {
    setRunning(false)
    setGrid(createEmptyGrid())
  }

  const handleRandom = () => {
    setRunning(false)
    setGrid(createRandomGrid())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Conway's Game of Life</h1>
      <div className="mb-4 space-x-2">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={handleStep}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Step
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
        <button
          onClick={handleRandom}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Random
        </button>
      </div>
      <div
        className="grid border-2 border-gray-400"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          gap: 0,
        }}
        onClick={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          const col = Math.floor((e.clientX - rect.left) / CELL_SIZE)
          const row = Math.floor((e.clientY - rect.top) / CELL_SIZE)
          if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            setGrid(currentGrid => {
              const newGrid = currentGrid.map(arr => [...arr])
              newGrid[row][col] = !newGrid[row][col]
              return newGrid
            })
          }
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, k) => (
            <div
              key={`${i}-${k}`}
              className={`border border-gray-300 ${cell ? 'bg-black' : 'bg-white'}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}