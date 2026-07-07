import { useEffect, useState } from "react";
import type { JSX } from "react";
import { GameShell } from "./components/GameShell";
import { DashboardScreen } from "./components/game/screens/DashboardScreen";
import { StudioScreen } from "./components/game/screens/StudioScreen";
import { AnalyticsScreen } from "./components/game/screens/AnalyticsScreen";
import { SettingsScreen } from "./components/game/screens/SettingsScreen";
import { useGameStore } from "./game/state/gameStore";
import { startGameLoop, stopGameLoop } from "./game/engine/GameLoop";
import { loadGame, hasSave } from "./game/save/SaveManager";
import type { ScreenId } from "./game/types";

const screenComponents: Record<ScreenId, () => JSX.Element> = {
  dashboard: DashboardScreen,
  studio: StudioScreen,
  analytics: AnalyticsScreen,
  settings: SettingsScreen,
};

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasSave()) {
      loadGame();
    }
    startGameLoop();
    setReady(true);

    return () => {
      stopGameLoop();
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-dvh bg-[#0a0a1a]">
        <div className="text-center space-y-2">
          <div className="text-4xl animate-pulse text-cyan-400">✦</div>
          <p className="text-sm text-white/40 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  const Screen = screenComponents[currentScreen];

  return (
    <GameShell>
      <Screen />
    </GameShell>
  );
}
