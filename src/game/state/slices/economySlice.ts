import type { SliceCreator } from "../storeTypes";
import { computeDaySummary } from "../../data/summary";
import { RANDOM_EVENTS } from "../../data/story";
import { BALANCE } from "../../data/balance";
import { FINAL_GOAL } from "../../types";
import { pushJournal } from "./helpers";

export interface EconomySlice {
  endDay: () => void;
}

export const createEconomySlice: SliceCreator<EconomySlice> = (set, get) => ({
  endDay: () => {
    const prev = get().state;
    const summary = computeDaySummary(prev);

    const upkeep = BALANCE.economy.baseUpkeep + Math.floor(prev.resources.day / 3);
    const didWork = prev.completedActivities.length > 0;
    const churn = didWork ? 0 : Math.floor(prev.resources.followers * BALANCE.economy.idleChurnRate);
    const nextDay = prev.resources.day + 1;

    const newRes = {
      ...prev.resources,
      day: nextDay,
      energy: prev.resources.maxEnergy,
      money: prev.resources.money - upkeep,
      followers: Math.max(0, prev.resources.followers - churn),
    };

    const won = newRes.followers >= FINAL_GOAL;
    const lost = newRes.money < BALANCE.economy.bankruptcyThreshold;

    set((st) => ({
      daySummary: summary,
      state: { ...st.state, resources: newRes, dayStartResources: { ...newRes }, completedActivities: [], won, lost },
    }));

    if (churn > 0) {
      pushJournal(set, `Quiet day — the algorithm ate ${churn} followers. Post daily to stay relevant.`, "activity");
    }
    pushJournal(set, `Day ${prev.resources.day} ended. Rent paid: -$${upkeep}.`, "system");

    if (!won && !lost && nextDay > 2 && RANDOM_EVENTS.length > 0) {
      const chance =
        BALANCE.randomEvent.baseChance +
        Math.min(nextDay * BALANCE.randomEvent.perDayChance, BALANCE.randomEvent.maxBonus);
      if (Math.random() < chance) {
        const nodeId = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        set({ pendingEventNodeId: nodeId });
      }
    }

    get().saveGame();
  },
});
