import type { GameState, Resources, NpcId, LocationId } from "../types";
import { STORY_EVENTS } from "../data/story";

export function createInitialState(): GameState {
  const initialResources: Resources = {
    followers: 0,
    money: 20,
    energy: 10,
    maxEnergy: 10,
    reputation: 0,
    creativity: 5,
    day: 1,
  };
  return {
    resources: initialResources,
    dayStartResources: initialResources,
    currentLocation: "home",
    flags: {},
    relationships: { zara: 0, leo: 0, maya: 0, omar: 0, ava: 0 },
    visitedLocations: ["home"],
    completedActivities: [],
    seenDialogueNodes: [],
    activeDialogueNodeId: null,
    activeNpcId: null,
    journal: [
      {
        id: "start",
        day: 1,
        text: "Day 1. I'm going to make it as a creator. Time to get to work.",
        type: "system",
      },
    ],
    pendingEvents: STORY_EVENTS.map((e) => ({ ...e })),
    reachedMilestones: [],
    won: false,
    lost: false,
    playerName: "",
  };
}

export const NPC_IDS: NpcId[] = ["zara", "leo", "maya", "omar", "ava"];
export const KNOWN_LOCATIONS: LocationId[] = [
  "home",
  "studio",
  "gym",
  "cafe",
  "club",
  "mall",
];
