import type { SliceCreator } from "../storeTypes";
import type { ActivityOutcome } from "../../data/activities";
import { getLocation } from "../../data/locations";
import { ACTIVITY_EFFECTS } from "../../data/activities";
import { pushJournal } from "./helpers";

export interface ActivitySlice {
  doActivity: (activityId: string) => { success: boolean; message: string; outcome?: ActivityOutcome };
}

export const createActivitySlice: SliceCreator<ActivitySlice> = (set, get) => ({
  doActivity: (activityId) => {
    const s = get().state;
    const loc = getLocation(s.currentLocation);
    if (!loc) return { success: false, message: "No location." };
    const activity = loc.activities.find((a) => a.id === activityId);
    if (!activity) return { success: false, message: "Activity not found." };
    const effect = ACTIVITY_EFFECTS[activityId];
    if (!effect) return { success: false, message: "Activity not configured." };

    if (s.resources.energy < activity.energyCost) return { success: false, message: "Not enough energy!" };
    if (activity.minDay > s.resources.day) return { success: false, message: "Not unlocked yet." };
    if (effect.oncePerDay && s.completedActivities.includes(activityId)) {
      return { success: false, message: "Already done today." };
    }
    if (effect.requires?.money && s.resources.money < effect.requires.money) {
      return { success: false, message: `Need $${effect.requires.money}.` };
    }
    if (effect.requires?.reputation && s.resources.reputation < effect.requires.reputation) {
      return { success: false, message: `Need ${effect.requires.reputation} reputation.` };
    }

    const outcome = effect.resolve(Math.random, s.resources);
    set((st) => ({
      state: {
        ...st.state,
        resources: {
          ...st.state.resources,
          energy: st.state.resources.energy - activity.energyCost,
          ...outcome.resources,
        },
        completedActivities: effect.oncePerDay
          ? [...st.state.completedActivities, activityId]
          : st.state.completedActivities,
      },
    }));
    pushJournal(set, outcome.journal, "activity");
    return { success: true, message: outcome.message, outcome };
  },
});
