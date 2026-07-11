import type { StateCreator } from "zustand";
import type { CoreSlice } from "./slices/coreSlice";
import type { UiSlice } from "./slices/uiSlice";
import type { SaveSlice } from "./slices/saveSlice";
import type { ActivitySlice } from "./slices/activitySlice";
import type { EventSlice } from "./slices/eventSlice";
import type { EconomySlice } from "./slices/economySlice";
import type { ProgressSlice } from "./slices/progressSlice";

/** The full composed store type (composition root in gameStore.ts). */
export type GameStore = CoreSlice &
  UiSlice &
  SaveSlice &
  ActivitySlice &
  EventSlice &
  EconomySlice &
  ProgressSlice;

/** Shared slice creator signature. */
export type SliceCreator<T> = StateCreator<GameStore, [], [], T>;
