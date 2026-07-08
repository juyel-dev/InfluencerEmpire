import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@game/state/gameStore";
import { Card } from "@ui/index";
import { audio } from "@lib/audio";

function useCountUp(target: number, duration = 600) {
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

function StatRow({ label, delta, icon, goodWhenNeg }: { label: string; delta: number; icon: string; goodWhenNeg?: boolean }) {
  const shown = useCountUp(delta);
  const positive = delta > 0;
  const negative = delta < 0;
  const neutral = delta === 0;
  const isGood = neutral ? false : positive || (!!goodWhenNeg && negative);
  const color = neutral ? "text-text-muted" : isGood ? "text-accent-emerald" : "text-error";
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-text-secondary flex items-center gap-2">
        <span className="text-base">{icon}</span>
        {label}
      </span>
      <span className={`font-bold tabular-nums ${color}`}>
        {neutral ? "—" : `${delta > 0 ? "+" : ""}${shown}`}
      </span>
    </div>
  );
}

export function DaySummaryOverlay() {
  const summary = useGameStore((s) => s.daySummary);
  const clearDaySummary = useGameStore((s) => s.clearDaySummary);
  const played = useRef(false);

  useEffect(() => {
    if (summary && !played.current) {
      played.current = true;
      audio.play("levelup");
    }
    if (!summary) played.current = false;
  }, [summary]);

  if (!summary) return null;

  const totalGain = summary.followersDelta + summary.moneyDelta + summary.reputationDelta + summary.creativityDelta;
  const flavor =
    summary.activitiesDone === 0
      ? "A quiet day. The algorithm noticed."
      : totalGain > 40
        ? "Huge momentum! You're on fire."
        : totalGain > 0
          ? "Steady progress. Keep building."
          : "Tough day. Tomorrow's a fresh start.";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-sm p-6 animate-scaleIn" variant="glass">
        <p className="text-xs uppercase tracking-widest text-text-secondary">Day {summary.day} Complete</p>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent mt-1">
          Daily Report
        </h2>
        <p className="text-sm text-text-secondary mt-1">{flavor}</p>

        <div className="mt-4 divide-y divide-white/5">
          <StatRow label="Followers" delta={summary.followersDelta} icon="👥" />
          <StatRow label="Money" delta={summary.moneyDelta} icon="💰" goodWhenNeg />
          <StatRow label="Reputation" delta={summary.reputationDelta} icon="⭐" />
          <StatRow label="Creativity" delta={summary.creativityDelta} icon="🎨" />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-card-xs bg-white/[0.04] px-4 py-2">
          <span className="text-sm text-text-secondary">Activities done</span>
          <span className="font-bold text-white tabular-nums">{summary.activitiesDone}</span>
        </div>

        <button
          onClick={() => clearDaySummary()}
          className="mt-5 w-full py-3 rounded-button text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-black active:scale-[0.98] transition-all"
        >
          Continue →
        </button>
      </Card>
    </div>
  );
}
