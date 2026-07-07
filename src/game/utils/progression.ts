export function levelFromFollowers(followers: number): number {
  if (followers < 10) return 1;
  if (followers < 100) return 2;
  if (followers < 1000) return 3;
  if (followers < 10_000) return 4;
  if (followers < 100_000) return 5;
  if (followers < 1_000_000) return 6;
  if (followers < 10_000_000) return 7;
  if (followers < 100_000_000) return 8;
  return 9;
}
