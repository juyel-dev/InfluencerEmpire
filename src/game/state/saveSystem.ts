import type { GameState, Resources, NpcId, LocationId, JournalEntry, StoryEvent } from "../types";
import { createInitialState, NPC_IDS, KNOWN_LOCATIONS } from "./initialState";

/**
 * Production save system (blueprint §3).
 * - Versioned envelope (SAVE_VERSION) written under SAVE_KEY.
 * - Legacy ie_save_v2 (no version field) is migrated on load.
 * - Unknown/forward versions are tolerated (new optional keys ignored).
 * - Corrupt or unrecoverable saves are quarantined, never trusted.
 */

export const SAVE_VERSION = 3;
export const SAVE_KEY = "ie_save_v3";
export const LEGACY_SAVE_KEY = "ie_save_v2";

export interface SaveEnvelope {
  version: number;
  savedAt: number;
  state: GameState;
}

// ---------- helpers ----------

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" ? v.slice(0, 16) : fallback;
}

function asLocation(v: unknown): LocationId {
  return KNOWN_LOCATIONS.includes(v as LocationId) ? (v as LocationId) : "home";
}

function asNpc(v: unknown): NpcId | null {
  return NPC_IDS.includes(v as NpcId) ? (v as NpcId) : null;
}

function coerceResources(r: unknown): Resources {
  const d = createInitialState().resources;
  const src = (r ?? {}) as Record<string, unknown>;
  const maxEnergy = Math.max(1, Math.floor(num(src.maxEnergy, d.maxEnergy)));
  const energy = Math.min(Math.max(0, num(src.energy, d.energy)), maxEnergy);
  return {
    followers: Math.max(0, Math.floor(num(src.followers, d.followers))),
    money: num(src.money, d.money),
    energy,
    maxEnergy,
    reputation: num(src.reputation, d.reputation),
    creativity: num(src.creativity, d.creativity),
    day: Math.max(1, Math.floor(num(src.day, d.day))),
  };
}

function coerceRelationships(r: unknown): Record<NpcId, number> {
  const d = createInitialState().relationships;
  const out = { ...d };
  if (r && typeof r === "object") {
    const src = r as Record<string, unknown>;
    for (const k of NPC_IDS) {
      out[k] = num(src[k], d[k]);
    }
  }
  return out;
}

function coerceFlags(f: unknown): Record<string, string | number | boolean> {
  if (!f || typeof f !== "object") return {};
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(f as Record<string, unknown>)) {
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k] = v;
    }
  }
  return out;
}

function coerceJournal(j: unknown): JournalEntry[] {
  if (!Array.isArray(j)) return [];
  return j
    .filter((e): e is JournalEntry => !!e && typeof e === "object" && "text" in e)
    .map((e) => ({
      id: typeof e.id === "string" ? e.id : `j_${Math.random().toString(36).slice(2, 8)}`,
      day: num((e as JournalEntry).day, 1),
      text: String((e as JournalEntry).text ?? ""),
      type: ((e as JournalEntry).type === "activity" || (e as JournalEntry).type === "story"
        ? (e as JournalEntry).type
        : "system") as JournalEntry["type"],
    }))
    .slice(-500); // cap journal length for storage safety
}

