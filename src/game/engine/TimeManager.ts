import type { GameTime } from "../types";
import { TIME } from "../data/constants";

export function advanceTime(time: GameTime): GameTime {
  const newHour = time.hour + 1;
  if (newHour >= TIME.HOURS_PER_DAY) {
    return {
      day: time.day + 1,
      hour: 0,
      totalHours: time.totalHours + 1,
    };
  }
  return {
    day: time.day,
    hour: newHour,
    totalHours: time.totalHours + 1,
  };
}
