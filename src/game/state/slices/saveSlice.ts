import type { SliceCreator } from "../storeTypes";
import { serializeState, deserializeState, SAVE_KEY, LEGACY_SAVE_KEY } from "../saveSystem";
import { createInitialState } from "../initialState";

export interface SaveSlice {
  lastSaveTime: number | null;
  saveStatus: "idle" | "saving" | "loaded" | "error";
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  setPlayerName: (name: string) => void;
}

export const createSaveSlice: SliceCreator<SaveSlice> = (set, get) => ({
  lastSaveTime: null,
  saveStatus: "idle",

  resetGame: () =>
    set({ state: createInitialState(), daySummary: null, pendingEventNodeId: null, viralMoment: null }),

  setPlayerName: (name) => {
    set((st) => ({ state: { ...st.state, playerName: name.trim().slice(0, 16) } }));
    get().saveGame();
  },

  saveGame: () => {
    try {
      const data = serializeState(get().state);
      localStorage.setItem(SAVE_KEY, data);
      set({ lastSaveTime: Date.now(), saveStatus: "saving" });
      setTimeout(() => {
        if (get().saveStatus === "saving") set({ saveStatus: "loaded" });
      }, 300);
    } catch {
      set({ saveStatus: "error" });
      get().showToast("Save failed. Progress may not persist.", "warning");
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_SAVE_KEY);
      if (!raw) return false;
      const state = deserializeState(raw);
      if (!state) return false;
      set({ state, saveStatus: "loaded" });
      get().saveGame();
      return true;
    } catch {
      get().showToast("Could not load previous save.", "warning");
      return false;
    }
  },
});
