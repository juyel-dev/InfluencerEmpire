# Decisions

Engineering memory. Every major decision records the problem, solution, alternatives, and trade-offs.

---

## D1 — Data-Driven Activity Engine

**Problem:** `doActivity` was a 115-line `if/else` ladder with activity effects (random ranges, resource deltas, requirements, journal text) hardcoded in the store. Adding or balancing activities required editing store logic.

**Solution:** Extracted all activity behavior into `src/game/data/activities.ts` as `ACTIVITY_EFFECTS: Record<string, ActivityEffectDef>`. `doActivity` is now a ~25-line generic resolver handling gating + applying the effect's outcome.

**Alternatives considered:**
- Keep ladder but extract to a separate function inside the store — rejected (still in store, still code-not-data).
- Class-based activity objects with methods — rejected (over-abstraction for static config).

**Why selected:** Activities are *content*, not behavior. Data-driven config lets designers tune balance without touching logic, and keeps the store small.

**Trade-offs:** Effects are functions (not serializable), but activities are static config, never part of `GameState`, so this is safe.

**Long-term:** New activities are pure data additions. Store stays frozen.

---

## D2 — Design Tokens via Tailwind v4 `@theme`

**Problem:** Hardcoded hex colors (`#0a0a1a`) appeared in 3+ files; no centralized theming.

**Solution:** Defined all colors, radii, and font as CSS custom properties in `styles.css` under `@theme`. Consumed as utility classes (`bg-bg-primary`, `text-accent-cyan`).

**Why selected:** Tailwind v4's native token system; zero runtime cost; themeable.

**Trade-offs:** Requires discipline to use tokens everywhere (enforced via review).

---

## D3 — Path Aliases

**Problem:** Deep relative imports (`../../../game/state/gameStore`) were fragile and hard to refactor.

**Solution:** Configured `@game`, `@components`, `@ui`, `@assets`, `@lib` in both `tsconfig.json` and `vite.config.ts`.

**Why selected:** Stable imports; clear module boundaries.

---

## D4 — `cn()` Utility

**Problem:** Components manually concatenated `className` strings; `clsx` + `tailwind-merge` were installed but unused.

**Solution:** `src/lib/cn.ts` = `clsx` + `tailwind-merge`. All UI components use it.

**Why selected:** Conflict-free variant merging; standard ecosystem pattern.

---

## D5 — Single-Source Milestones

**Problem:** `MILESTONE_LABELS` (store) duplicated `FOLLOWER_GOALS` (types) — two sources of truth.

**Solution:** Replaced both with `MILESTONES: { goal, label }[]` in `types/index.ts`. Store derives goals/labels from it.

---

## D6 — SVG Illustration & Character Systems

**Problem:** UI used emoji for icons/portraits; no reusable visual language.

**Solution:** `assets/illustrations` (theme-aware SVGs using `currentColor`) and `assets/characters/CharacterPortrait` (parametric SVG with expressions + accessories).

**Why selected:** Scalable, editable, theme-aware, consistent — replaces emoji with a real asset framework.

---

## D7 — Quality Gates (tsc + ESLint + Vitest)

**Problem:** No lint or tests; only TypeScript strict mode.

**Solution:** Added ESLint (flat config, `typescript-eslint`, `no-explicit-any: error`) and Vitest with tests for the activity engine. `package.json` scripts: `build`, `lint`, `test`.

**Why selected:** Enforces correctness on every change; tests guard the pure logic-heaviest module.

---

## D8 — Dead-Code & Unused-Dep Cleanup

**Problem:** `isRunning`, `Toast.resource/delta`, `GameSettings`/`SaveData` types, `Npc.introduction`, `unlocksActivity` were all dead. `lucide-react` / `class-variance-authority` installed but unused.

**Solution:** Removed dead code. `unlocksActivity` (set an unread `activity_X` flag) removed as orphaned. Kept `unlocksLocation` (its flag is read by `goToLocation`).

**Trade-offs:** `lucide-react` / `class-variance-authority` remain in `package.json` (unimported → zero runtime impact); recommend removal if not planned.
