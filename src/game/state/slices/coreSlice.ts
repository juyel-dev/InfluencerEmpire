import type { SliceCreator } from "../storeTypes";
import type { GameState } from "../../types";
import { createInitialState } from "../initialState";

export interface CoreSlice {
  state: GameState;
}

export const createCoreSlice: SliceCreator<CoreSlice> = () => ({
  state: createInitialState(),
});
