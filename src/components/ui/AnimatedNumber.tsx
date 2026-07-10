import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  format?: (n: number) => string;
}

export function AnimatedNumber({ value, className, duration = 500, format }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    prev.current = to;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{format ? format(display) : display.toLocaleString()}</span>;
}
