import { useGameStore } from "../../../game/state/gameStore";
import { usePlayerStore } from "../../../game/state/playerStore";
import { formatNumber, formatMoney, formatTime } from "../../../game/utils/formatting";
import { StatDisplay } from "../shared/StatDisplay";

export function TopBar() {
  const gameTime = useGameStore((s) => s.gameTime);
  const player = usePlayerStore((s) => s.player);

  return (
    <header className="bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 py-2 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold tracking-tight text-cyan-400">IE</span>
        <span className="text-xs text-white/30 font-mono hidden sm:inline">v0.1</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <StatDisplay icon={<span>👥</span>} label="Followers" value={formatNumber(player.followers)} trend="up" />
        <StatDisplay icon={<span>💰</span>} label="Money" value={formatMoney(player.money)} />
        <StatDisplay icon={<span>🤖</span>} label="Algorithm" value={player.algorithmScore.toString()} />
        <StatDisplay icon={<span>📊</span>} label="Level" value={player.level.toString()} />
      </div>
      <div className="text-xs text-white/40 font-mono tabular-nums text-right">{formatTime(gameTime)}</div>
    </header>
  );
}
