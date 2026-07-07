import type { PlayerState, ContentPiece, GameTime, Milestone, GameSettings } from "../types";
import { FOLLOWERS, MONEY, TIME, LEVEL, REPUTATION } from "./constants";

export function createInitialPlayerState(): PlayerState {
  return {
    followers: FOLLOWERS.STARTING,
    totalFollowersEarned: 0,
    money: MONEY.STARTING,
    totalMoneyEarned: 0,
    level: LEVEL.STARTING_LEVEL,
    experience: LEVEL.STARTING_EXP,
    reputation: REPUTATION.STARTING,
    algorithmScore: 50,
    ownedUpgrades: [],
    hoursSinceLastPost: 0,
    equipment: [],
    currentEquipmentSlot: null,
  };
}

export function createInitialGameTime(): GameTime {
  return {
    day: TIME.START_DAY,
    hour: TIME.START_HOUR,
    totalHours: 0,
  };
}

export function createInitialContent(): ContentPiece[] {
  return [];
}

export function createInitialMilestones(): Milestone[] {
  return [
    { id: "first_post", name: "First Post", description: "Create your first content", icon: "🎬", requirement: 1, reached: false },
    { id: "ten_followers", name: "Getting Started", description: "Reach 10 followers", icon: "👥", requirement: 10, reached: false },
    { id: "hundred_followers", name: "Micro-Influencer", description: "Reach 100 followers", icon: "⭐", requirement: 100, reached: false },
    { id: "thousand_followers", name: "Rising Star", description: "Reach 1,000 followers", icon: "🌟", requirement: 1000, reached: false },
    { id: "ten_thousand", name: "Local Fame", description: "Reach 10,000 followers", icon: "🔥", requirement: 10000, reached: false },
    { id: "hundred_thousand", name: "Regional Star", description: "Reach 100,000 followers", icon: "💫", requirement: 100000, reached: false },
    { id: "million", name: "Internet Celebrity", description: "Reach 1,000,000 followers", icon: "👑", requirement: 1000000, reached: false },
  ];
}

export function createInitialSettings(): GameSettings {
  return {
    musicVolume: 50,
    sfxVolume: 50,
    autoSaveInterval: 30,
    darkMode: true,
  };
}
