import { useState } from "react";
import { useGameStore } from "../../../game/state/gameStore";
import { usePlayerStore } from "../../../game/state/playerStore";
import { saveGame, loadGame, deleteSave, hasSave } from "../../../game/save/SaveManager";

export function SettingsScreen() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const reset = useGameStore((s) => s.reset);
  const resetPlayer = usePlayerStore((s) => s.reset);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "loaded" | "error">("idle");

  const handleSave = () => {
    const result = saveGame();
    setSaveStatus(result ? "saved" : "error");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleLoad = () => {
    const result = loadGame();
    setSaveStatus(result ? "loaded" : "error");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleReset = () => {
    if (window.confirm("This will delete all progress. Are you sure?")) {
      deleteSave();
      resetPlayer();
      reset();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Game configuration</p>
      </div>
      <div className="max-w-2xl space-y-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-4 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Save / Load</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-xl text-sm font-medium bg-cyan-400 text-black hover:brightness-110 active:scale-[0.98] transition-all">Save Game</button>
            <button onClick={handleLoad} disabled={!hasSave()} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed">Load Game</button>
            <button onClick={handleReset} className="px-4 py-2 rounded-xl text-sm font-medium border border-red-400/30 text-red-400 hover:bg-red-400/10 active:scale-[0.98] transition-all">Reset All Data</button>
          </div>
          {saveStatus === "saved" && <p className="text-xs text-green-400">Game saved!</p>}
          {saveStatus === "loaded" && <p className="text-xs text-green-400">Game loaded!</p>}
          {saveStatus === "error" && <p className="text-xs text-red-400">Operation failed</p>}
        </div>
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-4 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Preferences</h2>
          <div className="space-y-3">
            <ToggleRow label="Dark Mode" value={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} />
            <div className="space-y-1">
              <label className="text-xs text-white/50">Auto-Save Interval (ticks)</label>
              <input type="number" value={settings.autoSaveInterval} onChange={(e) => updateSettings({ autoSaveInterval: Math.max(5, Math.min(120, Number(e.target.value))) })} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-400/50 w-24 transition-all" min={5} max={120} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 space-y-2 border border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">About</h2>
          <p className="text-sm text-white/50">Influencer Empire v0.1</p>
          <p className="text-sm text-white/30">Build your influence from 3 followers to global stardom.</p>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-white/70">{label}</span>
      <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-colors relative ${value ? "bg-cyan-400" : "bg-white/20"}`} role="switch" aria-checked={value}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value && "translate-x-5"}`} />
      </button>
    </div>
  );
}
