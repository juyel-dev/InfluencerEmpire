import type { SaveData } from "../types";
import { usePlayerStore } from "../state/playerStore";
import { useGameStore } from "../state/gameStore";
import { GAME } from "../data/constants";
import { migrateSaveData } from "./migration";

export function saveGame(): boolean {
  try {
    const playerState = usePlayerStore.getState();
    const gameState = useGameStore.getState();

    const saveData: SaveData = {
      version: GAME.SAVE_VERSION,
      timestamp: Date.now(),
      player: playerState.player,
      content: playerState.content,
      gameTime: gameState.gameTime,
      milestones: gameState.milestones,
      settings: gameState.settings,
    };

    localStorage.setItem(GAME.SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): boolean {
  try {
    const serialized = localStorage.getItem(GAME.SAVE_KEY);
    if (!serialized) return false;

    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    const saveData = migrateSaveData(parsed);
    if (!saveData) return false;

    usePlayerStore.getState().loadFromSave({
      player: saveData.player,
      content: saveData.content,
    });

    useGameStore.getState().loadFromSave({
      gameTime: saveData.gameTime,
      milestones: saveData.milestones,
      settings: saveData.settings,
    });

    return true;
  } catch {
    return false;
  }
}

export function deleteSave(): boolean {
  try {
    localStorage.removeItem(GAME.SAVE_KEY);
    usePlayerStore.getState().reset();
    useGameStore.getState().reset();
    return true;
  } catch {
    return false;
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(GAME.SAVE_KEY) !== null;
}
