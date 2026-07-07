export function formatNumber(n: number): string {
  if (n < 0) return `-${formatNumber(-n)}`;
  if (n < 1000) return n.toFixed(0);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0)}M`;
  return `${(n / 1_000_000_000).toFixed(1)}B`;
}

export function formatMoney(n: number): string {
  const prefix = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs < 0.01) return `${prefix}$0`;
  if (abs < 1) return `${prefix}$${abs.toFixed(2)}`;
  if (abs < 1000) return `${prefix}$${abs.toFixed(2)}`;
  if (abs < 1_000_000) return `${prefix}$${(abs / 1000).toFixed(1)}K`;
  if (abs < 1_000_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(1)}M`;
  return `${prefix}$${(abs / 1_000_000_000).toFixed(1)}B`;
}

export function formatTime(gameTime: { day: number; hour: number }): string {
  const period = gameTime.hour >= 12 ? "PM" : "AM";
  const displayHour = gameTime.hour === 0 ? 12 : gameTime.hour > 12 ? gameTime.hour - 12 : gameTime.hour;
  return `Day ${gameTime.day} ${displayHour}:00 ${period}`;
}
