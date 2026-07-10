# Influencer Empire — Engineering Blueprint (Pre-Phase Foundation)

> **Status:** Architecture freeze / planning. **No production code is created or modified.** This document is the permanent **Single Source of Truth (SSoT)** for engineering, alongside `PROJECT_CONSTITUTION.md` (product authority) and `ENHANCEMENT_MASTER_PLAN.md` (feature roadmap).
> **Scope:** Sections 1–9 requested by the user: System Architecture, Feature Constitution, Save System Specification, Testing Constitution, Coding Constitution, ADRs, Dependency & Risk Analysis, Future Scalability, Final Blueprint.
> **Implementation rule:** No feature is built until (a) its section here is finalized, and (b) its Phase in `ENHANCEMENT_MASTER_PLAN.md` is approved. Phase 0 (hardening) precedes all feature work.

---

# 0. Stack & Tooling (factual baseline)

- **Build:** Vite 8 (`npm run dev`, `npm run build` = `tsc && vite build`).
- **UI:** React 19, TypeScript ~6.0, Tailwind 4 (`@tailwindcss/vite`).
- **State:** Zustand 5 (`create`), two stores: `useGameStore` (`game/state/gameStore.ts`, 405 LOC god store) and `useFeedbackStore` (`game/state/feedbackStore.ts`, visual juice only).
- **Utilities:** `class-variance-authority`, `clsx`, `tailwind-merge` (`cn`), `lucide-react`.
- **Tests:** Vitest 3 (`npm test`), `npm run lint` = ESLint 9 (flat config, typescript-eslint).
- **Audio:** Web Audio synth (`lib/audio.ts`), no asset files.
- **Persistence:** `localStorage`, key `ie_save_v2`.

---

# 1. System Architecture

## 1.1 Architecture Overview

Influencer Empire is a **client-only, single-page, deterministic-turn game**. There is no server; the entire simulation runs in the browser. Three conceptual layers:

1. **Data layer** (`src/game/data/*`) — declarative, serializable content: locations, activities, NPCs, dialogue, story events, summary math. Pure functions, no side effects.
2. **Domain/logic layer** (`src/game/state/*`, `src/game/types/*`) — Zustand stores that hold `GameState` and mutate it via actions; resolve activities into outcomes; advance days; chain events.
3. **Presentation layer** (`src/components/*`) — React components subscribe to the store, render screens/overlays, and dispatch actions. Visual juice (`feedbackStore`, `audio`) is a side-effect sink, decoupled from domain logic.

**Key architectural invariants (must hold post-refactor):**
- Domain logic never imports React or DOM.
- Stores never import components.
- Presentation never mutates `GameState` directly; only via store actions.
- All randomness is injected (`rng: () => number`) so logic is testable (see `activities.ts:16,22,51`).
- Content expansion = new data entries only; no logic edits.

## 1.2 Folder Architecture (current + target)

```
src/
├── main.tsx                      # React root
├── App.tsx                       # screen router, initial load
├── styles.css                    # Tailwind + global a11y
├── lib/
│   ├── audio.ts                  # Web Audio synth engine (SFX + future music)
│   └── cn.ts                     # className merge util
├── game/
│   ├── types/index.ts            # ALL shared types + MILESTONES, FINAL_GOAL
│   ├── data/                     # DATA LAYER (content + pure functions)
│   │   ├── locations.ts
│   │   ├── activities.ts         # ACTIVITY_EFFECTS, rollTier, post()
│   │   ├── npcs.ts
│   │   ├── story.ts              # DIALOGUE_NODES, STORY_EVENTS, RANDOM_EVENTS, repeats
│   │   ├── summary.ts            # computeDaySummary (pure)
│   │   ├── balance.ts            # [TARGET] all tuning numbers (P0-4)
│   │   ├── missions.ts           # [TARGET] P1-2
│   │   ├── achievements.ts       # [TARGET] P1-3
│   │   ├── gear.ts               # [TARGET] P1-4
│   │   ├── brandDeals.ts         # [TARGET] P1-5
│   │   └── ...
│   └── state/                    # LOGIC LAYER (stores)
│       ├── gameStore.ts          # [TARGET] composition root after P0-3
│       ├── feedbackStore.ts      # visual juice only
│       ├── index.ts              # public store exports
│       └── slices/               # [TARGET] P0-3
│           ├── saveSlice.ts      # serialize/deserialize/migrate/schema
│           ├── economySlice.ts   # upkeep/churn/endDay/win-lose
│           ├── eventSlice.ts     # story + random events
│           └── progressSlice.ts  # milestones/achievements/missions
└── components/
    ├── GameShell.tsx             # layout: TopBar + main + BottomNav + overlays
    ├── ui/                       # primitives: Button, Card, ProgressBar, AnimatedNumber, states
    ├── game/
    │   ├── hud/                  # TopBar, BottomNav
    │   ├── screens/              # MapScreen, StoryScreen, JournalScreen, SettingsScreen
    │   ├── features/             # ActivityList, DialoguePanel, TypewriterText
    │   ├── shared/               # AnimatedScreen, FloatLayer, Confetti, ToastContainer
    │   └── overlays/             # DaySummary, Intro, End, ViralMoment
    └── assets/                   # illustrations (SVG React), characters
```

## 1.3 Module Dependency Graph

```
                 main.tsx → App.tsx → GameShell
                                        │
            ┌───────────────┬───────────┴───────────┬─────────────────┐
         screens         overlays               hud/features      shared
            │               │                      │                │
            └───────────────┴───────────┬──────────┘                │
                                 useGameStore ◄──────────────────────┘
                                      │
                      ┌───────────────┼────────────────┐
                 data/*           types/*          feedbackStore
                  │                 │                  │
                  └──────► audio ←───┴──────────────────┘
```
- **Allowed:** components → stores → data → types. Components → audio (side-effect only).
- **Forbidden:** data → components, store → components, data → store.
- After P0-3: components depend on slice selector hooks, never on the raw god store.

