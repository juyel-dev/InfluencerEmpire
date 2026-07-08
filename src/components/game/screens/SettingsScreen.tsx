import { useGameStore } from "@game/state/gameStore";
import { Card } from "@ui/index";
import { audio } from "@lib/audio";

export function SettingsScreen() {
  const resetGame = useGameStore((s) => s.resetGame);
  const soundOn = audio.isEnabled();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Game options</p>
      </div>

      <Card>
        <div>
          <p className="text-sm font-semibold text-white">About</p>
          <p className="text-xs text-text-secondary mt-1">Influencer Empire — Narrative RPG v1.0</p>
          <p className="text-xs text-text-muted mt-0.5">Build relationships, create content, rise to fame.</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Sound</p>
            <p className="text-xs text-text-muted mt-0.5">SFX & feedback</p>
          </div>
          <button
            onClick={() => {
              const on = audio.toggle();
              if (on) audio.play("success");
            }}
            className={`relative w-14 h-8 rounded-full transition-colors ${soundOn ? "bg-accent-cyan/70" : "bg-white/10"}`}
            aria-label="Toggle sound"
          >
            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${soundOn ? "left-7" : "left-1"}`} />
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              if (confirm("Reset everything? This cannot be undone.")) {
                resetGame();
              }
            }}
            className="w-full py-2.5 rounded-button text-sm font-semibold bg-error/10 text-error border border-error/30 hover:bg-error/20 transition-all active:scale-[0.97]"
          >
            Reset Game
          </button>
        </div>
      </Card>
    </div>
  );
}
