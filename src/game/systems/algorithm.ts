import type { ContentPiece, PlayerState } from "../types";
import { clamp } from "../utils/math";

export interface AlgorithmState {
  score: number;
  viralBonus: number;
  consistencyPenalty: number;
}

const ALGORITHM = {
  BASE_SCORE: 50,
  MAX_SCORE: 100,
  VIRAL_THRESHOLD: 80,
  VIRAL_MULTIPLIER: 3,
  CONSISTENCY_HOURS: 48,
  CONSISTENCY_BONUS: 1.5,
  CONSISTENCY_PENALTY: 0.5,
  ENGAGEMENT_WEIGHT: 0.4,
  QUALITY_WEIGHT: 0.3,
  RECENCY_WEIGHT: 0.3,
} as const;

export function calculateAlgorithm(
  content: ContentPiece[],
  player: PlayerState,
  hoursSinceLastPost: number
): AlgorithmState {
  const publishedContent = content.filter((c) => c.status === "published");
  if (publishedContent.length === 0) {
    return { score: ALGORITHM.BASE_SCORE, viralBonus: 1, consistencyPenalty: 1 };
  }

  const recentContent = publishedContent.slice(0, 10);
  const avgEngagement = recentContent.reduce((s, c) => s + c.engagement, 0) / Math.max(recentContent.length, 1);
  const avgQuality = recentContent.reduce((s, c) => s + c.quality, 0) / Math.max(recentContent.length, 1);
  const engagementScore = clamp(avgEngagement / 100, 0, 1) * ALGORITHM.ENGAGEMENT_WEIGHT;
  const qualityScore = clamp(avgQuality / 10, 0, 1) * ALGORITHM.QUALITY_WEIGHT;
  const followerFactor = Math.log10(Math.max(player.followers, 1)) / 10;
  const recencyScore = clamp(followerFactor, 0, 1) * ALGORITHM.RECENCY_WEIGHT;

  const rawScore = (engagementScore + qualityScore + recencyScore) * 100;
  const score = clamp(rawScore, 10, ALGORITHM.MAX_SCORE);

  const isViral = score >= ALGORITHM.VIRAL_THRESHOLD;
  const viralBonus = isViral ? ALGORITHM.VIRAL_MULTIPLIER : 1;

  const consistencyPenalty = hoursSinceLastPost < ALGORITHM.CONSISTENCY_HOURS ? ALGORITHM.CONSISTENCY_BONUS : ALGORITHM.CONSISTENCY_PENALTY;

  return { score, viralBonus, consistencyPenalty };
}

export function calculateReach(
  content: ContentPiece,
  algorithm: AlgorithmState,
  followerCount: number
): number {
  const followerMultiplier = 1 + Math.log10(Math.max(followerCount, 1));
  const qualityMultiplier = content.quality / 5;
  const typeMultiplier = content.type === "photo" ? 1 : content.type === "video" ? 2 : 3;
  const algoMultiplier = algorithm.score / ALGORITHM.BASE_SCORE;

  const baseReach = 10 * followerMultiplier * qualityMultiplier * typeMultiplier;
  const adjustedReach = baseReach * algoMultiplier * algorithm.viralBonus * algorithm.consistencyPenalty * content.trendBoost;

  return Math.floor(adjustedReach * 0.1);
}

export function calculateFollowersFromReach(reach: number): number {
  const conversionRate = 0.03 + Math.random() * 0.04;
  return Math.floor(reach * conversionRate);
}

export function calculateMoneyFromReach(reach: number): number {
  const cpm = 0.001;
  return reach * cpm;
}