## 1.4 Data Flow

```
[Player input] → [Component handler]
   → store action (e.g. doActivity/endDay/goToLocation)
      → reads GameState + data tables (locations/activities/story)
      → pure resolver (post()/computeDaySummary) computes deltas
      → set() updates GameState immutably
      → side-effects: pushJournal, audio.play, feedbackStore.spawn
   → subscribers re-render (granular selectors)
```

## 1.5 State Flow

```
createInitialState()  ──► GameState
      │
      ├─ setScreen ───────► ui.screen (ephemeral)
      ├─ goToLocation ────► currentLocation, visitedLocations, activeDialogue
      ├─ doActivity ──────► resources, completedActivities, journal
      ├─ endDay ─────────► resources(upkeep/churn), day++, won/lost, daySummary
      ├─ selectDialogue ─► relationships, resources, flags, seenDialogueNodes
      ├─ checkMilestones ► reachedMilestones, toast, celebrate
      └─ saveGame/load ──► localStorage ↔ GameState
```

State is split conceptually into **domain state** (`GameState`) and **ephemeral UI state** (screen, toasts, daySummary, viralMoment, pendingEventNodeId). **P0-3 mandate:** ephemeral UI state must move out of the domain store into a `uiSlice`/local component state to stop cross-contamination (currently `gameStore.ts:70-97` mixes both).

## 1.6 Event Flow

```
endDay() ──► (chance roll) ──► set pendingEventNodeId
clearDaySummary() ──► reads pendingEventNodeId ──► startRandomEvent(nodeId)
startRandomEvent ──► set screen="story", activeDialogueNodeId=nodeId
selectDialogueChoice ──► apply effects ──► nextNodeId / endsDialogue
```
Story events fire on `goToLocation` (priority-sorted, flag-gated). Random events fire on day end. Both resolve through the same `DialogueNode`/`selectDialogueChoice` path → single resolution code path.

## 1.7 Component Interaction

```
GameShell
├── TopBar (resources, milestone progress)        ─ reads useGameStore
├── <main> AnimatedScreen → Screen (Map/Story/...) ─ reads useGameStore
├── BottomNav (screen switch, active indicator)   ─ setScreen
├── ToastContainer ◄ useGameStore.toasts
├── FloatLayer / Confetti ◄ useFeedbackStore
└── Overlays: DaySummary, Intro, End, ViralMoment ◄ useGameStore + feedbackStore
```
Overlays mount always in `GameShell` and self-gate on store flags (e.g. `ViralMomentOverlay` shows only when `viralMoment !== null`).

## 1.8 Store Interaction

- `useGameStore` (domain + ephemeral) — 27 actions, single `state: GameState`, plus UI fields.
- `useFeedbackStore` (visual juice) — `spawn`, `celebrate`, `removeFloat`, `consumeBurst`; fully independent of domain; consumed by `FloatLayer`/`Confetti` (pure render of ephemeral floats).
- Domain store reaches into `feedbackStore` only via `useFeedbackStore.getState()` inside `checkMilestones` (`gameStore.ts:356`) — acceptable one-way call; **post-P0-3** prefer emitting a domain event the presentation layer subscribes to (decouples logic from `window`/celebrate call).

## 1.9 Rendering Flow

```
main → createRoot(StrictMode) → App
App: loadGame() on mount → loading gate → GameShell
GameShell renders persistent chrome + AnimatedScreen keyed by screen (slide-in)
StrictMode double-invokes effects in dev (tests/audio must be idempotent-safe)
```
**Perf note (audit):** `MapScreen.tsx:24` subscribes to whole `state` → re-renders on every field change. P0-5 fixes via granular selectors.

## 1.10 Save/Load Flow

```
saveGame(): get().state → serializeState(JSON.stringify) → localStorage.setItem(ie_save_v2)
loadGame(): localStorage.getItem → deserializeState(JSON.parse + loose guard) → set({state})
resetGame(): createInitialState() → clears ephemeral + daySummary
```
**Defect (audit):** `deserializeState` (`gameStore.ts:50-62`) only checks `resources.day` and patches 3 fields; no version, no schema validation, no corruption recovery. **P0-2 replaces this** with the Save System Specification in §3.

---

# 2. Feature Constitution

Each feature below uses the same schema. "Status" = existing (EX) or planned (PL, with Master-Plan phase).

## 2.1 Map Navigation (EX)
- **Purpose:** Let the player travel between locations; trigger location-gated story events.
- **Responsibilities:** Validate lock (`unlockedDay`/flag), fire highest-priority story event or repeat encounter, update `currentLocation`/`visitedLocations`.
- **Rules:** Locked if `day < unlockedDay` and `!flags[unlocked_<id>]`; only one story event per visit (consumed from `pendingEvents`); repeat encounters gated by `NPC_FAVORITE_LOCATIONS` + relationship > -20 + 35% roll.
- **Inputs:** `LocationId`. **Outputs:** `{ success | message }`.
- **State changes:** `currentLocation`, `visitedLocations`, `activeDialogueNodeId`, `activeNpcId`, `flags.met_<npc>`, `pendingEvents`.
- **Dependencies:** `locations.ts`, `story.ts`, `GameState`.
- **Edge cases:** Unknown location → error message; event flag not met → falls through to repeat/none.
- **Failure cases:** No location def → "Location not found"; handled gracefully (returns message, no throw).
- **Acceptance:** Locked locations show day gate; story fires once; revisit without event is silent.
- **Extensibility:** Add locations via `locations.ts` + story events via `story.ts`; no logic change.

