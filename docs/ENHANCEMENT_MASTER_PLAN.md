# Influencer Empire — Game Enhancement Master Plan

> **Status:** Planning document, single source of truth. **No game code is modified until a phase is approved for implementation.**
> **Companion docs:** `PROJECT_CONSTITUTION.md` (authority), audit report (2026-07-09).
> **Guiding principles:** minimize technical debt · preserve backward compatibility · maximize long-term maintainability · data-driven expansion only.

---

## 0. Guiding Rules for Implementation

1. **Backward compatibility is mandatory.** Every save from a prior version must load via a versioned migration (`SAVE_VERSION`). No breaking schema changes without a migrator entry.
2. **Content is data.** New locations, activities, NPCs, events, items, missions = data entries in `src/game/data/`. No engine/store logic changes required.
3. **Logic stays tested.** Any change to `gameStore.ts` economy/win/lose/random-event logic requires a matching unit test in `src/game/state/`.
4. **Slices over god-store.** The store refactor (Phase 0) must complete *before* meta-progression features land, so new systems attach to clean slices, not the 405-line monolith.
5. **Balance in config.** All tuning numbers move to `src/game/data/balance.ts` (constitution D-006).
6. **Definition of Done (per feature):** `tsc` clean · `eslint .` clean · `vitest run` green · `npm run build` succeeds · acceptance criteria met · Constitution changelog updated.

---

## Phase 0 — Hardening & Foundation (prerequisite for everything)

> **Goal:** De-risk the store, make saves safe, and establish test coverage. No player-visible features.

### P0-1 · Store Unit Tests
- **Description:** Test `doActivity` (tier deltas, costs, oncePerDay, requires), `endDay` (upkeep, churn, bankruptcy, win/lose), `checkMilestones`, random-event chaining (`clearDaySummary` → `startRandomEvent`), `setPlayerName` persistence.
- **Dependencies:** None.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** `gameStore.test.ts` covers all resolvers and economy edges; 100% of economy branches asserted; flakiness <1% over 200 runs.
- **Files:** `src/game/state/gameStore.test.ts` (new).
- **Backward compat:** N/A (tests only).

### P0-2 · Save Schema Validation + Versioned Migration
- **Description:** Replace ad-hoc `dayStartResources`/`lost`/`playerName` patches in `deserializeState` with a `SAVE_VERSION` field + `migrateSave(v, data)` switch. Validate shape; drop/repair corrupt fields instead of trusting them.
- **Dependencies:** None.
- **Complexity:** Medium. **Risk:** Medium (save corruption if migration wrong).
- **Acceptance:** Malformed/corrupt save loads to a safe default or migrates without throwing; old `ie_save_v2` still loads; new saves carry `version`.
- **Files:** `src/game/state/gameStore.ts` (`deserializeState`, `serializeState`).
- **Backward compat:** Yes — migrator handles pre-version saves.

### P0-3 · Store Slice Refactor
- **Description:** Split `gameStore.ts` (405 LOC) into composable slices: `saveSlice` (serialize/deserialize/migrate), `economySlice` (upkeep/churn/bankruptcy/endDay), `eventSlice` (story + random events), `progressSlice` (milestones/win/lose). `gameStore` becomes composition root; public action signatures unchanged.
- **Dependencies:** P0-1 (tests guard the refactor), P0-2.
- **Complexity:** Hard. **Risk:** Medium (regression surface).
- **Acceptance:** Public store API identical; all P0-1 tests pass unchanged; `gameStore.ts` ≤ ~120 LOC; slices in `src/game/state/slices/`.
- **Files:** `src/game/state/gameStore.ts`, new `src/game/state/slices/*`.
- **Backward compat:** Yes — external callers unaffected.

### P0-4 · Balance Config Extraction
- **Description:** Move `post()` dice ranges + tier chances (`activities.ts:21-34`) into `src/game/data/balance.ts`. Logic reads config; no hard-coded numbers in resolve functions.
- **Dependencies:** None.
- **Complexity:** Easy. **Risk:** Low.
- **Acceptance:** All balance numbers external; `activities.test.ts` updated to assert against config; constitution D-006 satisfied.
- **Files:** `src/game/data/balance.ts` (new), `src/game/data/activities.ts`.
- **Backward compat:** Yes.

