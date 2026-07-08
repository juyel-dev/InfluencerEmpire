import type { GameState, DaySummary } from "../types";

export function computeDaySummary(state: GameState): DaySummary {
  const start = state.dayStartResources;
  const current = state.resources;
  return {
    day: current.day,
    followersDelta: current.followers - start.followers,
    moneyDelta: current.money - start.money,
    reputationDelta: current.reputation - start.reputation,
    creativityDelta: current.creativity - start.creativity,
    activitiesDone: state.completedActivities.length,
  };
}
