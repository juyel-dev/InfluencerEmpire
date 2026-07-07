import { create } from "zustand";
import type { PlayerState, ContentPiece, ContentDraft } from "../types";
import { createInitialPlayerState } from "../data/startingState";
import { FOLLOWERS, CONTENT, REPUTATION } from "../data/constants";
import { levelFromFollowers } from "../utils/progression";
import { clamp } from "../utils/math";
import { calculateAlgorithm, calculateReach, calculateFollowersFromReach, calculateMoneyFromReach } from "../systems/algorithm";
import { applyContentDecay } from "../systems/contentDecay";
import { UPGRADES } from "../data/upgrades";
import type { UpgradeDef } from "../data/upgrades";

interface PlayerStore {
  player: PlayerState;
  content: ContentPiece[];

  reset: () => void;
  loadFromSave: (data: { player: PlayerState; content: ContentPiece[] }) => void;
  publishContent: (draft: ContentDraft) => ContentPiece;
  tickContent: () => { followersGained: number; moneyEarned: number };
  collectPassiveIncome: () => number;
  canAffordUpgrade: (upgrade: UpgradeDef) => boolean;
  purchaseUpgrade: (upgrade: UpgradeDef) => boolean;
  getQualityBonus: () => number;
}

let nextContentId = 1;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: createInitialPlayerState(),
  content: [],

  reset: () => set({ player: createInitialPlayerState(), content: [] }),

  loadFromSave: (data) => set({ player: data.player, content: data.content }),

  publishContent: (draft) => {
    const state = get();
    const qualityBonus = calculateQualityBonus(state.player.ownedUpgrades);
    const finalQuality = clamp(draft.quality + qualityBonus, 1, 20);

    const piece: ContentPiece = {
      id: `content_${nextContentId++}`,
      title: draft.title,
      type: draft.type,
      quality: finalQuality,
      views: 0,
      followersGained: 0,
      moneyEarned: 0,
      engagement: 0,
      createdAt: { day: 0, hour: 0, totalHours: 0 },
      status: "publishing",
      trendBoost: 1.0 + Math.random() * 0.5,
    };

    set((state) => ({
      content: [piece, ...state.content],
      player: {
        ...state.player,
        experience: state.player.experience + finalQuality * 2,
        hoursSinceLastPost: 0,
      },
    }));

    return piece;
  },

  tickContent: () => {
    const state = get();
    let totalFollowersGained = 0;
    let totalMoneyEarned = 0;

    const algorithm = calculateAlgorithm(state.content, state.player, state.player.hoursSinceLastPost);

    const updatedContent = applyContentDecay(state.content).map((piece) => {
      if (piece.status !== "published") return piece;

      const newViews = calculateReach(piece, algorithm, state.player.followers);
      const totalViews = piece.views + newViews;
      const newFollowers = calculateFollowersFromReach(newViews);
      const newMoney = calculateMoneyFromReach(newViews);

      totalFollowersGained += newFollowers;
      totalMoneyEarned += newMoney;

      return {
        ...piece,
        views: totalViews,
        followersGained: piece.followersGained + newFollowers,
        moneyEarned: piece.moneyEarned + newMoney,
        engagement: clamp(totalViews * CONTENT.ENGAGEMENT_RATE, 0, totalViews),
      };
    });

    const repGain = totalFollowersGained * REPUTATION.GAIN_PER_FOLLOWER + (totalFollowersGained > 0 ? REPUTATION.GAIN_PER_CONTENT : 0);

    set((state) => ({
      content: updatedContent,
      player: {
        ...state.player,
        followers: state.player.followers + totalFollowersGained,
        totalFollowersEarned: state.player.totalFollowersEarned + totalFollowersGained,
        money: state.player.money + totalMoneyEarned,
        totalMoneyEarned: state.player.totalMoneyEarned + totalMoneyEarned,
        reputation: clamp(state.player.reputation + repGain, 0, REPUTATION.MAX),
        level: levelFromFollowers(state.player.followers + totalFollowersGained),
        algorithmScore: Math.round(algorithm.score),
        hoursSinceLastPost: state.player.hoursSinceLastPost + 1,
      },
    }));

    return { followersGained: totalFollowersGained, moneyEarned: totalMoneyEarned };
  },

  collectPassiveIncome: () => {
    const state = get();
    const incomeMultiplier = calculateIncomeMultiplier(state.player.ownedUpgrades);
    const income = state.player.followers * FOLLOWERS.PASSIVE_INCOME_PER_FOLLOWER * incomeMultiplier;
    set((state) => ({
      player: {
        ...state.player,
        money: state.player.money + income,
        totalMoneyEarned: state.player.totalMoneyEarned + income,
      },
    }));
    return income;
  },

  canAffordUpgrade: (upgrade) => {
    const state = get();
    return state.player.money >= upgrade.cost && state.player.level >= upgrade.requiredLevel && !state.player.ownedUpgrades.includes(upgrade.id);
  },

  purchaseUpgrade: (upgrade) => {
    const state = get();
    if (!state.canAffordUpgrade(upgrade)) return false;

    set((state) => ({
      player: {
        ...state.player,
        money: state.player.money - upgrade.cost,
        ownedUpgrades: [...state.player.ownedUpgrades, upgrade.id],
      },
    }));
    return true;
  },

  getQualityBonus: () => {
    return calculateQualityBonus(get().player.ownedUpgrades);
  },
}));

function calculateQualityBonus(ownedUpgrades: string[]): number {
  return UPGRADES
    .filter((u) => ownedUpgrades.includes(u.id) && u.effects.qualityBonus)
    .reduce((sum, u) => sum + (u.effects.qualityBonus ?? 0), 0);
}

function calculateIncomeMultiplier(ownedUpgrades: string[]): number {
  const bonus = UPGRADES
    .filter((u) => ownedUpgrades.includes(u.id) && u.effects.incomeMultiplier)
    .reduce((sum, u) => sum + (u.effects.incomeMultiplier ?? 0), 0);
  return 1 + bonus;
}
