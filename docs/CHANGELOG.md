# Changelog

All notable changes are documented here. Format: version — date — summary.

## v1.0.0 — Foundation (frozen)

Initial production-ready foundation.

### Architecture
- Zustand single-store state with localStorage persistence (auto-save on End Day, auto-load on boot).
- Path aliases: `@game`, `@components`, `@ui`, `@assets`, `@lib`.
- Strict TypeScript (no `any`, `noUnusedLocals`, `verbatimModuleSyntax`).

### Systems
- **Data-driven Activity Engine** (`activities.ts`) — replaced the `doActivity` if/else ladder.
- **Design tokens** via Tailwind v4 `@theme` (colors, radii, font).
- **UI component library** (`ui/`): Card, Button, ProgressBar, IconBox, StatCard, EmptyState, LoadingState, ErrorState.
- **SVG illustration system** (`assets/illustrations`): Empty/Success/Error/Warning/Loading/Logo.
- **Character system** (`assets/characters`): parametric `CharacterPortrait` with expressions + accessories.
- **`cn()` utility** (`clsx` + `tailwind-merge`).

### Gameplay
- 6 locations, 13 activities, 5 NPCs, branching dialogue, repeat encounters.
- Milestone progression (10 → 10,000 followers) with win condition.

### Quality Gates
- ESLint (flat config, `typescript-eslint`, `no-explicit-any: error`).
- Vitest with activity-engine tests.

### Cleanup
- Removed dead code: `isRunning`, `Toast.resource/delta`, `GameSettings`/`SaveData`, `Npc.introduction`, `unlocksActivity`.
- Single-source milestones (`MILESTONES`).
