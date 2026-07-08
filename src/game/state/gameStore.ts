import { create } from "zustand";
import type { GameState, ScreenId, JournalEntry, LocationId, DaySummary, Resources } from "../types";
import { MILESTONES, FINAL_GOAL } from "../types";
import { getLocation } from "../data/locations";
import { ACTIVITY_EFFECTS } from "../data/activities";
import type { ActivityOutcome } from "../data/activities";
import { computeDaySummary } from "../data/summary";
import { getDialogueNode, getRepeatDialogue, getRepeatEncounter, STORY_EVENTS, RANDOM_EVENTS } from "../data/story";
import { audio } from "../../lib/audio";
import { useFeedbackStore } from "./feedbackStore";

const SAVE_KEY = "ie_save_v2";

function createInitialState(): GameState {
  const initialResources: Resources = { followers: 0, money: 20, energy: 10, maxEnergy: 10, reputation: 0, creativity: 5, day: 1 };
  return {
    resources: initialResources,
    dayStartResources: initialResources,
    currentLocation: "home",
    flags: {},
    relationships: { zara: 0, leo: 0, maya: 0, omar: 0, ava: 0 },
    visitedLocations: ["home"],
    completedActivities: [],
    seenDialogueNodes: [],
    activeDialogueNodeId: null,
    activeNpcId: null,
    journal: [{ id: "start", day: 1, text: "Day 1. I'm going to make it as a creator. Time to get to work.", type: "system" }],
    pendingEvents: STORY_EVENTS.map((e) => ({ ...e })),
    reachedMilestones: [],
    won: false,
    lost: false,
    playerName: "",
  };
}

function checkMilestones(state: GameState): { goal: number; label: string } | null {
  const f = state.resources.followers;
  for (const m of MILESTONES) {
    if (f >= m.goal && !state.reachedMilestones.includes(m.goal)) {
      return m;
    }
  }
  return null;
}

function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

function deserializeState(raw: string): GameState | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.resources || typeof parsed.resources.day !== "number") return null;
    const state = parsed as GameState;
    if (!state.dayStartResources) {
      state.dayStartResources = { ...state.resources };
    }
    if (typeof state.lost !== "boolean") state.lost = false;
    if (typeof state.playerName !== "string") state.playerName = "";
    return state;
  } catch { return null; }
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

interface GameStore {
  screen: ScreenId;
  state: GameState;
  toasts: Toast[];
  lastSaveTime: number | null;
  saveStatus: "idle" | "saving" | "loaded" | "error";
  daySummary: DaySummary | null;
  pendingEventNodeId: string | null;

  setScreen: (screen: ScreenId) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  setPlayerName: (name: string) => void;
  goToLocation: (id: LocationId) => string | null;
  doActivity: (activityId: string) => { success: boolean; message: string; outcome?: ActivityOutcome };
  endDay: () => void;
  selectDialogueChoice: (choiceIndex: number) => void;
  endDialogue: () => void;
  checkMilestones: () => void;
  showToast: (message: string, type: Toast["type"]) => void;
  dismissToast: (id: number) => void;
  clearDaySummary: () => void;
  startRandomEvent: (nodeId: string) => void;
}

