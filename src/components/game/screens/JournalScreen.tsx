import { useGameStore } from "@game/state/gameStore";
import { NPCS } from "@game/data/npcs";
import { Card, StatCard, EmptyState } from "@ui/index";
import { CharacterPortrait, NPC_PORTRAITS } from "@assets/characters";

export function JournalScreen() {
  const state = useGameStore((s) => s.state);
  const journal = state.journal;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">Journal</h1>
        <p className="text-sm text-text-secondary mt-0.5">Your story so far</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Day" value={<span className="text-2xl text-white">{state.resources.day}</span>} />
        <StatCard label="Followers" value={<span className="text-2xl text-accent-cyan">{state.resources.followers}</span>} />
        <StatCard label="Money" value={<span className="text-2xl text-accent-emerald">${state.resources.money}</span>} />
        <StatCard label="Creativity" value={<span className="text-2xl text-accent-purple">{state.resources.creativity}</span>} />
      </div>

      {/* Relationships */}
      <Card>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Relationships</h2>
        <div className="space-y-2">
          {NPCS.map((npc) => {
            const rel = state.relationships[npc.id] ?? 0;
            const met = state.flags[`met_${npc.id}`];
            const barWidth = Math.min(100, Math.max(0, ((rel + 30) / 60) * 100));
            return (
              <div key={npc.id} className={`flex items-center gap-3 py-1.5 ${!met ? "opacity-40" : ""}`}>
                {met && NPC_PORTRAITS[npc.id] ? (
                  <CharacterPortrait config={NPC_PORTRAITS[npc.id]} expression={rel >= 0 ? "happy" : "sad"} size={32} className="shrink-0" />
                ) : (
                  <span className="text-xl w-8 text-center">❓</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{met ? npc.name : "???"}</p>
                    <span className={`text-xs font-mono ${rel >= 0 ? "text-accent-emerald" : "text-error"}`}>
                      {met ? (rel >= 0 ? `+${rel}` : rel) : "?"}
                    </span>
                  </div>
                  {met && (
                    <div className="w-full h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${rel >= 0 ? "bg-gradient-to-r from-accent-emerald to-accent-emerald" : "bg-gradient-to-r from-error to-error"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-text-muted mt-0.5">{met ? npc.description : "Not met yet"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Story Log */}
      <Card>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Story Log</h2>
        {journal.length === 0 ? (
          <EmptyState title="No entries yet" description="Your story will appear here as you play." iconClassName="text-text-muted" />
        ) : (
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {[...journal].reverse().map((entry) => (
              <div key={entry.id} className="py-2 border-b border-white/[0.03] last:border-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    entry.type === "story" ? "bg-accent-purple" : entry.type === "activity" ? "bg-accent-cyan" : "bg-white/20"
                  }`} />
                  <span className={`text-[10px] font-medium ${
                    entry.type === "story" ? "text-accent-purple/70" : entry.type === "activity" ? "text-accent-cyan/70" : "text-text-muted"
                  }`}>
                    Day {entry.day}
                  </span>
                </div>
                <p className="text-xs text-white/70 ml-3.5">{entry.text}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}