### P0-5 · MapScreen Selector Granularity
- **Description:** Replace whole-state subscription (`MapScreen.tsx:24` `useGameStore(s => s.state)`) with granular selectors (`useResources()`, `useRelationships()`) to avoid re-renders on unrelated ticks.
- **Dependencies:** None.
- **Complexity:** Easy. **Risk:** Low.
- **Acceptance:** MapScreen re-renders only on referenced field changes; verified via React DevTools render count.
- **Files:** `src/components/game/screens/MapScreen.tsx`, `src/game/state/*.ts` (selector hooks).
- **Backward compat:** Yes.

**Phase 0 Exit Criteria:** ✅ COMPLETE (2026-07-10) — Store fully tested (26 new store tests, 38 total), saves validated+migrated (v3 envelope, legacy fallback, corruption quarantine), store is a ~30-line composition root over typed slices, balance externalized to `balance.ts`, no player-visible regression (build green, 94 KB gzip).

---

## Phase 1 — Meta-Progression (v0.6 → v0.7)

> **Goal:** Give the loop long-term goals beyond the 10K win. Builds on P0 slices.

### P1-1 · Competitor AI (Rival Leo)
- **Description:** Leo gains followers on a parallel curve each `endDay`, scaled by day; player can "beat" him for bonus relationship/perks. Visible rival stat in Journal.
- **Dependencies:** P0-3 (economySlice), P0-4.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Leo followers update daily; beating him triggers a perk (e.g., +creativity); no crash if Leo undefined.
- **Files:** `economySlice`, `JournalScreen.tsx`, `src/game/data/balance.ts`.
- **Backward compat:** Yes (new field in state, default 0).

### P1-2 · Missions System
- **Description:** Rotating objectives (e.g., "Gain 200 followers this week", "Do 3 brand-safe posts") with bonus rewards. Data-driven mission defs + check logic in `progressSlice`.
- **Dependencies:** P0-3.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** 1–2 active missions shown in a new Missions screen/tab; completion grants reward; rotates on completion/day.
- **Files:** `src/game/data/missions.ts` (new), `progressSlice`, `src/components/game/screens/MissionsScreen.tsx` (new).
- **Backward compat:** Yes.

### P1-3 · Achievements
- **Description:** ~30 achievements (first viral, first flop survived, bankruptcy avoided, 1K/5K/10K, all NPCs met). Emitted from slice checks.
- **Dependencies:** P0-3.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Achievements unlock + toast; persisted in state; listed in Journal/Missions screen.
- **Files:** `src/game/data/achievements.ts` (new), `progressSlice`, UI list.
- **Backward compat:** Yes.

### P1-4 · Equipment / Gear Shop
- **Description:** Spend money on tiered gear that boosts creativity or viral chance. Shop screen + `ownsGear` in state; gear affects `post()` via balance config.
- **Dependencies:** P0-3, P0-4.
- **Complexity:** Medium. **Risk:** Medium (balance interaction).
- **Acceptance:** Buying gear applies permanent bonus; reflected in Visible Odds; save persists ownership.
- **Files:** `src/game/data/gear.ts` (new), `economySlice`, `ShopScreen.tsx` (new).
- **Backward compat:** Yes (new state field).

### P1-5 · Brand-Deal System
- **Description:** Recurring sponsorship offers (unlocked via Omar relationship) with money now vs reputation cost (sellout tradeoff). Data-driven deal defs.
- **Dependencies:** P0-3, P1-1 (Omar).
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Deals appear on cadence; accepting grants money + reputation penalty; refusal preserves reputation.
- **Files:** `src/game/data/brandDeals.ts` (new), `eventSlice`, UI.
- **Backward compat:** Yes.

**Phase 1 Exit Criteria:** Persistent meta-goals exist; players have reasons to replay; all new state fields migrated via P0-2.

---

## Phase 2 — Content & Systems Expansion (v0.8)

### P2-1 · Empire Mode (Endless)
- **Description:** Post-win endless mode with harder algorithm churn + global leaderboard hook (local score; cloud later).
- **Dependencies:** P0-3, P1-1.
- **Complexity:** Medium. **Risk:** Medium (balance at scale).
- **Acceptance:** After win, "Empire Mode" toggle; churn scales; leaderboard shows best score locally.
- **Files:** `progressSlice` (win handling), `EndScreen.tsx`, `src/game/data/balance.ts`.
- **Backward compat:** Yes.

