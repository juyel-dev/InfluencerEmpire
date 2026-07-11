import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { useGameStore } from "./gameStore";
import { deserializeState, validateState, SAVE_KEY, LEGACY_SAVE_KEY } from "./saveSystem";
import type { GameState } from "../types";

// --- minimal in-memory localStorage (node has none) ---
class MemStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.has(k) ? (this.m.get(k) as string) : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  clear() {
    this.m.clear();
  }
  key(i: number) {
    return Array.from(this.m.keys())[i] ?? null;
  }
  get length() {
    return this.m.size;
  }
}

beforeAll(() => {
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
});

const store = () => useGameStore.getState();

function setPartial(partial: Partial<GameState>) {
  useGameStore.setState({ state: { ...store().state, ...partial } });
}
function setResources(partial: Partial<GameState["resources"]>) {
  setPartial({ resources: { ...store().state.resources, ...partial } });
}

beforeEach(() => {
  localStorage.clear();
  store().resetGame();
  vi.restoreAllMocks();
});

describe("doActivity — guards", () => {
  it("rejects an unknown activity id", () => {
    const r = store().doActivity("does_not_exist");
    expect(r.success).toBe(false);
  });

  it("rejects when energy is too low", () => {
    setPartial({ currentLocation: "studio" });
    setResources({ energy: 0 });
    const r = store().doActivity("record_video"); // cost 3
    expect(r.success).toBe(false);
    expect(r.message).toMatch(/energy/i);
  });

  it("rejects an activity locked by minDay", () => {
    setPartial({ currentLocation: "club" });
    setResources({ day: 1 });
    const r = store().doActivity("party"); // minDay 4
    expect(r.success).toBe(false);
    expect(r.message).toMatch(/unlocked/i);
  });

  it("rejects oncePerDay activity done twice", () => {
    setPartial({ currentLocation: "gym" });
    const first = store().doActivity("workout");
    expect(first.success).toBe(true);
    const second = store().doActivity("workout");
    expect(second.success).toBe(false);
    expect(second.message).toMatch(/already/i);
  });

  it("rejects shop_gear without enough money", () => {
    setPartial({ currentLocation: "mall" });
    setResources({ money: 0, day: 3 });
    const r = store().doActivity("shop_gear"); // requires 25
    expect(r.success).toBe(false);
    expect(r.message).toMatch(/\$25/);
  });

  it("accepts shop_gear and subtracts exactly 25 money", () => {
    setPartial({ currentLocation: "mall" });
    setResources({ money: 50, day: 3 });
    const before = store().state.resources.money;
    const r = store().doActivity("shop_gear");
    expect(r.success).toBe(true);
    expect(store().state.resources.money).toBe(before - 25);
  });
});

describe("doActivity — effects", () => {
  it("sleep restores energy to maxEnergy", () => {
    setPartial({ currentLocation: "home" });
    setResources({ energy: 3, maxEnergy: 10 });
    store().doActivity("sleep");
    expect(store().state.resources.energy).toBe(10);
  });

  it("charges energy cost on a create activity", () => {
    setPartial({ currentLocation: "studio" });
    setResources({ energy: 10 });
    store().doActivity("record_video"); // cost 3
    expect(store().state.resources.energy).toBe(7);
  });

  it("forces a mega-viral tier when rng=0 (followers increase)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    setPartial({ currentLocation: "studio" });
    setResources({ followers: 100, creativity: 10 });
    const before = store().state.resources.followers;
    const r = store().doActivity("record_video");
    expect(r.outcome?.tier).toBe("viral");
    expect(r.outcome?.mega).toBe(true);
    expect(store().state.resources.followers).toBeGreaterThan(before);
  });

  it("forces a flop tier when rng=0.999 (followers do not exceed start)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    setPartial({ currentLocation: "studio" });
    setResources({ followers: 100, creativity: 10 });
    const r = store().doActivity("record_video");
    expect(r.outcome?.tier).toBe("flop");
    expect(r.success).toBe(true);
  });
});

describe("endDay — economy", () => {
  it("advances day, applies upkeep, restores energy, and churns idle followers", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999); // suppress random events
    setResources({ day: 1, money: 20, followers: 100, maxEnergy: 10, energy: 2 });
    store().endDay();
    const r = store().state.resources;
    expect(r.day).toBe(2);
    expect(r.money).toBe(18); // 20 - upkeep(2)
    expect(r.energy).toBe(10);
    expect(r.followers).toBe(96); // 100 - churn(4)
    expect(store().state.won).toBe(false);
    expect(store().state.lost).toBe(false);
  });

  it("detects a win when followers reach the final goal", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    setResources({ followers: 10000, day: 5, money: 100 });
    setPartial({ completedActivities: ["sleep"] }); // avoid idle churn
    store().endDay();
    expect(store().state.won).toBe(true);
  });

  it("detects a loss when money falls below the bankruptcy threshold", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    setResources({ money: -49, day: 5, followers: 50 });
    store().endDay(); // upkeep 2 -> -51 < -50
    expect(store().state.lost).toBe(true);
  });

  it("does not churn followers on a day with completed activities", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    setPartial({ currentLocation: "home", completedActivities: ["sleep"] });
    setResources({ day: 1, money: 20, followers: 100 });
    store().endDay();
    expect(store().state.resources.followers).toBe(100);
  });
});