let toastCounter = 0;

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "map",
  state: createInitialState(),
  toasts: [],
  lastSaveTime: null,
  saveStatus: "idle",
  daySummary: null,
  pendingEventNodeId: null,

  setScreen: (screen) => set({ screen }),

  resetGame: () => set({ state: createInitialState(), daySummary: null, pendingEventNodeId: null }),

  setPlayerName: (name) => {
    set((st) => ({ state: { ...st.state, playerName: name.trim().slice(0, 16) } }));
    get().saveGame();
  },

  saveGame: () => {
    try {
      const s = get().state;
      const data = serializeState(s);
      localStorage.setItem(SAVE_KEY, data);
      set({ lastSaveTime: Date.now(), saveStatus: "saving" });
      setTimeout(() => { if (get().saveStatus === "saving") set({ saveStatus: "loaded" }); }, 300);
    } catch {
      set({ saveStatus: "error" });
      get().showToast("Save failed. Progress may not persist.", "warning");
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const state = deserializeState(raw);
      if (!state) return false;
      set({ state, saveStatus: "loaded" });
      return true;
    } catch {
      get().showToast("Could not load previous save.", "warning");
      return false;
    }
  },

  goToLocation: (id) => {
    const s = get().state;
    const loc = getLocation(id);
    if (!loc) return "Location not found.";
    const dialogueUnlocked = s.flags[`unlocked_${id}`];
    if (loc.unlockedDay > s.resources.day && !dialogueUnlocked) return `Locked. (Unlocks day ${loc.unlockedDay})`;

    const events = s.pendingEvents
      .filter((e) => e.locationId === id && e.triggerDay <= s.resources.day)
      .sort((a, b) => b.priority - a.priority);

    if (events.length > 0) {
      const event = events[0];
      const meetsFlags = event.conditionFlags
        ? Object.entries(event.conditionFlags).every(([k, v]) => s.flags[k] === v)
        : true;
      if (meetsFlags) {
        set((st) => ({
          state: {
            ...st.state,
            currentLocation: id,
            visitedLocations: st.state.visitedLocations.includes(id) ? st.state.visitedLocations : [...st.state.visitedLocations, id],
            pendingEvents: st.state.pendingEvents.filter((e) => e.id !== event.id),
            activeDialogueNodeId: event.dialogueNodeId,
            activeNpcId: event.npcId,
            flags: { ...st.state.flags, [`met_${event.npcId}`]: true },
          },
        }));
        return null;
      }
    }

    // Repeatable encounter check
    const repeatNpcId = getRepeatEncounter(id, s.relationships);
    if (repeatNpcId) {
      const repeatNode = getRepeatDialogue(repeatNpcId, s.seenDialogueNodes);
      if (repeatNode) {
        set((st) => ({
          state: {
            ...st.state,
            currentLocation: id,
            visitedLocations: st.state.visitedLocations.includes(id) ? st.state.visitedLocations : [...st.state.visitedLocations, id],
            activeDialogueNodeId: repeatNode.id,
            activeNpcId: repeatNpcId,
            seenDialogueNodes: [...st.state.seenDialogueNodes, repeatNode.id],
          },
        }));
        return null;
      }
    }

    set((st) => ({
      state: {
        ...st.state,
        currentLocation: id,
        visitedLocations: st.state.visitedLocations.includes(id) ? st.state.visitedLocations : [...st.state.visitedLocations, id],
      },
    }));
    return null;
  },

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
    pushJournal(get, outcome.journal, "activity");
    return { success: true, message: outcome.message, outcome };
  },

  endDay: () => {
    const prev = get().state;
    const summary = computeDaySummary(prev);

    const upkeep = 2 + Math.floor(prev.resources.day / 3);
    const didWork = prev.completedActivities.length > 0;
    const churn = didWork ? 0 : Math.floor(prev.resources.followers * 0.04);
    const nextDay = prev.resources.day + 1;

    const newRes = {
      ...prev.resources,
      day: nextDay,
      energy: prev.resources.maxEnergy,
      money: prev.resources.money - upkeep,
      followers: Math.max(0, prev.resources.followers - churn),
    };

    const won = newRes.followers >= FINAL_GOAL;
    const lost = newRes.money < -50;

    set((st) => ({
      daySummary: summary,
      state: {
        ...st.state,
        resources: newRes,
        dayStartResources: { ...newRes },
        completedActivities: [],
        won,
        lost,
      },
    }));

    if (churn > 0) {
      pushJournal(get, `Quiet day — the algorithm ate ${churn} followers. Post daily to stay relevant.`, "activity");
    }
    pushJournal(get, `Day ${prev.resources.day} ended. Rent paid: -$${upkeep}.`, "system");

    if (!won && !lost && nextDay > 2 && RANDOM_EVENTS.length > 0) {
      const chance = 0.35 + Math.min(nextDay * 0.02, 0.25);
      if (Math.random() < chance) {
        const nodeId = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        set({ pendingEventNodeId: nodeId });
      }
    }

    get().saveGame();
  },

  selectDialogueChoice: (choiceIndex) => {
    const s = get().state;
    if (!s.activeDialogueNodeId) return;
    const node = getDialogueNode(s.activeDialogueNodeId);
    if (!node) return;
    const choice = node.choices[choiceIndex];
    if (!choice) return;

    set((st) => {
      const newState = { ...st.state };

      if (choice.relationshipChange) {
        const rel = { ...newState.relationships };
        for (const [npcId, delta] of Object.entries(choice.relationshipChange)) {
          const key = npcId as keyof typeof rel;
          rel[key] = (rel[key] ?? 0) + (delta as number);
        }
        newState.relationships = rel;
      }

      if (choice.resourceChange) {
        const res = { ...newState.resources };
        for (const [key, val] of Object.entries(choice.resourceChange)) {
          const k = key as keyof typeof res;
          res[k] = (res[k] ?? 0) + (val as number);
        }
        newState.resources = res;
      }

      if (choice.setFlag) {
        newState.flags = { ...newState.flags, [choice.setFlag]: true };
      }
      if (choice.unlocksLocation) {
        newState.flags = { ...newState.flags, [`unlocked_${choice.unlocksLocation}`]: true };
      }

      newState.seenDialogueNodes = [...newState.seenDialogueNodes, node.id];

      if (choice.endsDialogue || choice.nextNodeId === null) {
        newState.activeDialogueNodeId = null;
        newState.activeNpcId = null;
      } else {
        newState.activeDialogueNodeId = choice.nextNodeId;
      }

      return { state: newState };
    });
  },

  endDialogue: () => {
    set((st) => ({ state: { ...st.state, activeDialogueNodeId: null, activeNpcId: null } }));
  },

  checkMilestones: () => {
    const s = get().state;
    const milestone = checkMilestones(s);
    if (milestone) {
      set((st) => ({ state: { ...st.state, reachedMilestones: [...st.state.reachedMilestones, milestone.goal] } }));
      get().showToast(milestone.label, "success");
      pushJournal(get, milestone.label, "story");
      audio.play("milestone");
      const fb = useFeedbackStore.getState();
      if (typeof window !== "undefined") fb.celebrate(window.innerWidth / 2, window.innerHeight / 2);
      if (milestone.goal >= FINAL_GOAL) {
        set((st) => ({ state: { ...st.state, won: true } }));
        get().showToast("🏆 You've won! Check Journal for your story.", "success");
      }
    }
  },

  showToast: (message, type) => {
    const id = ++toastCounter;
    set((st) => ({ toasts: [...st.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },
  dismissToast: (id) => {
    set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) }));
  },
  clearDaySummary: () => {
    const pending = get().pendingEventNodeId;
    set({ daySummary: null, pendingEventNodeId: null });
    if (pending) get().startRandomEvent(pending);
  },
  startRandomEvent: (nodeId) => {
    const node = getDialogueNode(nodeId);
    if (!node) return;
    audio.play("event");
    set((st) => ({
      screen: "story",
      state: { ...st.state, activeDialogueNodeId: nodeId, activeNpcId: node.npcId },
    }));
  },
}));

function pushJournal(get: () => GameStore, text: string, type: JournalEntry["type"]) {
  const s = get().state;
  const entry: JournalEntry = {
    id: `j_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    day: s.resources.day,
    text,
    type,
  };
  useGameStore.setState({ state: { ...s, journal: [...s.journal, entry] } });
}
