"use client";

import { useEffect, useState } from "react";

interface PaymentCountdownProps {
  expiredAt: string;
  onExpire?: () => void;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function PaymentCountdown({
  expiredAt,
  onExpire,
}: PaymentCountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(expiredAt).getTime() - Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, new Date(expiredAt).getTime() - Date.now());
      setRemaining(ms);
      if (ms <= 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiredAt, onExpire]);

  const totalSec = Math.floor(remaining / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;

  return (
    <div className="font-mono text-2xl font-semibold tabular-nums">
      {pad(mm)}:{pad(ss)}
    </div>
  );
}
