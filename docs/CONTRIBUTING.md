# Contributing

## Workflow

Every task follows this sequence:

```
Review → Analyze → Plan → Risk Assessment → Implement → Build
→ Type Check → Lint → Test → Manual Review → Debug → Verify
→ Update Documentation → Complete
```

Implementation is never the first step.

## Quality Gates

All must pass before a task is complete:

```bash
npm run build    # tsc && vite build
npm run lint     # eslint .
npm run test     # vitest run
```

## Rules

1. **Architecture is frozen.** Extend it; do not redesign `types`, `data`, `state`, `ui`, `assets`, or folder structure unless a confirmed bug or un-fit requirement demands it.
2. **Use design tokens** — never hardcode colors/spacing/radii.
3. **Reuse before create** — UI components, utilities, SVG assets, character configs.
4. **Compose classNames with `cn()`** — never string concatenation.
5. **Follow the data-driven pattern** — game content (activities, dialogue, story) lives in `src/game/data` as serializable config.
6. **Strict typing** — no `any`; no `ts-ignore`.
7. **Tests** for pure logic (e.g., activity engine, balance math).

## Adding Content

- **Activity:** add metadata to `locations.ts` + matching `ACTIVITY_EFFECTS` entry in `activities.ts`.
- **Dialogue/Story:** add nodes to `DIALOGUE_NODES` / events to `STORY_EVENTS` in `story.ts`.
- **NPC:** add to `npcs.ts` + `NPC_PORTRAITS` config.
- **UI:** extend `src/components/ui` following existing component patterns.

## Documentation

Keep `docs/` synchronized. Record non-trivial decisions in `DECISIONS.md`. Update `CHANGELOG.md` per release.
