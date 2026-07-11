import type { SliceCreator } from "../storeTypes";
import type { ScreenId, DaySummary } from "../../types";
import { audio } from "../../../lib/audio";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

export interface ViralMoment {
  followers: number;
  location: string;
}

export interface UiSlice {
  screen: ScreenId;
  toasts: Toast[];
  daySummary: DaySummary | null;
  pendingEventNodeId: string | null;
  viralMoment: ViralMoment | null;
  setScreen: (screen: ScreenId) => void;
  showToast: (message: string, type: Toast["type"]) => void;
  dismissToast: (id: number) => void;
  showViralMoment: (followers: number, location: string) => void;
  clearViralMoment: () => void;
  clearDaySummary: () => void;
}

let toastCounter = 0;

export const createUiSlice: SliceCreator<UiSlice> = (set, get) => ({
  screen: "map",
  toasts: [],
  daySummary: null,
  pendingEventNodeId: null,
  viralMoment: null,

  setScreen: (screen) => set({ screen }),

  showToast: (message, type) => {
    const id = ++toastCounter;
    set((st) => ({ toasts: [...st.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },

  dismissToast: (id) => set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) })),

  showViralMoment: (followers, location) => {
    audio.play("win");
    set({ viralMoment: { followers, location } });
  },
  clearViralMoment: () => set({ viralMoment: null }),

  clearDaySummary: () => {
    const pending = get().pendingEventNodeId;
    set({ daySummary: null, pendingEventNodeId: null });
    if (pending) get().startRandomEvent(pending);
  },
});
