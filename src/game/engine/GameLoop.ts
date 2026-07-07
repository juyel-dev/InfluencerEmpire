import type { ContentDraft } from "../types";
import { GAME } from "../data/constants";
import { usePlayerStore } from "../state/playerStore";
import { useGameStore } from "../state/gameStore";
import { advanceTime } from "./TimeManager";
import { saveGame } from "../save/SaveManager";

let tickInterval: ReturnType<typeof setInterval> | null = null;

export function startGameLoop() {
  if (tickInterval) return;

  tickInterval = setInterval(() => {
    const gameStore = useGameStore.getState();
    if (!gameStore.isRunning) return;

    const newTime = advanceTime(gameStore.gameTime);
    gameStore.setGameTime(newTime);
    gameStore.incrementTick();

    const playerStore = usePlayerStore.getState();
    playerStore.collectPassiveIncome();
    playerStore.tickContent();

    if (gameStore.tickCount % GAME.AUTO_SAVE_INTERVAL_TICKS === 0) {
      saveGame();
    }
  }, GAME.TICK_INTERVAL_MS);
}

export function stopGameLoop() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

export function publishContent(draft: ContentDraft) {
  const piece = usePlayerStore.getState().publishContent(draft);
  const gameStore = useGameStore.getState();
  const updatedContent = usePlayerStore.getState().content.map((c) =>
    c.id === piece.id ? { ...c, createdAt: gameStore.gameTime, status: "published" as const } : c
  );
  usePlayerStore.setState({ content: updatedContent });
  return piece;
}
