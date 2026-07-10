import type { ScreenId } from "@game/types";
import { useGameStore } from "@game/state/gameStore";
import { audio } from "@lib/audio";

const navItems: { id: ScreenId; label: string; icon: string }[] = [
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "story", label: "Story", icon: "📖" },
  { id: "journal", label: "Journal", icon: "📓" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const activeIndex = navItems.findIndex((n) => n.id === screen);

  return (
    <nav className="relative bg-black/60 backdrop-blur-2xl border-t border-white/10 flex shrink-0">
      {/* Sliding active indicator */}
      <div
        className="absolute top-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple transition-transform duration-300 ease-out"
        style={{ width: `${100 / navItems.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
      />
      {navItems.map((item) => {
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (!active) audio.play("click");
              setScreen(item.id);
            }}
            aria-current={active ? "page" : undefined}
            className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-all active:scale-[0.95] ${
              active ? "text-accent-cyan" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <span className={`text-base transition-transform duration-200 ${active ? "scale-110" : ""}`}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
