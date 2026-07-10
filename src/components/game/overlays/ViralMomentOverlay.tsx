import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@game/state/gameStore";
import { ViralBurst } from "@assets/illustrations";
import { audio } from "@lib/audio";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    startRef.current = null;
    let raf = 0;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function ViralMomentOverlay() {
  const viralMoment = useGameStore((s) => s.viralMoment);
  const clearViralMoment = useGameStore((s) => s.clearViralMoment);
  const played = useRef(false);

  useEffect(() => {
    if (viralMoment && !played.current) {
      played.current = true;
      audio.play("win");
    }
    if (!viralMoment) played.current = false;
  }, [viralMoment]);

  if (!viralMoment) return null;

  const count = useCountUp(viralMoment.followers);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative flex flex-col items-center text-center">
        <ViralBurst className="vb-animate" size={260} />
        <div className="mt-2">
          <p className="text-5xl font-black tracking-tight bg-gradient-to-r from-accent-cyan via-accent-fuchsia to-accent-purple bg-clip-text text-transparent animate-scaleIn">
            VIRAL MOMENT!
          </p>
          <p className="mt-3 text-xl font-bold text-white tabular-nums">+{count.toLocaleString()} 👥 followers</p>
          <p className="mt-1 text-sm text-text-secondary">Your {viralMoment.location} post exploded across the internet.</p>
        </div>
        <button
          onClick={() => {
            audio.play("click");
            clearViralMoment();
          }}
          className="mt-6 px-8 py-3 rounded-button text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-black active:scale-[0.98] transition-all"
        >
          Legendary. →
        </button>
      </div>
    </div>
  );
}
