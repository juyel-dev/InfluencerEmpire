import { create } from "zustand";
import type { GameStore } from "./storeTypes";
import { createCoreSlice } from "./slices/coreSlice";
import { createUiSlice } from "./slices/uiSlice";
import { createSaveSlice } from "./slices/saveSlice";
import { createActivitySlice } from "./slices/activitySlice";
import { createEventSlice } from "./slices/eventSlice";
import { createEconomySlice } from "./slices/economySlice";
import { createProgressSlice } from "./slices/progressSlice";

/**
 * Composition root. Public action/selector API is unchanged from the
 * pre-refactor monolith; logic now lives in typed slices under ./slices.
 */
export const useGameStore = create<GameStore>()((...a) => ({
  ...createCoreSlice(...a),
  ...createUiSlice(...a),
  ...createSaveSlice(...a),
  ...createActivitySlice(...a),
  ...createEventSlice(...a),
  ...createEconomySlice(...a),
  ...createProgressSlice(...a),
}));
