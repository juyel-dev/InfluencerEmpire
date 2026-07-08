import type { ScreenId } from "@game/types";
import { useGameStore } from "@game/state/gameStore";

const navItems: { id: ScreenId; label: string; icon: string }[] = [
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "story", label: "Story", icon: "📖" },
  { id: "journal", label: "Journal", icon: "📓" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <nav className="bg-black/60 backdrop-blur-2xl border-t border-white/10 flex shrink-0">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-all active:scale-[0.95] ${
            screen === item.id ? "text-accent-cyan" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <span className="text-base">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}