import { useGameStore } from "../../../game/state/gameStore";
import type { ScreenId } from "../../../game/types";

const navItems: { id: ScreenId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Home", icon: "🏠" },
  { id: "studio", label: "Studio", icon: "🎬" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <nav className="bg-black/40 backdrop-blur-2xl border-t border-white/10 px-2 py-1 flex items-center justify-around shrink-0">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-white/5 active:scale-95 ${
              isActive ? "text-cyan-400" : "text-white/40 hover:text-white/70"
            }`}
            aria-label={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