## 2.2 Activity Execution (EX)
- **Purpose:** Core gameplay verb — spend energy, roll outcome, apply deltas.
- **Responsibilities:** Validate energy/minDay/oncePerDay/requires; call `effect.resolve(rng, resources)`; apply resource deltas; push journal.
- **Rules:** `rollTier` from creativity; `post()` scales by tier; mega-viral 16% on viral; `oncePerDay` tracked in `completedActivities`.
- **Inputs:** `activityId`. **Outputs:** `{ success, message, outcome? }`.
- **State changes:** `resources` (energy down, deltas), `completedActivities`, `journal`.
- **Dependencies:** `activities.ts`, `summary.ts` (for downstream day summary deltas).
- **Edge cases:** Not enough energy / locked / already done / unmet requirement → distinct messages; `outcome.resources` deltas are **absolute** (`current.followers + f`) — must be applied as deltas by caller, not overwritten (see §3 integrity).
- **Failure cases:** Unknown id / missing effect → error message (no throw).
- **Acceptance:** Visible Outcome Odds (viral%/flop%) rendered from `rollTier` formula (D-010); tests cover tiers (MEGA flag).
- **Extensibility:** New activity = entry in `ACTIVITY_EFFECTS` + `location.activities`; balance numbers → `balance.ts` (P0-4).

## 2.3 Day Cycle / Economy (EX)
- **Purpose:** Advance time, apply upkeep/churn, detect win/lose.
- **Responsibilities:** `computeDaySummary`, upkeep `2 + floor(day/3)`, churn `floor(followers*0.04)` if no activity, reset energy/maxEnergy, `won = followers>=FINAL_GOAL`, `lost = money < -50`.
- **Rules:** Deterministic except random-event roll; saves on end.
- **Inputs:** current `GameState`. **Outputs:** `daySummary`, new `resources`, `won`/`lost`.
- **State changes:** `resources` (day++, energy, money, followers), `dayStartResources`, `completedActivities:[]`, `won`/`lost`, `daySummary`.
- **Dependencies:** `summary.ts`, `story.ts` (RANDOM_EVENTS), save.
- **Edge cases:** Idle day → churn + journal; final day hits 10K exactly → win; money crosses -50 → lose.
- **Failure cases:** `computeDaySummary` divides nothing; safe.
- **Acceptance:** Unit tests assert upkeep/churn/bankruptcy/win (P0-1).
- **Extensibility:** Tuning → `balance.ts`; Empire Mode churn scaling (P2-1) overrides here.

## 2.4 Dialogue / Story (EX)
- **Purpose:** Narrative + relationship/flag progression.
- **Responsibilities:** Traverse `DialogueNode` graph; apply `relationshipChange`/`resourceChange`/`setFlag`/`unlocksLocation`; advance `seenDialogueNodes`.
- **Rules:** Single resolution path; conditionals via `conditionFlag`/`conditionValue` (defined but lightly used).
- **Inputs:** `choiceIndex`. **Outputs:** mutated `GameState` (relationships, resources, flags, dialogue pointer).
- **State changes:** `relationships`, `resources`, `flags`, `seenDialogueNodes`, `activeDialogueNodeId/NpcId`.
- **Dependencies:** `story.ts`.
- **Edge cases:** Missing node/choice → no-op (guard at `gameStore.ts:297-301`).
- **Failure cases:** None throw; silent returns.
- **Acceptance:** Narrative completes; flags persist; rel repeat encounters cycle.
- **Extensibility:** New nodes/events = data; condition system reusable for future branches.

## 2.5 Random Events (EX)
- **Purpose:** Day-end surprises adding variance.
- **Responsibilities:** 35%+day-scaled chance post-day-2 → pick `RANDOM_EVENTS` → `pendingEventNodeId` → `startRandomEvent`.
- **Rules:** Only if `!won && !lost`; node resolved via story path.
- **Inputs/Outputs:** `pendingEventNodeId` → screen switch.
- **State changes:** `pendingEventNodeId`, then via dialogue path.
- **Dependencies:** §2.4, `story.ts`.
- **Edge cases:** Consecutive days may chain; `clearDaySummary` bridges day summary → event.
- **Failure cases:** Unknown node id → `startRandomEvent` bails (`gameStore.ts:386`).
- **Acceptance:** Events appear; solvable; no crash on bad id.
- **Extensibility:** Add ids to `RANDOM_EVENTS`; 100× events (§8) via weighted pool.

## 2.6 Milestones (EX)
- **Purpose:** Progress feedback toward 10K.
- **Responsibilities:** Detect crossed `MILESTONES` not in `reachedMilestones`; toast + journal + `celebrate` + audio; final → `won`.
- **Inputs/Outputs:** `reachedMilestones`, toast, burst.
- **State changes:** `reachedMilestones`, `won` (at FINAL_GOAL).
- **Dependencies:** `types` (MILESTONES), `feedbackStore`, `audio`.
- **Edge cases:** Multiple milestones in one jump → first only (loop returns first).
- **Failure cases:** None.
- **Acceptance:** TopBar progress bar reflects reached; final milestone wins.
- **Extensibility:** Milestones data-driven; tie to achievements (P1-3).

## 2.7 Journal (EX)
- **Purpose:** Persistent narrative log.
- **Responsibilities:** Append `JournalEntry` (id `j_<ts>_<rand>`); rendered in `JournalScreen`.
- **Inputs/Outputs:** append-only.
- **State changes:** `journal` array.
- **Dependencies:** `GameState`.
- **Edge cases:** Grows unbounded → pagination/virtualization later (P2-3 feed).
- **Acceptance:** Entries chronological; type-colored.
- **Extensibility:** Feed timeline (P2-3) consumes same stream.

