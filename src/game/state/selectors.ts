import { useGameStore } from "./gameStore";

/**
 * Granular selector hooks (blueprint P0-5). Each subscribes to a single
 * stable slice of GameState, so a component only re-renders when the
 * specific field it reads changes identity (Zustand reference equality).
 * Prefer these over `useGameStore((s) => s.state)` in screens.
 */

export const useResources = () => useGameStore((s) => s.state.resources);
export const usePlayerName = () => useGameStore((s) => s.state.playerName);
export const useFlags = () => useGameStore((s) => s.state.flags);
export const useRelationships = () => useGameStore((s) => s.state.relationships);
export const usePendingEvents = () => useGameStore((s) => s.state.pendingEvents);
export const useCurrentLocation = () => useGameStore((s) => s.state.currentLocation);
export const useCompletedActivities = () => useGameStore((s) => s.state.completedActivities);
export const useScreen = () => useGameStore((s) => s.screen);
export const useDaySummary = () => useGameStore((s) => s.daySummary);
export const useViralMoment = () => useGameStore((s) => s.viralMoment);
