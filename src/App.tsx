import { useEffect, useState } from "react";
import type { JSX } from "react";
import { GameShell } from "./components/GameShell";
import { MapScreen } from "./components/game/screens/MapScreen";
import { StoryScreen } from "./components/game/screens/StoryScreen";
import { JournalScreen } from "./components/game/screens/JournalScreen";
import { SettingsScreen } from "./components/game/screens/SettingsScreen";
import { AnimatedScreen } from "./components/game/shared/AnimatedScreen";
import { LoadingState } from "./components/ui/LoadingState";
import { useGameStore } from "./game/state/gameStore";
import type { ScreenId } from "./game/types";

const screenComponents: Record<ScreenId, () => JSX.Element> = {
  map: MapScreen,
  story: StoryScreen,
  journal: JournalScreen,
  settings: SettingsScreen,
};

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const loadGame = useGameStore((s) => s.loadGame);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = loadGame();
    if (!loaded) {
      useGameStore.getState().showToast("Welcome to Influencer Empire! Start at the Studio.", "info");
    }
    setLoading(false);
  }, [loadGame]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-bg-primary">
        <LoadingState message="Loading empire..." size={80} />
      </div>
    );
  }

  const Screen = screenComponents[screen];

  return (
    <GameShell>
      <AnimatedScreen key={screen}>
        <Screen />
      </AnimatedScreen>
    </GameShell>
  );
}
