import { useGameStore } from "@game/state/gameStore";
import { LOCATIONS } from "@game/data/locations";
import { NPCS } from "@game/data/npcs";
import type { LocationId } from "@game/types";
import { Card, StatCard, IconBox } from "@ui/index";
import { CharacterPortrait, NPC_PORTRAITS } from "@assets/characters";
import { audio } from "@lib/audio";

export function MapScreen() {
  const state = useGameStore((s) => s.state);
  const goToLocation = useGameStore((s) => s.goToLocation);
  const setScreen = useGameStore((s) => s.setScreen);
  const showToast = useGameStore((s) => s.showToast);
  const res = state.resources;
  const playerName = state.playerName || "Creator";

  const mainLocations = LOCATIONS.filter((l) => l.id !== "home");
  const specialLocations = LOCATIONS.filter((l) => l.id === "home");

  const handleGoTo = (id: LocationId) => {
    const msg = goToLocation(id);
    if (msg) {
      audio.play("fail");
      showToast(msg, "warning");
    } else {
      audio.play("open");
      setScreen("story");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Hero Stats */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
            👤
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{playerName}</p>
            <p className="text-xs text-text-secondary">Day {res.day} · {res.followers} followers · ${res.money} · {res.reputation}% rep</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          <StatCard label="Energy" value={<><span className="text-accent-cyan">{res.energy}</span><span className="text-xs text-text-muted">/{res.maxEnergy}</span></>} />
          <StatCard label="Followers" value={res.followers} />
          <StatCard label="Money" value={<span className="text-accent-emerald">${res.money}</span>} />
          <StatCard label="Creativity" value={<span className="text-accent-purple">{res.creativity}</span>} />
        </div>
      </Card>

      {/* First-day hint */}
      {res.day <= 2 && state.completedActivities.length === 0 && (
        <div className="rounded-card border border-accent-cyan/30 bg-accent-cyan/[0.06] px-4 py-3 text-xs text-text-secondary animate-fadeIn">
          <span className="text-accent-cyan font-semibold">How to play:</span> Tap a location → do activities to grow → <span className="text-white">End Day</span> to recover. Post daily or the algorithm eats your followers!
        </div>
      )}

      {/* Character faces */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {NPCS.map((npc) => {
          const met = state.flags[`met_${npc.id}`];
          const rel = state.relationships[npc.id] ?? 0;
          const portrait = NPC_PORTRAITS[npc.id];
          return (
            <div key={npc.id} className={`shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 border ${met ? "bg-white/[0.04] border-white/10" : "bg-white/[0.02] border-white/5 opacity-50"}`}>
              {portrait ? (
                <CharacterPortrait config={portrait} expression={met ? (rel >= 0 ? "happy" : "sad") : "neutral"} size={32} />
              ) : (
                <span className="text-lg">{npc.icon}</span>
              )}
              <div>
                <p className="text-xs font-semibold text-white">{met ? npc.name : "???"}</p>
                <p className={`text-[10px] ${met ? (rel >= 0 ? "text-accent-emerald" : "text-error") : "text-text-muted"}`}>
                  {met ? (rel >= 0 ? `+${rel}` : rel) : "Not met"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Home */}
      {specialLocations.map((loc) => {
        const hasEvent = state.pendingEvents.some((e) => e.locationId === loc.id && e.triggerDay <= res.day);
        const isHere = state.currentLocation === loc.id;
        return (
          <button
            key={loc.id}
            onClick={() => handleGoTo(loc.id)}
            className={`w-full flex items-center gap-4 p-5 rounded-card border transition-all active:scale-[0.98] ${isHere ? "" : "bg-white/[0.04] border-white/10 hover:bg-white/[0.06]"}`}
            style={isHere ? { background: loc.theme.surface, borderColor: loc.theme.accent + "66" } : undefined}
          >
            <div className="relative">
              <IconBox size="lg" color={loc.theme.accent}>{loc.icon}</IconBox>
              {hasEvent && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />}
            </div>
            <div className="text-left flex-1">
              <p className="text-lg font-bold text-white">{loc.name}</p>
              <p className="text-xs text-text-secondary">{loc.description}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-lg`} style={isHere ? { background: loc.theme.accent + "33", color: loc.theme.accent } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
              {isHere ? "HERE" : "GO"}
            </span>
          </button>
        );
      })}

      {/* Other locations grid */}
      <div className="grid grid-cols-2 gap-3">
        {mainLocations.filter((l) => l.unlockedDay <= res.day).map((loc) => {
          const hasEvent = state.pendingEvents.some((e) => e.locationId === loc.id && e.triggerDay <= res.day);
          const isHere = state.currentLocation === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => handleGoTo(loc.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-all active:scale-[0.96] ${isHere ? "" : "bg-white/[0.04] border-white/10 hover:bg-white/[0.06] hover:border-white/20"}`}
              style={isHere ? { background: loc.theme.surface, borderColor: loc.theme.accent + "66" } : undefined}
            >
              <div className="relative">
                <IconBox size="md" color={loc.theme.accent}>{loc.icon}</IconBox>
                {hasEvent && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />}
              </div>
              <p className="text-sm font-semibold text-white">{loc.name}</p>
              <p className="text-[10px] text-text-muted text-center leading-tight">{loc.description}</p>
            </button>
          );
        })}
      </div>

      {/* Locked locations */}
      <div className="grid grid-cols-2 gap-3">
        {mainLocations.filter((l) => l.unlockedDay > res.day).map((loc) => (
          <div key={loc.id} className="flex flex-col items-center gap-2 p-4 rounded-card border border-white/5 bg-white/[0.02] opacity-40">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] flex items-center justify-center text-2xl grayscale">{loc.icon}</div>
            <p className="text-sm font-semibold text-text-secondary">{loc.name}</p>
            <p className="text-[10px] text-text-muted">Day {loc.unlockedDay}</p>
          </div>
        ))}
      </div>

      {/* End Day */}
      <button
        onClick={() => {
          useGameStore.getState().endDay();
          showToast("New day begun! Energy restored.", "info");
        }}
        className="w-full py-4 rounded-card text-sm font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30 transition-all active:scale-[0.98]"
      >
        🌙 End Day — Recover Energy
      </button>
    </div>
  );
}