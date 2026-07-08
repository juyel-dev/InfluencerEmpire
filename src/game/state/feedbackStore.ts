import { create } from "zustand";

export type FloatKind =
  | "follower"
  | "money"
  | "reputation"
  | "creativity"
  | "energy"
  | "good"
  | "bad"
  | "info";

export interface FloatItem {
  id: number;
  text: string;
  kind: FloatKind;
  x: number;
  y: number;
}

interface FeedbackState {
  floats: FloatItem[];
  burst: number;
  spawn: (text: string, kind: FloatKind, x?: number, y?: number) => void;
  celebrate: (x: number, y: number) => void;
  removeFloat: (id: number) => void;
  consumeBurst: () => void;
}

let fid = 0;
let bid = 0;

export const useFeedbackStore = create<FeedbackState>((set) => ({
  floats: [],
  burst: 0,
  spawn: (text, kind, x, y) => {
    const id = ++fid;
    const px = x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 200);
    const py = y ?? (typeof window !== "undefined" ? 140 : 140);
    set((s) => ({ floats: [...s.floats, { id, text, kind, x: px, y: py }] }));
    setTimeout(() => {
      set((s) => ({ floats: s.floats.filter((f) => f.id !== id) }));
    }, 1500);
  },
  celebrate: (x, y) => {
    set((s) => ({ floats: [...s.floats, { id: ++fid, text: "🎉", kind: "good", x, y }] }));
    set({ burst: ++bid });
    setTimeout(() => {
      set((s) => ({ floats: s.floats.filter((f) => f.id !== fid) }));
    }, 1600);
  },
  removeFloat: (id) => set((s) => ({ floats: s.floats.filter((f) => f.id !== id) })),
  consumeBurst: () => set({ burst: 0 }),
}));
