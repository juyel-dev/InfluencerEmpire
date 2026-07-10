import type { ReactNode } from "react";
import { useGameStore } from "@game/state/gameStore";

const gradients: Record<string, string> = {
  map: "from-accent-cyan/[0.03] via-transparent to-accent-purple/[0.03]",
  story: "from-accent-purple/[0.03] via-transparent to-accent-cyan/[0.03]",
  journal: "from-accent-emerald/[0.03] via-transparent to-accent-cyan/[0.03]",
  settings: "from-accent-amber/[0.02] via-transparent to-error/[0.02]",
};

export function AnimatedScreen({ children }: { children: ReactNode }) {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-screenIn">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[screen] ?? gradients.map} pointer-events-none transition-opacity duration-500`} />
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}