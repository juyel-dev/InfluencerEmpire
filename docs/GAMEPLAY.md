# Gameplay

Influencer Empire is a narrative RPG where you grow from zero to a 10,000-follower influencer by creating content, building relationships, and managing energy.

## Core Loop

1. **Map** — view stats, character relationships, and travel to locations.
2. **Location** — do activities (cost energy, yield resources) or trigger story/dialogue.
3. **End Day** — energy fully restores, day increments, auto-save.
4. **Milestones** — follower thresholds trigger celebration toasts + journal entries.
5. **Win** — reaching 10,000 followers completes the game.

## Resources (`Resources`)

| Resource | Role |
|----------|------|
| `followers` | Primary progression currency; drives milestones & win. |
| `money` | Spent on gear; earned from streams/performing. |
| `energy` | Budget for activities each day (restores on End Day). |
| `maxEnergy` | Cap for energy; raised by workouts. |
| `reputation` | Gates fan meets; earned from social activities. |
| `creativity` | Earned from create activities. |
| `day` | Time progression. |

## Locations & Activities

Each location (`home`, `studio`, `gym`, `cafe`, `club`, `mall`) unlocks on a set day and offers 2–3 activities. Activity *behavior* lives in `src/game/data/activities.ts` (`ACTIVITY_EFFECTS`) — a data-driven map keyed by activity id. Each effect declares `energyCost` (from `Location.activities`), optional `oncePerDay`, optional `requires` (money/reputation), and a `resolve(rng, current)` returning resource deltas + journal/message text.

To add an activity: add metadata to `locations.ts` and a matching entry in `ACTIVITY_EFFECTS`. No store changes required.

## NPCs & Story

Five NPCs (`zara`, `leo`, `maya`, `omar`, `ava`) with portraits in the character system. Story is data-driven:
- `DIALOGUE_NODES` — branching dialogue trees.
- `STORY_EVENTS` — location/day-triggered first meetings.
- `getRepeatDialogue` / `getRepeatEncounter` — probabilistic repeat visits after main events.

Dialogue choices apply `relationshipChange`, `resourceChange`, `setFlag`, or `unlocksLocation`.

## Milestones & Win

`MILESTONES` (in `types/index.ts`) defines follower goals with labels. `checkMilestones` fires on follower gain; the final goal (10,000) sets `won: true`.

## Screens

- **MapScreen** — hero stats, NPC faces, location cards (themed), End Day.
- **StoryScreen** — delegates to `DialoguePanel` or `ActivityList`.
- **JournalScreen** — stats, relationships, story log.
- **SettingsScreen** — reset.

## Balance Notes

Activity numbers are centralized in `ACTIVITY_EFFECTS`. Tuning is a data edit, not a code change. See DECISIONS.md for the rationale behind the data-driven approach.
