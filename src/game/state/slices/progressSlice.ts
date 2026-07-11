import type { SliceCreator } from "../storeTypes";
import type { GameState } from "../../types";
import { MILESTONES, FINAL_GOAL } from "../../types";
import { audio } from "../../../lib/audio";
import { useFeedbackStore } from "../feedbackStore";
import { pushJournal } from "./helpers";

export interface ProgressSlice {
  checkMilestones: () => void;
}

function crossedMilestones(state: GameState) {
  const f = state.resources.followers;
  return MILESTONES.filter((m) => f >= m.goal && !state.reachedMilestones.includes(m.goal));
}

export const createProgressSlice: SliceCreator<ProgressSlice> = (set, get) => ({
  checkMilestones: () => {
    const s = get().state;
    const crossed = crossedMilestones(s);
    if (crossed.length === 0) return;
    set((st) => ({
      state: { ...st.state, reachedMilestones: [...st.state.reachedMilestones, ...crossed.map((m) => m.goal)] },
    }));
    for (const m of crossed) {
      get().showToast(m.label, "success");
      pushJournal(set, m.label, "story");
    }
    audio.play("milestone");
    const fb = useFeedbackStore.getState();
    if (typeof window !== "undefined") fb.celebrate(window.innerWidth / 2, window.innerHeight / 2);
    if (crossed.some((m) => m.goal >= FINAL_GOAL)) {
      set((st) => ({ state: { ...st.state, won: true } }));
      get().showToast("🏆 You've won! Check Journal for your story.", "success");
    }
  },
});