## 2.8 Save / Load (EX → replaced by §3 in P0-2)
- See §3.

## 2.9 Intro / End / Viral Overlays (EX)
- **Purpose:** Bookend UX + mega-viral celebration.
- **Intro:** collect `playerName` (≤16 chars, trimmed) + avatar; persisted.
- **End:** win (`won`) / lose (`lost`) screen with restart.
- **Viral:** full-screen takeover on mega-viral; `audio.play("win")`.
- **Inputs:** store flags. **Outputs:** `setPlayerName`, `resetGame`.
- **State changes:** `playerName`; on reset, full re-init.
- **Dependencies:** `gameStore`, `feedbackStore`, `audio`.
- **Edge cases:** Win and lose mutually exclusive; overlay self-gates.
- **Acceptance:** Name persisted; restart returns to Day 1; viral only on mega.
- **Extensibility:** End screen branches for Empire Mode (P2-1), Prestige (P2-2).

## 2.10 Feedback / Juice (EX)
- **Purpose:** Game-feel (SFX, floating numbers, confetti).
- **Responsibilities:** `audio.play(id)`; `feedbackStore.spawn/celebrate`; `FloatLayer`/`Confetti` render.
- **Inputs:** domain events (outcome, milestone). **Outputs:** visual only.
- **State changes:** `feedbackStore` floats/burst (ephemeral).
- **Dependencies:** `audio.ts`.
- **Edge cases:** `window` undefined (SSR/test) guarded.
- **Acceptance:** No gameplay effect; mute respected (audio module).
- **Extensibility:** Music beds (P3-4), stereo pan.

## 2.11 Visible Outcome Odds (EX, D-010)
- **Purpose:** Show players predicted viral%/flop% per card.
- **Responsibilities:** Render `rollTier` outputs from current creativity.
- **Inputs:** `resources.creativity`. **Outputs:** UI only.
- **Dependencies:** `activities.ts:rollTier` (must be exported for UI).
- **Edge cases:** Creativity caps (viral ≤0.26, flop ≥0.08).
- **Acceptance:** Card displays live odds; matches resolve math.
- **Extensibility:** Gear/perks shift odds (P1-4).

## 2.12 Planned Features (summary; full constitution deferred to their Phase)
Each planned feature gets a completed §2 schema block when its Phase is approved. Anchors:
- **P1-1 Competitor AI (Leo):** parallel follower curve; perk on beating; `economySlice` + `JournalScreen` widget; default `leo` stat 0.
- **P1-2 Missions:** rotating objectives + rewards; `missions.ts` + `progressSlice`; new Missions screen/tab.
- **P1-3 Achievements:** ~30 unlocks emitted from slices; `achievements.ts`.
- **P1-4 Gear Shop:** tiered gear boosts via `balance.ts`; `gear.ts` + `economySlice`; Shop screen.
- **P1-5 Brand Deals:** recurring offers, money vs reputation; `brandDeals.ts`.
- **P2-1 Empire Mode:** post-win endless; harder churn; local leaderboard.
- **P2-2 Prestige:** reset keeping cosmetics + perk token; needs P0-2 migration.
- **P2-3 Social Feed:** historical posts view; derive from journal.
- **P2-4 New City Pack:** data-only locations/activities/events.
- **P2-5 Specializations:** niche trees altering activity sets; `specializations.ts`.
- **P3-1 i18n:** strings → `data/i18n/*`; `Intl.NumberFormat`.
- **P3-2 Controller/Keyboard:** focus-order nav + gamepad layer (focus-visible already present).
- **P3-3 CI/CD:** GitHub Actions running tsc+lint+test+build.
- **P3-4 Music:** `audio.ts` loop beds + stereo.
- **P3-5 Cosmetics:** avatar/theme skins, earnable + optional IAP (D-007 cosmetic-only); `cosmetics.ts`.
- **P3-6 Code-splitting:** `React.lazy` per screen.

---

# 3. Save System Specification

**Goal:** Production-grade, versioned, validated, recoverable. Replaces `deserializeState` (P0-2).

## 3.1 JSON Schema (target, v3)

```jsonc
{
  "version": 3,                       // SAVE_VERSION (new, mandatory)
  "savedAt": 1718000000000,           // epoch ms
  "state": {
    "resources": { "followers":0,"money":20,"energy":10,"maxEnergy":10,"reputation":0,"creativity":5,"day":1 },
    "currentLocation": "home",
    "flags": {},
    "relationships": { "zara":0,"leo":0,"maya":0,"omar":0,"ava":0 },
    "visitedLocations": ["home"],
    "completedActivities": [],
    "seenDialogueNodes": [],
    "activeDialogueNodeId": null,
    "activeNpcId": null,
    "journal": [ { "id":"start","day":1,"text":"...","type":"system" } ],
    "pendingEvents": [ /* STORY_EVENTS shape */ ],
    "reachedMilestones": [],
    "won": false,
    "lost": false,
    "playerName": "",
    "dayStartResources": { /* Resources */ }
    // future slices add keys here, e.g. "achievements":[], "gear":[], "prestige":{...}
  }
}
```

## 3.2 Versioning Strategy
- `SAVE_VERSION: number` constant in `saveSlice`. Current content = **2** (the legacy `ie_save_v2` shape, no `version` field). New writes = **3**.
- Bump rule: increment only on **breaking** shape change. Adding optional keys = non-breaking, no bump (use defaults).
- Stored at top level so a save can be identified before parsing `state`.

