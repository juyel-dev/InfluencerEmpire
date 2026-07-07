import { useGameStore } from "../../../game/state/gameStore";
import { usePlayerStore } from "../../../game/state/playerStore";
import { formatNumber, formatMoney, formatTime } from "../../../game/utils/formatting";
import { UPGRADES } from "../../../game/data/upgrades";

export function DashboardScreen() {
  const gameTime = useGameStore((s) => s.gameTime);
  const milestones = useGameStore((s) => s.milestones);
  const player = usePlayerStore((s) => s.player);
  const content = usePlayerStore((s) => s.content);
  const purchaseUpgrade = usePlayerStore((s) => s.purchaseUpgrade);
  const canAffordUpgrade = usePlayerStore((s) => s.canAffordUpgrade);

  const published = content.filter((c) => c.status === "published");
  const recentContent = published.slice(0, 5);
  const reachedMilestones = milestones.filter((m) => m.reached);

  const availableUpgrades = UPGRADES.filter((u) => !player.ownedUpgrades.includes(u.id) && (!u.prerequisiteId || player.ownedUpgrades.includes(u.prerequisiteId)));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">{formatTime(gameTime)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Followers" value={formatNumber(player.followers)} sub="Total audience" />
        <StatCard label="Money" value={formatMoney(player.money)} sub={`+${formatMoney(player.followers * 0.01 * (1 + calculateIncomeBonus(player.ownedUpgrades)))}/hour`} />
        <StatCard label="Level" value={player.level.toString()} sub="Influencer rank" />
        <StatCard label="Algorithm" value={player.algorithmScore.toString()} sub="Viral potential" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent Content</h2>
          {recentContent.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-6">No content yet. Go to Studio to create your first post!</p>
          ) : (
            <div className="space-y-2">
              {recentContent.map((piece) => (
                <div key={piece.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{piece.title}</p>
                    <p className="text-xs text-white/40">{formatNumber(piece.views)} views · {formatNumber(piece.followersGained)} followers</p>
                  </div>
                  <span className="text-xs text-white/30 ml-2">{piece.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Milestones</h2>
          {reachedMilestones.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-6">Complete milestones to track your progress!</p>
          ) : (
            <div className="space-y-2">
              {reachedMilestones.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm"><span>{m.icon}</span><span className="text-white/70">{m.name}</span></div>
              ))}
            </div>
          )}
          <div className="pt-2 space-y-1">
            {milestones.filter((m) => !m.reached).slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm text-white/30"><span className="opacity-40">{m.icon}</span><span>{m.description}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Upgrades & Shop</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableUpgrades.map((upgrade) => {
            const affordable = canAffordUpgrade(upgrade);
            const meetsLevel = player.level >= upgrade.requiredLevel;
            return (
              <button
                key={upgrade.id}
                onClick={() => purchaseUpgrade(upgrade)}
                disabled={!affordable}
                className={`text-left bg-white/5 backdrop-blur-2xl rounded-xl p-3 border transition-all ${affordable ? "border-white/10 hover:border-cyan-400/50 cursor-pointer" : "border-white/5 opacity-40 cursor-not-allowed"}`}
              >
                <p className="text-sm font-semibold text-white">{upgrade.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{upgrade.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className={meetsLevel ? "text-emerald-400" : "text-red-400"}>${upgrade.cost}</span>
                  <span className="text-white/30">Lvl {upgrade.requiredLevel}</span>
                </div>
              </button>
            );
          })}
          {availableUpgrades.length === 0 && (
            <p className="text-sm text-white/30 text-center py-4 col-span-full">All upgrades purchased!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-3.5 space-y-1 border border-white/10">
      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold tabular-nums text-white">{value}</p>
      <p className="text-[10px] text-white/30">{sub}</p>
    </div>
  );
}

function calculateIncomeBonus(ownedUpgrades: string[]): number {
  return UPGRADES
    .filter((u) => ownedUpgrades.includes(u.id) && u.effects.incomeMultiplier)
    .reduce((sum, u) => sum + (u.effects.incomeMultiplier ?? 0), 0);
}
