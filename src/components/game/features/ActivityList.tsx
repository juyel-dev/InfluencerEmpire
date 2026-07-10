import { useState } from "react";
import type { MouseEvent } from "react";
import { useGameStore } from "@game/state/gameStore";
import { useFeedbackStore, type FloatKind } from "@game/state/feedbackStore";
import { audio } from "@lib/audio";
import { ProgressBar } from "@ui/index";
import { LocationScene } from "@assets/illustrations";
import type { Location } from "@game/types";

const CATEGORY_ICONS: Record<string, string> = {
  create: "🎨",
  social: "🤝",
  train: "💪",
  explore: "🔍",
};

interface ActivityListProps {
  loc: Location;
}

export function ActivityList({ loc }: ActivityListProps) {
  const state = useGameStore((s) => s.state);
  const doActivity = useGameStore((s) => s.doActivity);
  const setScreen = useGameStore((s) => s.setScreen);
  const showToast = useGameStore((s) => s.showToast);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAct = (e: MouseEvent, act: Location["activities"][number]) => {
    audio.play("click");
    const before = useGameStore.getState().state.resources;
    const result = doActivity(act.id);
    showToast(result.message, result.success ? "success" : "warning");
    if (result.success && result.outcome) {
      const after = useGameStore.getState().state.resources;
      const fb = useFeedbackStore.getState();
      const x = e.clientX;
      const y = e.clientY;
      const o = result.outcome;
      if (o.tier === "viral") {
        audio.play("follower");
        fb.celebrate(x, y);
      } else if (o.tier === "flop") {
        audio.play("fail");
      } else {
        audio.play("success");
      }
      const deltas: [number, FloatKind, string][] = [
        [after.followers - before.followers, "follower", "👥"],
        [after.money - before.money, "money", "💰"],
        [after.reputation - before.reputation, "reputation", "⭐"],
        [after.creativity - before.creativity, "creativity", "🎨"],
        [after.energy - before.energy, "energy", "⚡"],
      ];
      for (const [d, kind, icon] of deltas) {
        if (d !== 0) fb.spawn(`${d > 0 ? "+" : ""}${d} ${icon}`, kind, x, y - 12);
      }
      if (result.outcome?.mega) {
        useGameStore.getState().showViralMoment(after.followers - before.followers, loc.name);
      }
    }
    if (result.success) setTimeout(() => useGameStore.getState().checkMilestones(), 100);
  };

  const res = state.resources;
  const locked = loc.activities.filter((a) => a.minDay > res.day);
  const available = loc.activities.filter((a) => a.minDay <= res.day);
  const t = loc.theme;

  const viralPct = Math.round(Math.min(0.04 + res.creativity * 0.008, 0.26) * 100);
  const flopPct = Math.round(Math.max(0.24 - res.creativity * 0.008, 0.08) * 100);

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${t.gradient}`}>
      <button onClick={() => setScreen("map")} className="text-xs text-text-muted hover:text-text-secondary transition-colors">← Back to Map</button>

      {/* Location header */}
      <div className="relative flex items-center gap-4 overflow-hidden rounded-card border border-white/10 p-4" style={{ background: `linear-gradient(135deg, ${t.accent}1a, transparent)` }}>
        <LocationScene id={loc.id} size={64} color={t.accent} className="opacity-90 shrink-0" />
        <div className="relative z-10">
          <p className="text-xl font-bold text-white">{loc.name}</p>
          <p className="text-xs text-text-secondary">{loc.description}</p>
        </div>
      </div>

      {/* Energy */}
      <ProgressBar value={res.energy} max={res.maxEnergy} color={t.accent} label="Energy" />
      {res.energy === 0 && <p className="text-accent-amber text-xs">⚠️ No energy left — end the day to recover</p>}

      {/* Activities */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Activities</p>
        {available.map((act) => {
          const canDo = res.energy >= act.energyCost;
          const isHovered = hoveredId === act.id;
          return (
            <button
              key={act.id}
              onClick={(e) => handleAct(e, act)}
              disabled={!canDo}
              onMouseEnter={() => setHoveredId(act.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`w-full text-left flex items-center justify-between p-4 rounded-card-sm border transition-all active:scale-[0.97] ${canDo ? "cursor-pointer" : "opacity-35 cursor-not-allowed"}`}
              style={{
                background: canDo ? (isHovered ? `${t.accent}22` : t.surface) : "rgba(255,255,255,0.02)",
                borderColor: canDo ? (isHovered ? `${t.accent}44` : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: canDo ? `${t.accent}22` : "rgba(255,255,255,0.05)" }}>
                  {CATEGORY_ICONS[act.category] ?? "📋"}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${canDo ? "text-white" : "text-text-secondary"}`}>{act.name}</p>
                  <p className={`text-xs ${canDo ? "text-text-secondary" : "text-text-muted"}`}>{act.description}</p>
                  <p className="text-[10px] mt-1 flex gap-2">
                    <span className="text-accent-fuchsia">Viral {viralPct}%</span>
                    <span className="text-error">Flop {flopPct}%</span>
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono px-2.5 py-1 rounded-lg" style={{ background: canDo ? `${t.accent}22` : "rgba(255,255,255,0.05)", color: canDo ? t.accent : "rgba(255,255,255,0.15)" }}>
                -{act.energyCost}⚡
              </div>
            </button>
          );
        })}
      </div>

      {/* Locked */}
      {locked.length > 0 && (
        <div className="bg-white/[0.03] rounded-card-sm p-4 border border-white/5">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Coming Soon</p>
          <div className="space-y-2">
            {locked.map((act) => (
              <div key={act.id} className="flex items-center justify-between text-sm">
                <span className="text-white/30">{act.name}</span>
                <span className="text-text-muted text-xs">Day {act.minDay}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}