## 3.3 Migration Strategy
- `migrateSave(raw: unknown): SaveEnvelope | null`:
  - No `version` field → treat as legacy v2 → `migrateV2ToV3`.
  - `migrateV2ToV3(state)`: deep-clone; ensure `dayStartResources` exists (else copy `resources`); ensure `lost`/`playerName` types; ensure `relationships` has all 5 NPCs; strip unknown keys via schema; return `{ version:3, savedAt:Date.now(), state }`.
  - Forward unknown minor versions: accept `version > SAVE_VERSION` but warn (see §3.6).
- Each migration is a **pure** function with a unit test (P0-1) for round-trip safety.

## 3.4 Validation Strategy
- A `validateState(s): string[]` returns a list of errors (empty = valid). Checks:
  - `resources` is object with all 7 numeric fields; `day>=1`; `energy<=maxEnergy`; `followers>=0`.
  - `relationships` has exactly the 5 known NPCs, numeric.
  - `flags` is flat record of primitives.
  - `pendingEvents` entries match `StoryEvent` shape.
  - `journal` entries match `JournalEntry`.
  - No `NaN`/`undefined`/`Infinity` anywhere (JSON-safe).
- Validation runs **after** migration, **before** `set({state})`.

## 3.5 Backward Compatibility
- Legacy `ie_save_v2` (no version, loose shape) loads via `migrateV2ToV3`. **Acceptance:** an actual current save file loads unmodified after P0-2 ships.
- Optional new keys absent in old saves ⇒ filled with `createInitialState()` defaults merged over loaded state (`{ ...defaults, ...loaded }` pattern, never the reverse).
- **Rule:** loaded data never overrides defaults for required keys; defaults provide missing keys.

## 3.6 Forward Compatibility
- If `version > SAVE_VERSION`: attempt to load (new optional keys ignored by validator if `additionalProperties` allowed for `state` extensions); show toast "Save from newer version — some features may be missing." Do **not** crash.
- Rationale: a v3 save opened by a v2 client should still be playable minus new systems.

## 3.7 Corruption Recovery
- `localStorage` read/parse wrapped in try/catch. On any failure (parse error, validation errors ≥ threshold):
  1. Keep the corrupt blob in `localStorage` under `ie_save_corrupt_<ts>` for diagnostics (non-blocking).
  2. Fall back to `createInitialState()`.
  3. Toast: "Save was corrupted; started a fresh empire." (warn, not error spam).
- Partial corruption (some fields bad): repair known-good fields, regenerate the rest from defaults; only full failure → fresh start.

## 3.8 Save Integrity
- **Atomic write:** write to a temp key, then rename to `SAVE_KEY` (or write full JSON in one `setItem`; `setItem` is synchronous/atomic per key in practice). Avoid partial writes.
- **Quota:** wrap `setItem` in try/catch (QuotaExceeded → `saveStatus:"error"` + toast, like current `gameStore.ts:127`).
- **Determinism:** never serialize functions, DOM refs, or `feedbackStore`. Only `GameState` (+ envelope) is persisted.
- **Delta integrity (critical):** `ActivityOutcome.resources` carry **absolute** target values (`current.followers + f`). The apply step (`gameStore.ts:230-242`) must treat them as deltas merged over current, not as full replacement of `resources`, to avoid clobbering money/energy set elsewhere. Enforce via test in P0-1.
- **Save triggers:** currently `setPlayerName`, `endDay`. Add: every milestone, every purchase, every dialogue commit (debounced) in P0-2.

---

# 4. Testing Constitution

## 4.1 Unit Testing Strategy
- **Tool:** Vitest (already configured). **Target:** pure logic in `game/data/*` and store reducers in `game/state/*`.
- Test pure resolvers with injected `rng` (deterministic seeds) — e.g. `post(rng, res, opts)` with `rng = () => 0` (always flop-ish) and `() => 0.99` (viral/mega) to force tiers.
- **P0-1 required units:** `doActivity` (all guards + tiers), `endDay` (upkeep/churn/bankruptcy/win), `checkMilestones`, `selectDialogueChoice` (rel/res/flag/unlock), `clearDaySummary`→`startRandomEvent`, `setPlayerName`, save migrate/validate round-trip.
- Store tests use `useGameStore.getState()` + `act()`; reset via `resetGame()` between cases.

## 4.2 Integration Testing Strategy
- **Scope:** cross-module flows with real data but mocked `localStorage` + `audio`.
  - Full day loop: doActivity ×N → endDay → daySummary correct → random event may fire → next day state valid.
  - Story chain: goToLocation(studio) → selectDialogueChoice path → relationship/flag applied → repeat encounter later.
  - Save cycle: mutate → saveGame → clear store → loadGame → deep-equal (modulo ephemeral UI fields).
- **Rule:** integration tests exercise the store API exactly as the UI does (no internals).

## 4.3 Component Testing Strategy
- **Tool:** Vitest + React Testing Library (add `@testing-library/react` in P3-3/CI). Lightweight; focus on:
  - Overlay self-gating (ViralMoment shows only when `viralMoment` set).
  - BottomNav `aria-current` + active indicator on screen change.
  - ActivityList renders Visible Odds from creativity.
  - AnimatedNumber count-up within tolerance.
- **Rule:** components tested against store state, not implementation; avoid snapshot fragility.

## 4.4 Regression Testing
- Every bug fix adds a regression test named `*.regression.test.ts` or `it("regression: …")`.
- Critical regressions tracked: save migration, delta-apply integrity, mega-viral gate, bankruptcy threshold.
- CI (P3-3) blocks merge if any test fails.

## 4.5 Performance Testing
- **Targets:** initial JS ≤ 120 KB gzip (currently 92.8); time-to-interactive < 1.5 s on mid phone; no store action > 5 ms for state ≤ 1k journal entries.
- **Guard:** `MapScreen` selector granularity (P0-5) verified by render-count check (DevTools or a render counter in test).
- **Future:** journal virtualization when entries > 200 (P2-3).

