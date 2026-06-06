import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimerProps {
  initialSeconds?: number;
  onExpire: () => void;
  isActive: boolean;
}

export function Timer({ initialSeconds = 120, onExpire, isActive }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onExpire();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onExpire]);

  const percentage = (secondsLeft / initialSeconds) * 100;
  
  let colorClass = "text-green-600 dark:text-green-400";
  if (percentage <= 33) {
    colorClass = "text-red-600 dark:text-red-400";
  } else if (percentage <= 66) {
    colorClass = "text-amber-600 dark:text-amber-400";
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex items-center gap-2 font-mono text-lg font-medium tracking-tight transition-colors duration-300", colorClass)}>
      <Clock className="w-5 h-5" />
      <span data-testid="text-timer">{formatTime(secondsLeft)}</span>
    </div>
  );
}
