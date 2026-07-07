import type { ReactNode } from "react";
import { TopBar } from "./game/hud/TopBar";
import { BottomNav } from "./game/hud/BottomNav";

interface GameShellProps {
  children: ReactNode;
}

export function GameShell({ children }: GameShellProps) {
  return (
    <div className="flex flex-col h-dvh max-h-dvh bg-[#0a0a1a]">
      <TopBar />
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
