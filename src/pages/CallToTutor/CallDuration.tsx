import React, { useEffect, useState } from 'react';
import { DurationDisplay } from './styles';
import { Timestamp } from 'firebase/firestore';

type CallDurationProps = {
  timestamp: Timestamp;
};

function CallDuration({ timestamp }: CallDurationProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - timestamp.seconds;
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return <DurationDisplay>{formatTime(duration)}</DurationDisplay>;
}

export default CallDuration;
