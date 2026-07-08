import { useEffect, useState } from "react";
import { useFeedbackStore } from "@game/state/feedbackStore";

const COLORS = ["#06b6d4", "#d946ef", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  dur: number;
}

export function Confetti() {
  const burst = useFeedbackStore((s) => s.burst);
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (burst === 0) return;
    const arr: Piece[] = Array.from({ length: 44 }, (_, i) => ({
      id: burst * 1000 + i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.3,
      dur: 1.2 + Math.random(),
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 1900);
    return () => clearTimeout(t);
  }, [burst]);

  if (pieces.length === 0) return null;

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
        />
      ))}
    </>
  );
}
