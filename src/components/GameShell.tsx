import type { ReactNode } from "react";
import { TopBar } from "./game/hud/TopBar";
import { BottomNav } from "./game/hud/BottomNav";
import { ToastContainer } from "./game/shared/ToastContainer";
import { FloatLayer } from "./game/shared/FloatLayer";
import { Confetti } from "./game/shared/Confetti";
import { DaySummaryOverlay } from "./game/overlays/DaySummaryOverlay";
import { IntroScreen } from "./game/overlays/IntroScreen";
import { EndScreen } from "./game/overlays/EndScreen";
import { ViralMomentOverlay } from "./game/overlays/ViralMomentOverlay";

interface GameShellProps {
  children: ReactNode;
}

export function GameShell({ children }: GameShellProps) {
  return (
    <div className="flex flex-col h-dvh max-h-dvh bg-bg-primary relative">
      <TopBar />
      <main className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
      <FloatLayer />
      <Confetti />
      <DaySummaryOverlay />
      <EndScreen />
      <IntroScreen />
      <ViralMomentOverlay />
    </div>
  );
}