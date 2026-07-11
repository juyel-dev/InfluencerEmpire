/**
 * Central balance configuration (constitution D-006).
 * All gameplay tuning numbers live here so content/balance changes
 * never require edits to resolver or store logic.
 * Imported by activities.ts (outcome math) and gameStore slices (economy).
 */

export const BALANCE = {
  outcome: {
    viralBaseChance: 0.04,
    viralCreativityFactor: 0.008,
    viralChanceCap: 0.26,
    flopBaseChance: 0.24,
    flopCreativityFactor: 0.008,
    flopChanceFloor: 0.08,
    scaleViral: 2.3,
    scaleFlop: 0.3,
  },
  mega: {
    chance: 0.16,
    followerMultiplier: 2.2,
    moneyMultiplier: 1.5,
    reputationMultiplier: 1.5,
  },
  economy: {
    baseUpkeep: 2,
    idleChurnRate: 0.04,
    bankruptcyThreshold: -50,
  },
  randomEvent: {
    baseChance: 0.35,
    perDayChance: 0.02,
    maxBonus: 0.25,
  },
} as const;

export type Balance = typeof BALANCE;
