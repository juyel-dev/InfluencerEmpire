import type { StoreApi } from "zustand";
import type { GameStore } from "../storeTypes";
import type { JournalEntry } from "../../types";

/** Append a journal entry. Accepts the store `set` so it is usable from any slice. */
export function pushJournal(
  set: StoreApi<GameStore>["setState"],
  text: string,
  type: JournalEntry["type"],
): void {
  set((st) => ({
    state: {
      ...st.state,
      journal: [
        ...st.state.journal,
        {
          id: `j_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          day: st.state.resources.day,
          text,
          type,
        },
      ],
    },
  }));
}
