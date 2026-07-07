import { create } from "zustand";
import type { ScreenId, Notification, GameTime, Milestone, GameSettings } from "../types";
import { createInitialGameTime, createInitialMilestones, createInitialSettings } from "../data/startingState";

interface GameStore {
  currentScreen: ScreenId;
  previousScreen: ScreenId | null;
  gameTime: GameTime;
  notifications: Notification[];
  milestones: Milestone[];
  settings: GameSettings;
  isRunning: boolean;
  tickCount: number;

  setScreen: (screen: ScreenId) => void;
  setGameTime: (time: GameTime) => void;
  addNotification: (notification: Notification) => void;
  setMilestone: (id: string, reached: boolean) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setIsRunning: (running: boolean) => void;
  incrementTick: () => void;
  loadFromSave: (data: { gameTime: GameTime; milestones: Milestone[]; settings: GameSettings }) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScreen: "dashboard",
  previousScreen: null,
  gameTime: createInitialGameTime(),
  notifications: [],
  milestones: createInitialMilestones(),
  settings: createInitialSettings(),
  isRunning: true,
  tickCount: 0,

  setScreen: (screen) => set({ previousScreen: get().currentScreen, currentScreen: screen }),

  setGameTime: (gameTime) => set({ gameTime }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications].slice(0, 50),
  })),

  setMilestone: (id, reached) => set((state) => ({
    milestones: state.milestones.map((m) => (m.id === id ? { ...m, reached } : m)),
  })),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),

  setIsRunning: (isRunning) => set({ isRunning }),

  incrementTick: () => set((state) => ({ tickCount: state.tickCount + 1 })),

  loadFromSave: (data) => set({
    gameTime: data.gameTime,
    milestones: data.milestones,
    settings: data.settings,
  }),

  reset: () => set({
    currentScreen: "dashboard",
    previousScreen: null,
    gameTime: createInitialGameTime(),
    notifications: [],
    milestones: createInitialMilestones(),
    settings: createInitialSettings(),
    isRunning: true,
    tickCount: 0,
  }),
}));
