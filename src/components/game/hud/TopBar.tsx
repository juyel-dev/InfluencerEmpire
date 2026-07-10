import { useGameStore } from "@game/state/gameStore";
import { LogoMark } from "@assets/illustrations";
import { AnimatedNumber, ProgressBar } from "@ui/index";
import { MILESTONES, FINAL_GOAL } from "@game/types";

const STATUS_DOT = {
  saving: "bg-accent-cyan animate-pulse",
  loaded: "bg-accent-emerald",
  error: "bg-error",
  idle: "bg-white/20",
} as const;

export function TopBar() {
  const res = useGameStore((s) => s.state.resources);
  const saveStatus = useGameStore((s) => s.saveStatus);
  const lastSaveTime = useGameStore((s) => s.lastSaveTime);

  const idx = MILESTONES.findIndex((m) => res.followers < m.goal);
  const goal = idx === -1 ? FINAL_GOAL : MILESTONES[idx].goal;
  const prev = idx <= 0 ? 0 : MILESTONES[idx - 1].goal;
  const progressPct = Math.max(0, Math.min(100, Math.round(((res.followers - prev) / (goal - prev)) * 100)));
  const atGoal = res.followers >= FINAL_GOAL;

  return (
    <header className="bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 py-2 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoMark size={28} className="text-accent-cyan" />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${STATUS_DOT[saveStatus]}`}
            title={lastSaveTime ? `Saved ${new Date(lastSaveTime).toLocaleTimeString()}` : "Not saved"} />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-xs">
          <div className="text-center">
            <p className="text-text-secondary">Day</p>
            <p className="font-semibold text-white tabular-nums">{res.day}</p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary">⚡</p>
            <p className="font-semibold text-white tabular-nums">{res.energy}/{res.maxEnergy}</p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary">👥</p>
            <p className="font-semibold text-accent-cyan tabular-nums"><AnimatedNumber value={res.followers} /></p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary">💰</p>
            <p className="font-semibold text-accent-emerald tabular-nums"><AnimatedNumber value={res.money} format={(n) => `$${n}`} /></p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <ProgressBar value={progressPct} max={100} color="#06b6d4" height="sm" showValue={false} />
        <p className="text-[10px] text-text-muted mt-0.5 text-right">
          {atGoal ? "👑 Influencer!" : `${goal.toLocaleString()} followers to next milestone`}
        </p>
      </div>
    </header>
  );
}