### P2-2 · Prestige / Rebirth
- **Description:** Reset to Day 1 keeping cosmetic unlocks + one "starting edge" (perk token). Opt-in.
- **Dependencies:** P0-2 (migration), P1-3 (achievements as token source).
- **Complexity:** Hard. **Risk:** Medium.
- **Acceptance:** Prestige resets resources/relationships but keeps tokens + cosmetics; token spent on permanent perk.
- **Files:** `saveSlice` (prestige reset), `progressSlice`, UI.
- **Backward compat:** Requires migration (P0-2).

### P2-3 · Social Feed Timeline
- **Description:** Posts accumulate in a feed with likes/comments for immersion + nostalgia. Data-driven from activity journal.
- **Dependencies:** P0-3.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Feed shows historical posts with simulated engagement; scrollable; no perf regression.
- **Files:** `src/game/data/feed.ts` (derive), `FeedScreen.tsx` (new) or Journal tab.
- **Backward compat:** Yes.

### P2-4 · New City Pack (data expansion)
- **Description:** 2+ new locations with activities/events. Pure data.
- **Dependencies:** None (data-driven).
- **Complexity:** Easy. **Risk:** Low.
- **Acceptance:** New locations appear day-gated; fully playable; no store changes.
- **Files:** `src/game/data/locations.ts`, `activities.ts`, `story.ts`.
- **Backward compat:** Yes.

### P2-5 · Creator Specializations
- **Description:** Gamer/beauty/tech trees that alter available activity sets + perks.
- **Dependencies:** P0-4, P1-4.
- **Complexity:** Hard. **Risk:** Medium.
- **Acceptance:** Choosing a niche changes activity availability + bonuses; persisted.
- **Files:** `src/game/data/specializations.ts` (new), `economySlice`, UI.
- **Backward compat:** Yes (default specialization).

---

## Phase 3 — Polish, Platform & Live-Ops (v0.9 → v1.0)

### P3-1 · Internationalization (i18n)
- **Description:** Extract all UI strings to `src/game/data/i18n/en.ts`; `Intl.NumberFormat` for counts; language toggle in Settings.
- **Dependencies:** None.
- **Complexity:** Medium. **Risk:** Medium (string drift).
- **Acceptance:** All visible text externalized; number formatting localized; language persists.
- **Files:** `src/game/data/i18n/*` (new), components.
- **Backward compat:** Yes.

### P3-2 · Controller & Keyboard Navigation
- **Description:** Full focus-order nav + gamepad input layer; d-pad moves between locations/activities.
- **Dependencies:** P3-1 optional.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Playable start-to-win with keyboard only; focus-visible already present (`styles.css`).
- **Files:** `BottomNav`, `MapScreen`, `ActivityList`, input hook.
- **Backward compat:** Yes.

### P3-3 · CI/CD (GitHub Actions)
- **Description:** On push/PR: `tsc` + `eslint` + `vitest` + `vite build`. Blocks merge on failure.
- **Dependencies:** P0-1 (tests exist).
- **Complexity:** Easy. **Risk:** Low.
- **Acceptance:** Pipeline runs in <3 min; fails loudly on any gate.
- **Files:** `.github/workflows/ci.yml` (new).
- **Backward compat:** N/A.

### P3-4 · Adaptive Music & Stereo SFX
- **Description:** Loop-based music beds per location in `lib/audio.ts`; `StereoPanner` for positional cues.
- **Dependencies:** None.
- **Complexity:** Medium. **Risk:** Low.
- **Acceptance:** Music beds loop seamlessly; SFX pan by source; mute respected.
- **Files:** `src/lib/audio.ts`.
- **Backward compat:** Yes.

### P3-5 · Cosmetic Store (Hybrid Model)
- **Description:** Avatar emoji packs, UI theme skins, name colors. Earnable + optional IAP (constitution D-007: cosmetic only).
- **Dependencies:** P0-2 (persist unlocks), P3-1.
- **Complexity:** Medium. **Risk:** Medium (store/UI).
- **Acceptance:** Cosmetics apply visually; owned set persists; no gameplay effect.
- **Files:** `src/game/data/cosmetics.ts` (new), Settings/Shop UI.
- **Backward compat:** Yes.

