import { useGameStore } from "@game/state/gameStore";
import { LogoMark } from "@assets/illustrations";

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

  return (
    <header className="bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 py-2 flex items-center justify-between gap-4 shrink-0">
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
          <p className="font-semibold text-white tabular-nums">{res.followers}</p>
        </div>
        <div className="text-center">
          <p className="text-text-secondary">💰</p>
          <p className="font-semibold text-white tabular-nums">${res.money}</p>
        </div>
      </div>
    </header>
  );
}