function coercePendingEvents(p: unknown): StoryEvent[] {
  if (!Array.isArray(p)) return createInitialState().pendingEvents;
  return p
    .filter((e): e is StoryEvent => {
      if (!e || typeof e !== "object") return false;
      const ev = e as Partial<StoryEvent>;
      return (
        typeof ev.id === "string" &&
        typeof ev.locationId === "string" &&
        typeof ev.npcId === "string" &&
        typeof ev.dialogueNodeId === "string" &&
        typeof ev.triggerDay === "number" &&
        typeof ev.priority === "number"
      );
    })
    .map((ev) => ({
      id: ev.id,
      triggerDay: ev.triggerDay,
      locationId: asLocation(ev.locationId),
      npcId: (asNpc(ev.npcId) ?? "zara") as NpcId,
      dialogueNodeId: ev.dialogueNodeId,
      conditionFlags: ev.conditionFlags,
      priority: ev.priority,
    }));
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function coerceGameState(input: unknown): GameState {
  const src = (input ?? {}) as Record<string, unknown>;
  return {
    resources: coerceResources(src.resources),
    dayStartResources: coerceResources(src.dayStartResources ?? src.resources),
    currentLocation: asLocation(src.currentLocation),
    flags: coerceFlags(src.flags),
    relationships: coerceRelationships(src.relationships),
    visitedLocations: strArray(src.visitedLocations).map(asLocation),
    completedActivities: strArray(src.completedActivities),
    seenDialogueNodes: strArray(src.seenDialogueNodes),
    activeDialogueNodeId: typeof src.activeDialogueNodeId === "string" ? src.activeDialogueNodeId : null,
    activeNpcId: asNpc(src.activeNpcId),
    journal: coerceJournal(src.journal),
    pendingEvents: coercePendingEvents(src.pendingEvents),
    reachedMilestones: strArray(src.reachedMilestones)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n)),
    won: Boolean(src.won),
    lost: Boolean(src.lost),
    playerName: str(src.playerName, ""),
  };
}

// ---------- validation (pure checker) ----------

export function validateState(s: unknown): string[] {
  const errors: string[] = [];
  if (!s || typeof s !== "object") return ["state is not an object"];
  const st = s as Record<string, unknown>;
  if (!st.resources || typeof st.resources !== "object") errors.push("missing resources");
  else {
    const r = st.resources as Record<string, unknown>;
    for (const key of ["followers", "money", "energy", "maxEnergy", "reputation", "creativity", "day"]) {
      if (typeof r[key] !== "number" || !Number.isFinite(r[key] as number)) errors.push(`resources.${key} invalid`);
    }
  }
  if (!st.relationships || typeof st.relationships !== "object") errors.push("missing relationships");
  else {
    const rel = st.relationships as Record<string, unknown>;
    for (const k of NPC_IDS) {
      if (typeof rel[k] !== "number") errors.push(`relationships.${k} invalid`);
    }
  }
  if (typeof st.won !== "boolean") errors.push("won not boolean");
  if (typeof st.lost !== "boolean") errors.push("lost not boolean");
  if (typeof st.playerName !== "string") errors.push("playerName not string");
  return errors;
}

// ---------- migration ----------

function migrateV2ToV3(state: unknown): GameState {
  // v2 had no envelope; shape is compatible. Coercion repairs missing fields.
  return coerceGameState(state);
}

function migrateSave(parsed: unknown): { envelope: SaveEnvelope; migrated: boolean } | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;

  // Envelope form (versioned).
  if (typeof obj.version === "number" && "state" in obj) {
    const version = obj.version;
    const state = coerceGameState(obj.state);
    if (version < SAVE_VERSION) {
      // Run sequential migrations (only v2 -> v3 today).
      const migrated = version <= 2 ? migrateV2ToV3(state) : state;
      return { envelope: { version: SAVE_VERSION, savedAt: Date.now(), state: migrated }, migrated: true };
    }
    // Current or forward version: accept as-is (forward compat).
    return { envelope: { version, savedAt: num(obj.savedAt, Date.now()), state }, migrated: false };
  }

  // Legacy v2 (raw GameState, no version): migrate.
  return { envelope: { version: SAVE_VERSION, savedAt: Date.now(), state: migrateV2ToV3(obj) }, migrated: true };
}

function quarantineCorrupt(raw: string): void {
  try {
    const key = `ie_save_corrupt_${Date.now()}`;
    localStorage.setItem(key, raw);
  } catch {
    /* ignore quarantine failure */
  }
}

// ---------- public API ----------

export function serializeState(state: GameState): string {
  const envelope: SaveEnvelope = { version: SAVE_VERSION, savedAt: Date.now(), state };
  return JSON.stringify(envelope);
}

export function deserializeState(raw: string): GameState | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    quarantineCorrupt(raw);
    return null;
  }
  const result = migrateSave(parsed);
  if (!result) return null;
  const errors = validateState(result.envelope.state);
  if (errors.length > 0) {
    // Unrecoverable structure: quarantine and start fresh.
    quarantineCorrupt(raw);
    return null;
  }
  return result.envelope.state;
}
