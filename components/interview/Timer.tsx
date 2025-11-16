'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  startTime: Date;
  duration?: number; // in minutes, optional countdown
  onTimeUp?: () => void;
}

export default function Timer({ startTime, duration, onTimeUp }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(elapsedSeconds);

      // Check if time is up
      if (duration && elapsedSeconds >= duration * 60 && onTimeUp) {
        onTimeUp();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    if (!duration) return null;
    const remaining = duration * 60 - elapsed;
    return remaining > 0 ? remaining : 0;
  };

  const remaining = getTimeRemaining();
  const isAlmostUp = remaining !== null && remaining <= 300; // Last 5 minutes

  return (
    <div className="flex items-center gap-4">
      {/* Elapsed Time */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Elapsed:</span>
        <span className="font-mono text-lg text-white">{formatTime(elapsed)}</span>
      </div>

      {/* Countdown (if duration is set) */}
      {duration && (
        <>
          <span className="text-gray-600">|</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Remaining:</span>
            <span
              className={`font-mono text-lg ${
                isAlmostUp ? 'text-red-400 animate-pulse' : 'text-green-400'
              }`}
            >
              {formatTime(remaining!)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