describe("checkMilestones", () => {
  it("records a crossed milestone, toasts, and journals", () => {
    setResources({ followers: 11 }); // crosses 10
    store().checkMilestones();
    expect(store().state.reachedMilestones).toContain(10);
    expect(store().toasts.length).toBeGreaterThan(0);
    expect(store().state.journal.some((j) => j.type === "story")).toBe(true);
  });

  it("sets won when the final milestone is reached", () => {
    setResources({ followers: 10000 });
    store().checkMilestones();
    expect(store().state.won).toBe(true);
  });
});

describe("selectDialogueChoice", () => {
  it("applies relationship, resource, and flag changes and advances the node", () => {
    setPartial({ activeDialogueNodeId: "zara_intro" });
    store().selectDialogueChoice(0); // relationshipChange zara+15, creativity+3
    expect(store().state.relationships.zara).toBe(15);
    expect(store().state.resources.creativity).toBe(8);
    expect(store().state.activeDialogueNodeId).toBe("zara_advice_yes");
    expect(store().state.seenDialogueNodes).toContain("zara_intro");
  });

  it("ends dialogue when choice endsDialogue", () => {
    setPartial({ activeDialogueNodeId: "zara_advice_yes" });
    store().selectDialogueChoice(0); // endsDialogue true
    expect(store().state.activeDialogueNodeId).toBeNull();
    expect(store().state.activeNpcId).toBeNull();
  });
});

describe("clearDaySummary -> startRandomEvent", () => {
  it("chains a pending event into the story screen", () => {
    useGameStore.setState({ pendingEventNodeId: "rand_brand" });
    store().clearDaySummary();
    expect(store().daySummary).toBeNull();
    expect(store().pendingEventNodeId).toBeNull();
    expect(store().screen).toBe("story");
    expect(store().state.activeDialogueNodeId).toBe("rand_brand");
  });
});

describe("setPlayerName", () => {
  it("trims and caps to 16 characters and persists a save", () => {
    store().setPlayerName("   A Very Long Player Name   ");
    expect(store().state.playerName).toBe("A Very Long Play");
    expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
  });
});

describe("save / load round-trip", () => {
  it("persists and restores domain state across reset", () => {
    store().setPlayerName("Tester");
    setResources({ followers: 250, money: 99 });
    store().saveGame();
    store().resetGame();
    expect(store().state.playerName).toBe("");
    const loaded = store().loadGame();
    expect(loaded).toBe(true);
    expect(store().state.playerName).toBe("Tester");
    expect(store().state.resources.followers).toBe(250);
  });
});

describe("saveSystem — migration & validation", () => {
  it("migrates a legacy v2 (no version) save into a valid state", () => {
    const legacy = JSON.stringify({
      resources: { followers: 5, money: 30, energy: 2, maxEnergy: 10, reputation: 1, creativity: 3, day: 2 },
      currentLocation: "home",
    });
    const state = deserializeState(legacy);
    expect(state).not.toBeNull();
    expect(state!.resources.day).toBe(2);
    expect(state!.playerName).toBe("");
    expect(state!.relationships.zara).toBe(0);
  });

  it("returns null on corrupt JSON and quarantines it", () => {
    const result = deserializeState("{ this is : not json");
    expect(result).toBeNull();
    const quarantined = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).some(
      (k) => typeof k === "string" && k.startsWith("ie_save_corrupt_"),
    );
    expect(quarantined).toBe(true);
  });

  it("validateState reports no errors for a clean state", () => {
    expect(validateState(store().state)).toEqual([]);
  });

  it("validateState reports errors for a malformed state", () => {
    const errors = validateState({ resources: { day: "x" }, relationships: {}, won: 1 });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("legacy key is read as a fallback on load", () => {
    localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify({ resources: { followers: 7, money: 11, energy: 5, maxEnergy: 10, reputation: 0, creativity: 2, day: 3 }, currentLocation: "home" }));
    const loaded = store().loadGame();
    expect(loaded).toBe(true);
    expect(store().state.resources.followers).toBe(7);
  });
});