## 4.6 Coverage Targets
- **Logic (`game/data`, `game/state`): ≥ 90%** line+branch (economy/event branches 100%).
- **Components:** ≥ 60% (smoke + key interactions).
- Global gate: do not reduce coverage on PR.

## 4.7 Test Organization
```
src/game/data/*.test.ts        # pure resolver tests
src/game/state/*.test.ts       # store/slice tests (incl. saveSlice)
src/components/**/*.test.tsx   # component tests
```
Co-locate tests next to source; mirror folder structure.

## 4.8 Naming Conventions
- `*.test.ts(x)` beside source. Test groups: `describe("unit: doActivity")`. Cases: `it("rejects when energy < cost")`.
- Determinism helpers: `const rng = (v:number)=>()=>v;` placed in test.
- Fixtures: `makeState(overrides)` factory in `state/testUtils.ts` (create in P0-1).

---

# 5. Coding Constitution

## 5.1 Folder Structure
- Per §1.2. **Rule:** no file outside its layer imports downward; new feature = new `data/*.ts` + (if stateful) slice + (if UI) component under `components/game`.
- `lib/` = framework-agnostic utilities only. `assets/` = SVG React, no logic.

## 5.2 Naming Conventions
- **Files:** `kebab-case.ts(x)`; tests `kebab-case.test.ts(x)`.
- **Types:** `PascalCase` interfaces/types; `SCREAMING_SNAKE` for constants (`FINAL_GOAL`, `SAVE_KEY`).
- **Functions:** `camelCase`; pure resolvers verb-led (`computeDaySummary`, `rollTier`, `post`).
- **Stores:** `useXStore`; slices `xSlice.ts` exporting `createXSlice`.
- **Components:** `PascalCase.tsx`; screen components `XScreen.tsx`; primitives in `ui/` generic.
- **Events/actions:** imperative verb (`doActivity`, `endDay`, `saveGame`).

## 5.3 TypeScript Rules
- `strict: true` (already). No `any`; prefer `unknown` + narrowing.
- No type-only runtime imports; `import type` for types.
- Discriminated unions for outcomes/tiers (`OutcomeTier`).
- All `GameState` mutations immutable (spread), never mutate in place (current code complies).
- Enums → string-literal unions (`ScreenId`, `LocationId`, `NpcId`).
- `tsc --noEmit` must pass in CI.

## 5.4 Zustand Rules
- **Slice pattern (post P0-3):** `create<T>()((set,get)=>({...sliceA, ...sliceB}))`; slices are pure factories receiving `(set, get)`.
- Never call `useGameStore` (the hook) inside the store definition; use `get()`/`set()` or `useOtherStore.getState()` for cross-store (one-way only).
- Selectors: `useGameStore(s => s.resources.followers)` or granular hooks (`useResources()`). **No whole-state subscription in screens** (fixes MapScreen).
- Ephemeral UI (screen, toasts, overlays visibility) → separate `uiSlice` or component state, not domain `GameState`.
- Actions return plain results; side-effects (audio/feedback) at the edge (component or a thin effect subscriber), not buried in reducer (refactor `checkMilestones` `celebrate` call in P0-3).

## 5.5 React Component Rules
- Function components only; `React.memo` for list rows (ActivityList cards) to avoid re-render storms.
- Keep components presentational; read store via selectors, write via actions.
- `key={screen}` for `AnimatedScreen` (already) — preserve for transitions.
- No business logic in components; delegate to store/data.
- Default export only for `App`; named exports elsewhere.

## 5.6 Performance Rules
- Granular selectors (§5.4). Memoize derived lists (`useMemo`) for filtered activities/events.
- Avoid `JSON.stringify` in render; debounce saves (P0-2).
- Lazy-load screens (P3-6). Cap journal render (virtualize at >200, P2-3).
- No synchronous layout thrash in `feedbackStore` spawn (uses `window` coords, fine).

## 5.7 Error Handling
- Stores: guard all external input (bad id, missing node) → return result object or no-op, **never throw** into UI.
- Save: try/catch + corruption fallback (§3.7).
- Audio: wrap `AudioContext` creation in try/catch; degrade silently if unsupported.
- Surface user-facing failures via `showToast(..., "warning")`, not `console.error` only.

## 5.8 Logging
- No `console.log` in production paths. Use a tiny `lib/logger.ts` with levels; `debug` stripped in build.
- Log only: save failures, migration events, validation errors (to `ie_save_corrupt_<ts>`).
- Never log `playerName` or save payload contents in plaintext to console.

## 5.9 Documentation
- Public types documented in `types/index.ts`. Complex resolvers (`post`, `rollTier`) get a one-line intent comment (code comments allowed in this repo per existing style; keep minimal).
- Every new data table gets a header comment describing its shape + how to extend.
- Constitution/changelog updated per Phase (see `PROJECT_CONSTITUTION.md` living-doc rule).

## 5.10 Accessibility
- Keyboard operable: all interactive elements focusable; `BottomNav` uses `aria-current="page"` (already).
- Visible `:focus-visible` outline (global in `styles.css`) — preserve.
- `role="dialog"` + focus trap for overlays (Intro/End/Viral/DaySummary) — **add** in P3-2.
- `Intl.NumberFormat` for counts (P3-1) — respects locale.
- Color contrast AA; do not convey state by color alone (icons + text).

## 5.11 Code Review Checklist
- [ ] No new whole-state subscription; granular selectors used.
- [ ] New content is data-only (no store logic edit) unless Phase requires logic.
- [ ] All randomness injected (`rng`) — logic unit-tested.
- [ ] Store mutation immutable + delta-safe (§3.8).
- [ ] Save: new state key has migration path + default + validation.
- [ ] `tsc`, `lint`, `test`, `build` green.
- [ ] Accessibility: keyboard + focus-visible + aria where needed.
- [ ] Constitution/changelog updated.

