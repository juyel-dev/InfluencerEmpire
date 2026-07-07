import type { ContentPiece } from "../types";

const DECAY_RATE = 0.97;
const MIN_VIEWS_FACTOR = 0.05;

export function applyContentDecay(content: ContentPiece[]): ContentPiece[] {
  return content.map((piece) => {
    if (piece.status !== "published") return piece;

    const decayFactor = Math.max(DECAY_RATE, MIN_VIEWS_FACTOR);
    return {
      ...piece,
      trendBoost: piece.trendBoost * decayFactor,
    };
  });
}

export function getActiveContentCount(content: ContentPiece[]): number {
  return content.filter(
    (c) => c.status === "published" && c.trendBoost > 0.1
  ).length;
}
