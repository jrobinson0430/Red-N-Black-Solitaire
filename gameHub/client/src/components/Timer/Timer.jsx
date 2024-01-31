import React, { useState, useEffect } from 'react';
import { formatTime } from '../../scripts/helpers';
import './Timer.css';

const Timer = ({ timerBox }) => {
  const [gameClock, setGameClock] = useState(0);

  const { isFirstMove, isGameOver, totalTime, setTotalTime, isPaused } =
    timerBox;

  useEffect(() => {
    if (isFirstMove) return setGameClock(0);
    if (isPaused || isGameOver) return;

    const timer = setTimeout(() => {
      setGameClock(gameClock + 1);
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    setTotalTime(gameClock);
  }, [isGameOver]);

  return <div className='timerContainer'>{formatTime(gameClock)}</div>;
};

export default Timer;