### P3-6 · Route Code-Splitting
- **Description:** `React.lazy` per screen to shrink initial bundle (currently 92 KB gzip).
- **Dependencies:** None.
- **Complexity:** Easy. **Risk:** Low.
- **Acceptance:** Initial JS reduced; screens load on demand; no visual regression.
- **Files:** `App.tsx`, `vite.config.ts` (manualChunks optional).
- **Backward compat:** Yes.

---

## Phase 4 — Live Operations & Expansion (post-v1.0)

- **S1:** Seasonal events (themed activities/events, 2–4 wks).
- **S2:** Cloud save (Steam/iCloud/Google) — extends P0-2 save layer.
- **S3:** Leaderboards (global + friends) — extends P2-1.
- **S4:** City/Expansion DLC packs (data).
- **S5:** Cancel-culture / reputation-recovery arc (new event chain).
- **S6:** Collab videos (relationship-gated viral events).

Each entry follows the same feature template (deps, complexity, risk, acceptance, files, compat) when scheduled.

---

## Dependency Graph (high level)

```
P0-1 ─┐
P0-2 ─┼─> P0-3 (slice refactor) ─> P1-* (meta-progression) ─> P2-* (expansion) ─> P3-* (platform/live-ops)
P0-4 ─┘                                   │                                        │
P0-5 ─────────────────────────────────────┘                                        │
                                                            P2-2 (prestige) needs P0-2
                                                            P3-5 (cosmetics) needs P0-2 + P3-1
```

**Critical path:** P0-1 → P0-3 → P1-1..P1-5 → P2-1 → P2-2. Do **not** start P1/P2 features before P0-3 lands (avoids bolting systems onto the god-store).

---

## Complexity & Risk Summary

| Phase | Dominant Complexity | Dominant Risk | Debt Impact |
|-------|--------------------|---------------|-------------|
| P0 | Medium (slice refactor) | Medium (save migration) | **Reduces** debt significantly |
| P1 | Medium | Low–Medium | Neutral (data-driven) |
| P2 | Medium–Hard (prestige/spec) | Medium (balance at scale) | Neutral if config-driven |
| P3 | Easy–Medium | Low–Medium | **Reduces** (i18n, CI, splitting) |
| P4 | Easy (data) | Low | Neutral |

---

## Long-Term Roadmap (timeline-agnostic)

- **v0.6** — Phase 0 complete (tests, safe saves, slices, balance config). *De-risks all future work.*
- **v0.7** — Phase 1 (Competitor AI, Missions, Achievements, Gear, Brand Deals).
- **v0.8** — Phase 2 (Empire Mode, Prestige, Feed, City Pack, Specializations).
- **v0.9** — Phase 3 partial (i18n, CI, controller, cosmetics).
- **v1.0** — Phase 3 complete (music, code-splitting) + Steam/Mobile launch.
- **v1.x** — Phase 4 live-ops.

---

## Priority Matrix

| Priority | Features |
|----------|----------|
| **High** | P0-1, P0-2, P0-3 (foundation — everything depends on these) |
| **Medium** | P1-1..P1-5, P2-1, P2-2, P3-1, P3-3, P3-5 |
| **Low** | P2-3, P2-4, P2-5, P3-2, P3-4, P3-6, Phase 4 |

---

## Acceptance & Quality Gates (all phases)

1. `npx tsc --noEmit` — no errors.
2. `npm run lint` — clean.
3. `npm test` — green (new logic ⇒ new tests).
4. `npm run build` — succeeds.
5. Old save (`ie_save_v2`) still loads via migration.
6. No new whole-state subscriptions; selectors granular.
7. New content = data only; no store logic edits required.
8. Constitution changelog + decision log updated after each phase.

---

## Final Note

This plan turns the audit's findings into an ordered, low-debt build sequence. **Phase 0 is non-negotiable prerequisite work** — it converts the only real risks (untested store, unsafe saves, monolithic store) into a clean base, after which every subsequent feature is data-driven, testable, and backward compatible.
