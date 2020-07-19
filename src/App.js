import React, { useState, useRef } from 'react'
import './App.css'

const defaultStartingMinutes = 25
const defaultStartingSeconds = defaultStartingMinutes * 60
const BEGIN_MESSAGE = 'Let the countdown begin!'

function padTime(time) {
  return time.toString().padStart(2, '0')
}

function getStartingSeconds() {
  const params = new URLSearchParams(window.location.search)
  return parseInt(params.get('start') || defaultStartingSeconds)
}

export default function App() {
  const startingSeconds = getStartingSeconds()
  let intervalRef = useRef(null)
  const [title, setTitle] = useState(BEGIN_MESSAGE)
  const [timeLeft, setTimeLeft] = useState(startingSeconds)
  const [isRunning, setIsRunning] = useState(false)

  function onTick() {
    setTimeLeft((timeLeft) => {
      if (timeLeft > 0) {
        setTitle("You're doing great!")
        return timeLeft - 1
      }
      resetTimer()
      return 0
    })
  }

  function startTimer() {
    if (intervalRef.current !== null) return
    intervalRef.current = setInterval(onTick, 1000)
    setIsRunning(true)
  }

  function stopTimer() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsRunning(false)
      setTitle('Keep it up!')
    }
  }

  function resetTimer() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
    setTimeLeft(getStartingSeconds())
    setTitle('Ready to go another round?')
  }

  const minutes = padTime(Math.floor(timeLeft / 60))
  const seconds = padTime(timeLeft - minutes * 60)

  return (
    <div className="app">
      <h2 className="title">{title}</h2>

      <div className="timer">
        <span id="minutes">{minutes}</span>
        <span>:</span>
        <span id="seconds">{seconds}</span>
      </div>

      <div className="buttons">
        {!isRunning && (
          <button id="startBtn" onClick={startTimer}>
            Start
          </button>
        )}
        {isRunning && (
          <button id="stopBtn" onClick={stopTimer}>
            Stop
          </button>
        )}
        <button id="resetBtn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  )
}
