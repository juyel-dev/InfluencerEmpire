# Architecture

Influencer Empire is a narrative-driven strategy RPG built with React 19, TypeScript, Vite, Tailwind CSS v4, and Zustand. This document describes the production-ready foundation. **This architecture is frozen** — extend it, do not reinvent it.

## High-Level Flow

```
User Input
   ↓
React Components (src/components)
   ↓  (read state via selectors, dispatch actions)
Zustand Store (src/game/state/gameStore.ts)
   ↓  (owns GameState, serializes to localStorage)
Data Layer (src/game/data)
   ↓  (static, serializable config: locations, npcs, story, activities)
Types (src/game/types)
```

## Directory Structure

```
src/
  main.tsx                     App entry
  App.tsx                      Root: load save → render GameShell + active screen
  styles.css                   Tailwind v4 entry + @theme design tokens + keyframes
  lib/
    cn.ts                      className composer (clsx + tailwind-merge)
  game/
    types/index.ts             All shared types + MILESTONES constant
    data/
      locations.ts             Location[] + getLocation()
      npcs.ts                  NPCS[] + getNpc()
      story.ts                 DIALOGUE_NODES, STORY_EVENTS, repeat-encounter helpers
      activities.ts            ACTIVITY_EFFECTS (data-driven activity behavior)
    state/
      gameStore.ts             Zustand store: state, save/load, navigation, activities, dialogue, milestones
  components/
    GameShell.tsx              Layout: TopBar + screen + BottomNav + Toasts
    ui/                        Reusable design-system components (Card, Button, ProgressBar, IconBox, StatCard, EmptyState, LoadingState, ErrorState)
    assets/                    Reusable visual assets
      illustrations/           Theme-aware SVG illustrations (Empty/ Success/ Error/ Warning/ Loading/ Logo)
      characters/              CharacterPortrait (parametric SVG with expressions + accessories)
    game/
      hud/                     TopBar, BottomNav
      shared/                  AnimatedScreen, ToastContainer
      features/                DialoguePanel, ActivityList, TypewriterText
      screens/                 MapScreen, StoryScreen, JournalScreen, SettingsScreen
```

## Module Boundaries

| Layer | Responsibility | May import |
|-------|----------------|-----------|
| `types` | Shared shapes & constants | nothing |
| `data` | Static, serializable game content | `types` |
| `state` | Runtime state, mutations, persistence | `types`, `data` |
| `components/ui`, `components/assets` | Presentational, reusable | `lib`, `assets`, `types` |
| `components/game` | Feature composition | `state`, `data`, `ui`, `assets`, `types` |

Dependency direction is strictly downward. UI components never import the store directly for *business logic*; they call store actions. Screens own composition.

## State Architecture

- **Single Zustand store** (`useGameStore`) holds `GameState` (serializable) plus transient UI fields (`toasts`, `saveStatus`, `lastSaveTime`).
- **Persistence:** `saveGame`/`loadGame` serialize `GameState` to `localStorage` (key `ie_save_v2`). Auto-save on `endDay`; auto-load on app boot.
- **Selectors:** Components subscribe with fine-grained selectors (`useGameStore((s) => s.state.resources)`) to limit re-renders.
- **No context providers** — the store is the single source of truth.

## Rendering Flow

`App` renders `GameShell`. The active `ScreenId` selects which screen renders inside `AnimatedScreen` (keyed transition wrapper). `StoryScreen` switches between `DialoguePanel` and `ActivityList` based on `activeDialogueNodeId`.

## Key Design Decisions (see DECISIONS.md)

- Activity behavior is **data-driven** (`ACTIVITY_EFFECTS`), not hardcoded logic.
- Design tokens are centralized via Tailwind v4 `@theme`.
- All imports use **path aliases** (`@game`, `@components`, `@ui`, `@assets`, `@lib`).

## Frozen Systems

Folder structure, module boundaries, activity engine, design tokens, UI component library, character system, SVG asset system, shared types, state management, and path aliases are production-ready infrastructure. Change them only for confirmed bugs, performance bottlenecks, or requirements that cannot fit otherwise.