---

# 6. Architecture Decision Records (ADRs)

Each ADR: **Decision · Context · Options considered · Rejected alternatives · Consequences.**

### ADR-001 · Why React
- **Decision:** React 19 SPA.
- **Context:** UI-heavy, stateful game; team familiarity; huge ecosystem.
- **Options:** React, Vue, Svelte, Solid, vanilla.
- **Rejected:** Vue (team less fluent); Svelte/Solid (smaller ecosystem, risk for long-lived project); vanilla (too much boilerplate for this UI density).
- **Consequences:** Leverages RSC-free CSR; pairs with Vite; component model fits screen/overlay architecture.

### ADR-002 · Why Zustand
- **Decision:** Zustand 5 for state.
- **Context:** Need minimal boilerplate, hook-based selectors, testable outside React.
- **Options:** Redux Toolkit, Context+useReducer, MobX, Zustand.
- **Rejected:** Redux (verbose, boilerplate-heavy for a small game); Context (re-render storms without manual splitting — exactly the MapScreen risk); MobX (magic, harder to test/predict).
- **Consequences:** Tiny bundle; selector granularity possible (must be enforced per §5.4); slice pattern clean for P0-3.

### ADR-003 · Why Data-Driven Architecture
- **Decision:** Content (locations, activities, NPCs, dialogue, events) as serializable data + pure resolvers.
- **Context:** Game needs frequent content expansion with low risk.
- **Options:** Hard-coded logic per feature; data-driven; script/DSL.
- **Rejected:** Hard-coded (every content add = logic change = bugs); DSL (over-engineering for scope).
- **Consequences:** 10×/100× content (§8) is data-only; enables mod support; resolvers stay tested.

### ADR-004 · Why Local Save (localStorage)
- **Decision:** Persist to `localStorage` only.
- **Context:** No backend; offline-first; privacy; zero infra cost.
- **Options:** localStorage, IndexedDB, backend API, file export.
- **Rejected:** IndexedDB (overkill for <100 KB saves); backend (contradicts indie/offline posture, D-007 privacy); file export (poor UX on mobile).
- **Consequences:** Simple; capped ~5 MB; needs migration layer (§3) for evolution; cloud save is a later additive (§8).

### ADR-005 · Why Synthesized Audio
- **Decision:** Web Audio synth (`lib/audio.ts`), no audio asset files.
- **Context:** 15+ SFX; tiny bundle; no licensing; dynamic.
- **Options:** Asset files (mp3/wav), synth, third-party lib.
- **Rejected:** Asset files (bundle bloat, licensing, load latency); heavy libs (Howler) unnecessary.
- **Consequences:** ~0 KB audio weight; fully mutable; enables adaptive music (P3-4) by layering oscillators.

### ADR-006 · Why Store Slices
- **Decision:** Refactor god store into slices (P0-3).
- **Context:** `gameStore.ts` is 405 LOC mixing domain + UI + save + events; hard to test/maintain (audit critical gap).
- **Options:** Keep monolith; slice refactor; class-based store.
- **Rejected:** Keep monolith (tech-debt, test fragility); class store (un-idiomatic for Zustand, breaks hooks).
- **Consequences:** Composable, testable slices; clean attachment point for P1/P2 features; public action API unchanged ⇒ backward compatible.

### ADR-007 · Why Current Project Structure
- **Decision:** `game/{types,data,state}` + `components/{ui,game,assets}` layered split.
- **Context:** Clear separation of logic vs presentation; scales to planned systems.
- **Options:** Feature-folders (`features/x/{data,ui,state}`), flat, layered (chosen).
- **Rejected:** Feature-folders (cross-feature data sharing — activities reference locations/story — would cause circular deps); flat (unmanageable at 10× content).
- **Consequences:** Shared `data/` is the single content hub; components consume; minor duplication of "game" naming (`components/game` vs `game/`) acceptable and documented.

---

# 7. Dependency & Risk Analysis

## 7.1 Dependency Graph (feature-level)
```
P0-1 ─┐
P0-2 ─┼─► P0-3 (slice refactor) ─► P1-1..P1-5 ─► P2-1 ─► P2-2
P0-4 ─┘                                    │            │
P0-5 ──────────────────────────────────────┘            │
P2-2 (prestige) ── needs ── P0-2 (migration)
P3-5 (cosmetics) ── needs ── P0-2 + P3-1
P3-3 (CI) ── needs ── P0-1 (tests exist)
```
Runtime deps: react, react-dom, zustand, lucide-react, cva, clsx, tailwind-merge. Build: vite, typescript, tailwind, eslint, vitest.

