import { describe, it, expect } from "vitest";
import { computeDaySummary } from "./summary";
import type { GameState, Resources } from "../types";

function makeState(overrides?: Partial<GameState>): GameState {
  const baseResources: Resources = { followers: 0, money: 20, energy: 10, maxEnergy: 10, reputation: 0, creativity: 5, day: 1 };
  return {
    resources: { ...baseResources },
    dayStartResources: { ...baseResources },
    currentLocation: "home",
    flags: {},
    relationships: { zara: 0, leo: 0, maya: 0, omar: 0, ava: 0 },
    visitedLocations: ["home"],
    completedActivities: [],
    seenDialogueNodes: [],
    activeDialogueNodeId: null,
    activeNpcId: null,
    journal: [],
    pendingEvents: [],
    reachedMilestones: [],
    won: false,
    ...overrides,
  };
}

describe("computeDaySummary", () => {
  it("returns zero deltas and zero activities when nothing changed", () => {
    const state = makeState();
    const result = computeDaySummary(state);
    expect(result.day).toBe(1);
    expect(result.followersDelta).toBe(0);
    expect(result.moneyDelta).toBe(0);
    expect(result.reputationDelta).toBe(0);
    expect(result.creativityDelta).toBe(0);
    expect(result.activitiesDone).toBe(0);
  });

  it("computes positive deltas correctly", () => {
    const state = makeState({
      resources: { followers: 0, money: 20, energy: 10, maxEnergy: 10, reputation: 0, creativity: 5, day: 1 },
      dayStartResources: { followers: 0, money: 20, energy: 10, maxEnergy: 10, reputation: 0, creativity: 5, day: 1 },
    });
    state.resources.followers = 50;
    state.resources.money = 35;
    state.resources.reputation = 10;
    state.resources.creativity = 8;
    state.completedActivities = ["create_video", "go_gym"];

    const result = computeDaySummary(state);
    expect(result.followersDelta).toBe(50);
    expect(result.moneyDelta).toBe(15);
    expect(result.reputationDelta).toBe(10);
    expect(result.creativityDelta).toBe(3);
    expect(result.activitiesDone).toBe(2);
  });

  it("computes negative deltas correctly", () => {
    const state = makeState({
      dayStartResources: { followers: 100, money: 50, energy: 10, maxEnergy: 10, reputation: 20, creativity: 10, day: 2 },
    });
    state.resources.followers = 80;
    state.resources.money = 30;
    state.resources.reputation = 15;
    state.resources.creativity = 5;

    const result = computeDaySummary(state);
    expect(result.followersDelta).toBe(-20);
    expect(result.moneyDelta).toBe(-20);
    expect(result.reputationDelta).toBe(-5);
    expect(result.creativityDelta).toBe(-5);
  });
});
