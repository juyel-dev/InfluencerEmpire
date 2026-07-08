# Design System

A token-driven, component-based UI system. All visual styling uses **design tokens exclusively** — never hardcoded colors, spacing, or radii.

## Design Tokens

Defined in `src/styles.css` via Tailwind v4 `@theme`. Consume them as utility classes (e.g., `bg-bg-primary`, `text-accent-cyan`, `rounded-card`).

### Colors
| Token | Usage |
|-------|-------|
| `--color-bg-primary` | App background (`bg-bg-primary`) |
| `--color-text-primary` | Primary text |
| `--color-text-secondary` | Muted labels |
| `--color-text-muted` | Placeholders / disabled |
| `--color-accent-cyan` | Primary brand / energy |
| `--color-accent-purple` | Secondary brand / story |
| `--color-accent-amber` | Warnings / highlights |
| `--color-accent-emerald` | Success / positive |
| `--color-accent-blue` / `-fuchsia` / `-orange` | Per-location themes |
| `--color-error` | Errors / negative |

### Radii
`--radius-card` (1.5rem), `--radius-card-sm` (1rem), `--radius-card-xs` (0.75rem), `--radius-button` (0.75rem).

### Spacing & Type
Tailwind default spacing scale; font family `--font-game` ("Inter").

## UI Component Library (`src/components/ui`)

| Component | Purpose |
|-----------|---------|
| `Card` | Surface container. Variants: `default`, `glass`, `surface`, `flat`. |
| `Button` | Action. Variants: `primary`, `secondary`, `ghost`, `accent`. Sizes: `sm`, `md`, `lg`. |
| `ProgressBar` | Energy / progress display with optional label. |
| `IconBox` | Icon in a themed rounded box. Sizes: `sm`, `md`, `lg`. |
| `StatCard` | Compact stat tile (label + value). |
| `EmptyState` | Empty-state illustration + title/description/action. |
| `LoadingState` | Loading illustration + message. |
| `ErrorState` | Error illustration + title/message/action. |

All components accept `className` and compose it via the `cn()` utility (`src/lib/cn.ts` = `clsx` + `tailwind-merge`).

## SVG & Illustration System (`src/assets/illustrations`)

Theme-aware, scalable SVGs that use `currentColor` for tinting. Exports: `EmptyState`, `SuccessState`, `ErrorState`, `WarningState`, `LoadingState`, `LogoMark`.

## Character System (`src/assets/characters`)

`CharacterPortrait` renders a parametric SVG avatar from a `CharacterConfig` (skin, hair, accessory, accent). Supports expressions (`neutral`, `happy`, `sad`, `surprised`, `angry`) and accessories (`glasses`, `headphones`, `hat`, `earrings`). `NPC_PORTRAITS` provides per-NPC configs. Gradient IDs use `useId` to avoid collisions.

## Usage Rules

1. Never hardcode hex colors or raw Tailwind arbitrary values for theme colors — use tokens.
2. Reuse existing components; do not duplicate card/button markup.
3. New illustrations go in `assets/illustrations`; new characters extend `CharacterConfig`.
4. Compose classNames with `cn()` — never string concatenation.
