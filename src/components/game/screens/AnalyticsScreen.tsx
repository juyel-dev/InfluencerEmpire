import { usePlayerStore } from "../../../game/state/playerStore";
import { useGameStore } from "../../../game/state/gameStore";
import { formatNumber, formatMoney } from "../../../game/utils/formatting";

export function AnalyticsScreen() {
  const player = usePlayerStore((s) => s.player);
  const content = usePlayerStore((s) => s.content);
  const milestones = useGameStore((s) => s.milestones);

  const published = content.filter((c) => c.status === "published");
  const totalViews = published.reduce((s, c) => s + c.views, 0);
  const totalFollowers = published.reduce((s, c) => s + c.followersGained, 0);
  const totalMoney = published.reduce((s, c) => s + c.moneyEarned, 0);
  const avgEngagement = published.length > 0 ? published.reduce((s, c) => s + c.engagement, 0) / published.length : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Your performance metrics</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnalyticCard label="Total Views" value={formatNumber(totalViews)} />
        <AnalyticCard label="Total Followers" value={formatNumber(totalFollowers)} />
        <AnalyticCard label="Total Earned" value={formatMoney(totalMoney)} />
        <AnalyticCard label="Avg Engagement" value={avgEngagement.toFixed(0)} sub="per post" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Milestones</h2>
          <div className="space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-1.5">
                <span className={m.reached ? "" : "opacity-30"}>{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-white/40">{m.description}</p>
                </div>
                <span className={m.reached ? "text-green-400 text-xs font-medium" : "text-white/20 text-xs"}>{m.reached ? "✓" : formatNumber(m.requirement)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-3 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Player Stats</h2>
          <div className="space-y-3">
            <Row label="Current Followers" value={formatNumber(player.followers)} />
            <Row label="Total Earned" value={formatMoney(player.totalMoneyEarned)} />
            <Row label="Level" value={player.level.toString()} />
            <Row label="Experience" value={player.experience.toString()} />
            <Row label="Reputation" value={`${player.reputation.toFixed(1)}%`} />
            <Row label="Content Published" value={published.length.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-3.5 space-y-1 border border-white/10">
      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold tabular-nums text-white">{value}</p>
      {sub && <p className="text-[10px] text-white/30">{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span className="font-medium text-white tabular-nums">{value}</span>
    </div>
  );
}