## 7.2 Critical Path
**P0-1 → P0-3 → P1-1 → P1-5 → P2-1 → P2-2.**
The single most important edge: **no P1/P2 feature before P0-3** (avoids bolting onto the monolith, the audit's top risk).

## 7.3 Risk Matrix
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Save corruption after schema change | Med | High | §3 migration+validation+fallback (P0-2) |
| Regression in economy after slice refactor | Med | High | P0-1 tests guard refactor (P0-3) |
| Unbounded journal/state growth | Low | Med | Virtualize at >200 (P2-3); capped writes |
| Whole-state re-renders (perf) | Med | Low | P0-5 selectors |
| Balance drift across systems | Med | Med | `balance.ts` single source (P0-4) |
| String/number drift in i18n | Low | Low | P3-1 extraction + lint |
| Scope creep (add logic per content) | High | Med | Data-only rule enforced in review |

## 7.4 Technical Debt Map
| Location | Debt | Severity | Paydown |
|----------|------|----------|---------|
| `gameStore.ts` 405 LOC | god store, mixed concerns | High | P0-3 |
| `deserializeState` | no version/validation | High | P0-2 |
| `activities.ts:21-34` | hard-coded balance | Med | P0-4 |
| `MapScreen.tsx:24` | whole-state sub | Med | P0-5 |
| `checkMilestones` celebrate call | logic→DOM coupling | Low | P0-3 |
| `feedbackStore` setTimeout cleanup | minor leak if unmount mid-float | Low | P3-4 pass |
| No CI | regressions ship silently | Med | P3-3 |

## 7.5 Refactor Impact Analysis (P0-3)
- **Blast radius:** all components import `useGameStore`; action signatures must stay identical.
- **Safe path:** keep `useGameStore` as composition root exporting same actions; move bodies into slices; add selector hooks (`useResources`, `useRelationships`) for components to adopt incrementally.
- **Test gate:** P0-1 tests must pass before and after — if they fail post-refactor, refactor is wrong (not the tests).
- **No migration of save needed by P0-3 itself** (save shape unchanged); P0-2 can land independently but both should ship together in v0.6.

---

# 8. Future Scalability Plan

## 8.1 10× More Content
- Add locations/activities/NPCs/dialogue as data entries only (ADR-003). `data/*` scales linearly; no logic edits. Selectors + `useMemo` keep render cost flat. Indexed lookup maps (`byId`) prevent O(n) scans when content grows.

## 8.2 100× More Events
- Replace fixed `RANDOM_EVENTS` array with a **weighted pool** (`{id, weight, condition}`). Event resolution becomes `pickWeighted(rng, pool.filter(condition))`. Story events already priority/flag-gated → generalize to a scheduler. No UI change.

## 8.3 New Game Modes
- `mode: "classic" | "empire" | "prestige"` field in `GameState` (migrated in §3). `economySlice` branches on mode (churn scaling, win condition). Screens read mode for variant copy. Modes are data+small branch, isolated in slices.

## 8.4 Mod Support
- Load external data packs at boot: `loadContentPack(json)` merges into `data` registries (locations/activities/dialogue). Validate against schema (§3.4). Keep core immutable; mods additive only. Enables community content without code changes.

## 8.5 Cloud Save
- `saveSlice` abstraction: `SaveBackend` interface (`local`, `steam`, `icloud`, `google`). Local remains default; cloud is an additive backend (no shape change; same envelope). Conflict resolution = last-write-wins + version compare. Does not affect domain logic.

## 8.6 Multiplayer (if ever required)
- Current architecture is single-client deterministic. Multiplayer would need: a shared `GameState` sync layer (server authoritative), action replay, and conflict merge. **Not planned** (D-007 single-player indie). Documented as out-of-scope; if required, isolate behind a `netSlice` that wraps actions with optimistic updates — domain resolvers stay pure and reusable.

## 8.7 Mobile Deployment
- Vite PWA + Capacitor/Tauri wrapper. UI already mobile-first (`h-dvh`, BottomNav, touch targets). Add: offline service worker (localStorage already offline), safe-area insets, haptics (hook into `feedbackStore`). No domain changes.

## 8.8 Desktop Deployment
- Electron/Tauri shell around the same SPA. Larger screens → optional two-pane Map+Feed. Save layer unchanged (local file or localStorage). Steam achievements hook into `achievements` slice (P1-3).

---

# 9. Final Engineering Blueprint

## 9.1 Executive Summary
Influencer Empire is a client-only, data-driven React/Zustand game. Today it works end-to-end but carries three critical risks (untested god store, unsafe saves, monolithic store). This blueprint freezes the architecture and prescribes a debt-first path: **Phase 0 hardens the foundation (tests, save system, slice refactor, balance config, selectors); Phases 1–4 add data-driven features on top.** All expansion is content-as-data; all logic stays pure and tested; all saves are versioned and recoverable.

## 9.2 Golden Rules (non-negotiable)
1. **No game code changes until the target Phase is approved** and its §2 constitution block is finalized.
2. **Phase 0 first.** P0-1/2/3 are prerequisites; P1+ cannot start without them.
3. **Content = data.** New features prefer data entries over logic edits.
4. **Pure + injected RNG.** All resolvers testable; no hidden randomness.
5. **Immutable, delta-safe state.** No in-place mutation; outcome resources applied as deltas.
6. **Versioned, validated, recoverable saves.** Every new state key gets migration + default + validation.
7. **Granular selectors.** No whole-state subscriptions in screens.
8. **Green gates.** `tsc` + `lint` + `test` + `build` must pass; CI enforces (P3-3).
9. **Docs are live.** Constitution/changelog updated each Phase.

## 9.3 Document Map (SSoT trio)
- `PROJECT_CONSTITUTION.md` — product/design authority (what & why).
- `ENHANCEMENT_MASTER_PLAN.md` — feature roadmap (when, in what order).
- `ENGINEERING_BLUEPRINT.md` — this file: architecture, standards, specs, ADRs, risks, scalability (how, safely).

## 9.4 How to Use This Document
- Starting a Phase? Open its §2 constitution block; confirm dependencies/acceptance; implement against §5 coding rules; cover with §4 tests; verify §3 save impact; update §7 debt map + constitution changelog.
- Proposing a new feature? Add its §2 block + a Master-Plan entry + (if arch-impacting) an ADR. Get approval before code.
- Reviewing a PR? Run the §5.11 checklist.

## 9.5 Implementation Start Point
When approved, begin **P0-1 (Store Unit Tests)** — it both de-risks the P0-3 refactor and satisfies the audit's only critical gaps, with zero behavior change.

---
*End of Engineering Blueprint. Frozen for Pre-Phase. Next action: approval to enter Phase 0.*
