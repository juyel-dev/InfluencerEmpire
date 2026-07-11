# Influencer Empire — Project Constitution

> **Authority:** Highest document in the project. All design, implementation, and planning must conform to this constitution. Contradictions must be identified and explicitly resolved.
> 
> **Living Document:** Updated after every significant planning session, design session, architecture decision, balancing change, implementation milestone, or production review.

---

## 1. Vision

### Project Vision
Influencer Empire is a narrative life/business sim where the player grows from zero followers to a 10,000-follower influencer by creating content, building relationships, and surviving the algorithm. It combines the depth of a tycoon game (real economy, risk, failure) with the investment of a story-driven RPG (mentors, rivals, branching events).

### Long-Term Goals
- Build a commercially viable indie game that ships on Steam and iOS/Android.
- Create a fair, risk-filled economy that rewards skill and strategy, not grinding.
- Deliver a memorable character-driven story that players feel attached to.
- Support live-ops with seasonal events, cosmetic IAP, and content expansions.
- Establish a franchise that can support city packs, creator specializations, and DLC.

### Core Fantasy
"I could be famous." The power fantasy of being seen, liked, and paid for being yourself — with the real tension of trolls, sellout choices, bankruptcy, and rival creators.

### Mission
Make an idle-tycoon with a soul. Real failure. Real relationships. Real fame.

### Success Criteria (v1.0)
- Player reaches 10K followers via strategic play, not idle waiting.
- First-time win is achievable in 1–2 weeks of casual play.
- Players experience at least one viral, one flop, and one bankruptcy scare per run.
- Players form attachment to at least one NPC (Zara, Leo, Maya, Omar, Ava).
- At least 30% of players start a second run after winning.

---

## 2. Design Philosophy

These principles are non-negotiable. Every design and implementation decision must respect them.

| # | Principle | Explanation |
|---|-----------|-------------|
| 1 | **Player experience before technical convenience** | If code architecture conflicts with player feel, the architecture bends. |
| 2 | **Every mechanic must have meaningful player impact** | No filler. Every button click changes something the player cares about. |
| 3 | **No fake progression** | Numbers must represent real advantage or consequence. No "+1" that feels like nothing. |
| 4 | **No meaningless grinding** | Repetition must be strategic, not mindless. Energy scarcity forces real choices. |
| 5 | **Fair challenge** | Failure must be the player's choice or a visible risk — never arbitrary punishment. Show odds. |
| 6 | **Meaningful choices** | Every decision must have a clear tradeoff. No "always correct" answers. |
| 7 | **Quality over quantity** | Better to have 12 well-balanced activities than 30 unbalanced ones. |
| 8 | **Data-driven systems** | All content (activities, locations, events, items) is data, not logic. Designers edit data files, not code. |
| 9 | **Modular architecture** | Systems must be replaceable, testable, and independently verifiable. |
| 10 | **Failure is part of the fantasy** | A game where you cannot lose is not a game. Bankruptcy, churn, and flops are features, not bugs. |
| 11 | **Juice first, features second** | Silent features don't exist. Every action must produce audio+visual feedback before more content is added. |
| 12 | **Mobile-first, desktop-everywhere** | The game must feel native on a phone. Desktop gets richer layouts but never breaks mobile UX. |

---

## 3. Game Pillars

These pillars must never be violated. Any feature that contradicts a pillar must be rejected or redesigned.

1. **Risk-Filled Creator Loop** — Every activity can flop, go viral, or land in between. Creativity, gear, and relationships tilt the odds but never eliminate risk.
2. **Relationship-Driven Story** — Five core NPCs with their own arcs. Relationships unlock perks, collabs, and narrative payoff. Choices matter.
3. **Fair Economy with Real Consequences** — Money drains (rent, gear, costs), followers churn if idle, bankruptcy is game over. Recovery is possible but not guaranteed.
4. **Daily-Return Coziness** — Sessions last 3–5 minutes on mobile. Energy refills daily. There's always a reason to come back (missions, events, daily objectives).
5. **Emotional Range** — The game must make you feel excitement (viral), anxiety (flop risk), disappointment (bankruptcy), triumph (milestone), and attachment (NPCs).

---

## 4. Product Vision

### Target Audience
- **Primary:** 16–34 years old, mobile-native, watches streamers/TikTok/YouTube creators.
- **Secondary:** Steam players who enjoy cozy-yet-challenging sims (Kairosoft, Stardew Valley, BitLife).
- **Psychographic:** Values creativity, authenticity, "hustle culture," social connection. Wants a power fantasy about fame that feels earned.

### Platforms
- **v1.0:** Cross-platform simultaneous launch on Steam (PC/Mac) and iOS/Android.
- **v1.x:** Nintendo Switch, cloud save cross-buy.

### Genre
Narrative Idle-Tycoon / Life-Biz Sim. Positioned between Kairosoft depth (systems) and BitLife (life fantasy).

### Business Model
**Hybrid (Recommendation — Locked):**
- Paid base game ($9.99 on mobile, $12.99 on Steam).
- Optional cosmetic IAP (avatar/pfp skins, UI themes, name colors).
- No pay-to-win. No ads. No energy-gating via purchase.
- Live-ops events are free; cosmetics rotate seasonally.

### USP (Unique Selling Proposition)
"A tycoon sim with a soul — real failure, real relationships, real fame."

### Positioning Statement
*"For players who want to feel what it's like to build fame from nothing, Influencer Empire is a narrative idle-tycoon that gives every post risk, every relationship weight, and every milestone real emotional payoff — unlike other idles that are just number widgets."*

---

## 5. Complete Gameplay Overview

### Core Loop (atomic)
1. Player is on the **Map Screen** showing available locations.
2. Player taps a **Location** (Home, Studio, Gym, Cafe, Club, Mall).
3. **StoryScreen** loads. If a story event is pending, **DialoguePanel** shows. Otherwise, **ActivityList** is shown.
4. Player selects an **Activity** costing Energy. Outcome is resolved with a **Tier Roll** (viral/normal/flop).
5. Floating numbers (+followers, ±money), sound effects, and a toast show results.
6. Player repeats until Energy is depleted or satisfied.
7. Player returns to Map and presses **End Day**.
8. Economy runs: upkeep (rent), follower churn if idle, random event roll.
9. **Day Summary Overlay** shows animated deltas for the day.
10. If a random event triggered, it fires on overlay dismiss → dialogue with choices.
11. Loop repeats. Milestones (10→50→100→500→1K→5K→10K) trigger celebration.
12. Reaching 10K followers → **Win screen**. Reaching −$50 → **Bankrupt / Lose screen**.

### Secondary Loops
- **NPC Relationships:** Conversations and collabs unlock perks (e.g., Zara boosts creativity, Leo unlocks rival challenge).
- **Equipment Shop:** Spend money on gear that improves viral odds or creativity gains.
- **Brand Deals:** Earn guaranteed money at reputation cost (sellout risk).
- **Missions / Daily Objectives:** Guided goals with bonus rewards.
- **Competitor Rival:** Leo gains followers on a parallel curve. Beat him for bonuses.
- **Empire Mode (endgame):** Post-win endless mode with harder algorithm churn and global leaderboard.

### Screens (current)
- **Map** — Hero card with player name/avatar/stats, NPC relationship faces, location grid, tutorial hint, End Day button.
- **Story** — Routes to DialoguePanel (events/conversations) or ActivityList (location activities).
- **Journal** — Stats grid, relationship bars, story log.
- **Settings** — About + Sound toggle + Reset Game.

### Screens (future)
- Shop (Equipment + Cosmetics)
- Brand Deals / Sponsorships
- Social Feed (post history with likes)
- Missions Board
- Leaderboard

---

## 6. World Bible

### Locations

| Location | Theme Color | Unlock | Vibe | Activities |
|----------|------------|--------|------|-----------|
| Home | Amber/Orange | Day 1 | Safe space, rest | Sleep, Check Phone |
| Studio | Blue/Cyan | Day 1 | Creative workspace | Record Video, Edit Content, Live Stream |
| Gym | Emerald/Green | Day 1 | Health & fitness | Workout, Sauna |
| Cafe | Orange/Gold | Day 2 | Networking hub | Meet People, Work Alone |
| Mall | Cyan/Teal | Day 3 | Shopping & fame | Shop Gear, Fan Meet |
| Club | Purple/Fuchsia | Day 4 | Nightlife scene | Party, Perform |

### Characters

| NPC | Role | Personality | Favorite Location | Relationship Perk (planned) |
|-----|------|------------|-------------------|---------------------------|
| **Zara** | Mentor | Warm, wise, recovered from burnout | Cafe | +Creativity on collab |
| **Leo** | Rival | Competitive, respectful | Gym | Unlocks "rival challenge" bonus follower gains |
| **Maya** | Friend | Tech-savvy, loyal, supportive | Studio | +Followers when collab-streaming |
| **Omar** | Talent Agent | Opportunistic, well-connected | Mall | Unlocks brand deals |
| **Ava** | Artist | Mysterious, deeply creative | Club | Grants unique content types |

### Timeline (Story Arc)
- **Day 1:** Meet Zara at Studio. She mentors you.
- **Day 2:** Meet Leo at Gym. Rival dynamic established.
- **Day 3–5:** Meet Maya, Omar, Ava. Relationships deepen.
- **Day 5+:** Repeatable encounters with relationship-gated dialogue.
- **Day 5+ (random):** Mid-game events (brand deal, trolls, resurfaced content, drama).
- **Ongoing:** Choices affect relationships which gate future collabs and perks.
- **Late game (5K+):** Bigger stakes (viral controversies, cancel arcs, empire-building).

### Lore (Concise)
The world is the modern social-media landscape. Every character has a backstory — Zara lost 2M followers in an algorithm change, Leo clawed his way up from gaming streams, Omar represents the agency world that exploits creators. The player's journey mirrors real creator economics: algorithmic uncertainty, relationship-driven opportunity, and the constant tension between authenticity and growth.

### Future Expansions
- **City Packs:** Beach town, capital city, festival venues.
- **Creator Specializations:** Gamer, beauty, tech, travel — each with unique activity sets.
- **Cancel Culture Arc:** Reputation recovery and PR management.
- **Collab Mode:** Team up with NPCs for shared viral events.

---

## 7. Economy Constitution

### Currencies
| Currency | Earned By | Spent On | Purpose |
|----------|-----------|----------|---------|
| **Followers** | Content activities, viral events, fan meets | Lost through churn or flops | Win condition, status, unlocks |
| **Money** | Brand deals, live streams, performances | Upkeep, gear, activity costs | Survival, equipment, upgrade |
| **Energy** | Refilled daily (maxEnergy) | Activities | Action gating |
| **Creativity** | Creating content, planning | (Cap influences viral odds) | Quality modifier |
| **Reputation** | Social activities, fan meets | Brand deal requirements | Trust metric |

### Resource Flow Diagram
```
  End Day
    ↓
  ┌─────────────────────────────────────────────┐
  │  Economy Phase (applied every endDay)       │
  │  • Rent: −($2 + floor(day/3)) money         │
  │  • Churn: if 0 activities, −4% followers    │
  │  • Random event roll (35%+ from Day 3)      │
  └─────────────────────────────────────────────┘
    ↓
  Activity Phase (player-driven)
    • Spend energy → cost money (varies)
    • Resolve tier (viral/normal/flop)
    • Gain/loss followers, creativity, money, rep
```

### Inflation Control
- Rent scales with day (slow linear curve: +$1 every 3 days).
- Activity costs are fixed per activity type, not scaled.
- Gear provides one-time boosts; no infinite growth.
- Creativity cap: hard cap of 100 prevents infinite viral scaling.

### Risk & Reward Balance
- **Viral tier:** ~2.3× base gains. Chance = 4% + (creativity × 0.8%). Max ~26%.
- **Flop tier:** ~0.3× gains, can lose followers on "create" activities. Chance = 24% − (creativity × 0.8%). Min ~8%.
- **RNG smoothing:** More activities = more consistent outcomes. Creativity investment reduces variance.

### Failure & Recovery
- **Flop:** Lose 1–6 followers, gain small creativity lesson. Sets you back but does not end run.
- **Bankruptcy (−$50):** Game over. Player sees loss screen with stats.
- **Recovery:** Early days have lower rent (as low as $2). Player can rebuild from churn by posting consistently.

### Scaling Philosophy (v1.0)
- Activities: fixed base numbers (not scaled by day).
- Viral multiplier constant.
- Creativity influence on viral chance: linear, capped.
- Churn % constant (doesn't increase with day; player skill matters more).
- Rent increases slowly to create soft pressure, not time-bomb urgency.

---

## 8. Progression Constitution

### Player Progression (within-run)
1. **Days 1–3:** Learn basics. Meet Zara/Leo. Low pressure (grace period, lower rent).
2. **Days 4–7:** Economy tightens. Random events begin. Shop becomes relevant.
3. **Days 8–14:** Mid-game. Relationships deepen. Brand deals appear. Rival Leo starts gaining.
4. **Days 15+:** Late-game. Club unlocked, endgame content. Push for 10K.

### Meta Progression (across runs)
- **Empire Mode (post-win):** Endless play with harder algorithm churn. Global leaderboard.
- **Prestige (planned):** Reset to Day 1 with permanent perks (start with gear, relationship bonus).

### Unlock Philosophy
- Most content is day-gated so the player always has something new approaching.
- No pay-to-skip gates.
- Unlocks are communicated on the Map (locked locations shown with unlock day).

### Difficulty Philosophy
- Fixed difficulty (no player-selectable difficulty in v1.0).
- Difficulty comes from economy pressure (rent + churn) and risk (flop chance).
- Skill expression is activity selection, gear investment, creativity management, and relationship cultivation.
- A skilled player should be able to beat the game in ~10–14 days. A casual player should reach the end by ~Day 20.

### Endgame Philosophy
- Winning at 10K followers should feel like a real achievement, not a formality.
- After winning, Empire Mode offers a "forever game" with escalating difficulty.
- Long-term retention driven by: leaderboard, seasonal events, cosmetic collection, and improving win speed.

### Prestige Philosophy (planned)
- Prestige resets resources but keeps cosmetic unlocks and one "starting edge" (e.g., +2 starting creativity, starting gear).
- Prestige tokens earned per win; spent on permanent account-wide perks.
- Prestige is opt-in, not required.

---

## 9. Technical Constitution

### Architecture Philosophy
- **Data-driven:** All game content lives in `src/game/data/` as typed TS modules. Designers modify data, not logic.
- **State-driven:** Zustand stores own all state. React components are pure views of state.
- **Transient vs Persistent:** Feedback (floats, audio, confetti) is transient and isolated from game state.
- **Testable:** Pure resolve functions tested without DOM/React.

### Folder Philosophy
```
src/
  lib/             — Framework-agnostic utilities (audio, cn helper)
  game/
    data/          — All content data (activities, locations, npcs, story, summary)
    state/         — All stores (gameStore, feedbackStore)
    types/         — All TypeScript types
  components/
    game/
      screens/     — Full-page screens (Map, Story, Journal, Settings)
      features/    — Reusable feature components (ActivityList, DialoguePanel)
      hud/         — Always-mounted UI (TopBar, BottomNav)
      shared/      — Utility components (ToastContainer, FloatLayer, Confetti)
      overlays/    — Modal overlays (DaySummary, Intro, EndScreen)
    ui/            — Primitive design system (Card, Button, ProgressBar, etc.)
  assets/
    characters/    — SVG portrait components
    illustrations/ — SVG illustration components
```

### Module Boundaries
- `data/` modules never import from `components/` or `state/`.
- `state/` modules can import from `data/` and `lib/`.
- `components/` can import from `state/`, `data/`, `lib/`, `ui/`, `assets/`.
- `lib/` imports nothing from the project.

### State Ownership
- **gameStore:** Persistent game state (resources, flags, relationships, journal, win/lose/name). Saved/loaded.
- **feedbackStore:** Transient feedback (floating numbers, confetti). Not saved.
- **audio module:** Audio system (singleton). Settings saved separately in localStorage.

### Save Philosophy
- Single save slot (`ie_save_v2`).
- JSON-serialized via `JSON.stringify` / `JSON.parse`.
- Versioned schema. Migration function handles old saves.
- Cloud save targeted for v1.1.
- Auto-save on every End Day and explicit save action.
- Settings (sound toggle) saved independently under `ie_sound_enabled`.

### Extensibility Rules
- New activity = add entry to `ACTIVITY_EFFECTS` in `activities.ts`.
- New location = add entry to `LOCATIONS` in `locations.ts` + optional theme.
- New NPC = add to `NPCS` in `npcs.ts` + optional portrait + story events.
- New story event = add `DialogueNode` + entry in `STORY_EVENTS`.
- New random event = add `DialogueNode` + id in `RANDOM_EVENTS`.
- New screen = add to `ScreenId` type + route in `App.tsx` screenComponents.
- No engine code changes needed for content additions.

### Coding Principles (for future implementation)
- Use Zustand selectors for performance (`useStore(s => s.field)` not `useStore()`).
- Prefer `Readonly<T>` and `as const` for data.
- All balances in data files — no magic numbers in logic.
- Jest/vitest for unit tests of resolve functions.
- ESLint + tsc enforce type safety.

---

## 10. UX Constitution

### Player Experience Rules
1. Every action produces immediate feedback (audio + visual) within 100ms.
2. The game never leaves the player wondering "did it work?"
3. Low-stakes actions (navigation) get subtle feedback. High-stakes actions (End Day, brand deal) get distinct, heavier feedback.
4. Error states (locked location, insufficient energy/requirements) are communicated with specific messages, not generic "can't do that."
5. The map always shows what is available AND what is coming soon (locked locations with unlock day).
6. Numbers are human-readable: short format (1.2K), never decimal fractions in display.

### Feedback Rules
- **Click:** Short square-wave synth blip (420 Hz, 50ms).
- **Success:** Rising two-tone (660+880 Hz, 120ms).
- **Fail:** Descending sawtooth sweep (220→110 Hz, 250ms).
- **Viral:** Followed tone (740+988 Hz) + confetti burst.
- **Milestone:** Ascending triad (523→659→784 Hz) + confetti + star float.
- **Level Up / End Day:** Ascending four-note arpeggio (523→659→784→1047).
- **Event:** Suspended triangle chord (440+554 Hz).
- **Win:** Full ascending major scale arpeggio.
- **Lose:** Descending minor scale sweep.
- **Reduced motion:** All animations are eliminated or replaced with simple opacity transitions when `prefers-reduced-motion` is active.

### Accessibility Rules
- `prefers-reduced-motion` must disable all non-essential animations (confetti, float-up, scale-in → instant appear).
- Sound toggle accessible within 2 taps (Settings tab).
- All interactive elements are keyboard-accessible.
- Text contrast ratios meet WCAG AA (4.5:1 for body, 3:1 for large text).
- Touch targets minimum 44×44px.

### Animation Philosophy
- Animations serve feedback, not decoration.
- Duration: floats 1.2s, toasts 2.5s, scale-in 0.2s, fade-in 0.3s.
- All animations use `ease-out` defaults.
- No animation blocks gameplay — overlays are immediately dismissible.

### UI Principles
- Dark theme default (battery-friendly, reduces eye strain for long sessions).
- Glassmorphism for spatial hierarchy: darker = further back, lighter = foreground.
- Single-column layout on all platforms; desktop never exceeds 480px content width.
- Color conveys state: cyan = action/interactive, emerald = gain/positive, red = loss/negative, amber = warning.
- Information density is low. One primary action per screen.

---

## 11. Art Constitution

### Visual Direction
- Dark glassmorphism (dark violet-indigo background, frosted glass surfaces).
- Neon-lite accent palette against near-black background.
- Clean rounded shapes, generous negative space.
- No realistic/styled human art — emoji-scale icons and geometric portrait illustrations.

### Color Philosophy
- Background: `#0a0a1a` (very dark blue-black).
- Surfaces: White with <10% opacity, blurred.
- Accents: Cyan (primary), Emerald (positive), Purple (creative), Amber (warning), Red (negative).
- Text: White 90% (primary), 45% (secondary), 25% (muted).

### Style Guide
- Border radius: 1.5rem (cards), 1rem (small cards), 0.75rem (buttons).
- Font: Inter (system sans-serif fallback).
- Layout: 16px base unit, 4px grid.
- Maximum reading width: 480px.

### Character Design Philosophy
- Characters are represented by emoji icons in-game.
- Optional SVG portrait illustrations for dialogue panels (in codebase as React components).
- Character colors: Zara = warm amber, Leo = blue cyan, Maya = emerald, Omar = gold, Ava = purple.
- Personality expressed through color + description, not detailed rendering.

### Environment Philosophy
- No environmental art — locations are color-gradient backgrounds with theme accents.
- Each location has a unique gradient (e.g., Studio = `from-sky-900/40 via-blue-800/20 to-indigo-950/40`).
- Location icon emoji is the primary visual identity.

---

## 12. Audio Constitution

### Sound Identity
- **Identity:** Retro-futuristic synth wave. Digital, clean, warm.
- **No external samples.** All sounds are synthesized via Web Audio API.
- **Design goal:** Sounds must be recognizable even on a phone speaker at low volume.

### Music Direction (v1.1+)
- Adaptive music beds per location, composed in 5-second loops.
- Energy increases as followers grow or during viral moments.
- Silence is acceptable for low-stakes screens (Settings, Journal).

### Feedback Philosophy
- Sound must never be the primary feedback channel — visual always comes first.
- Sound complements visual; if sound fails (muted, broken speaker), the game is still fully playable.
- Repeated sounds are short (<250ms for actions, <1.5s for celebrations).
- No irritating loops. No sustained tones.

---

## 13. Live Operations Constitution

### Events
- Seasonal events (e.g., "Viral Summer") with exclusive activities, NPC dialogue, and cosmetic rewards.
- Events are free. Cosmetics within events are earnable, not purchasable.
- Event duration: 2–4 weeks.

### Updates
- Content patches add new activities, random events, and NPC dialogue.
- Balance patches adjust economy numbers only — never nerf without a way to compensate.
- Major updates (new cities, specializations) are paid expansions.

### Seasons
- 4 seasons per year, aligned with real-world quarters.
- Each season has a theme, leaderboard reset, and cosmetic rotation.
- Season pass (cosmetic-only) for players who want extra rewards.

### Content Pipeline
- New activity: design → balance (1 week) → data entry (2 hours) → test (1 day).
- New random event: narrative brief → 2–3 dialogue nodes → data entry → test.
- New location: design + gradient + activities (2 weeks).

### Community
- Player feedback drives balance patches.
- Leaderboard reveals activity and new content priorities.
- Cosmetics are player-suggested and community-voted.

### Cosmetics Philosophy
- Avatar emojis / profile pictures.
- UI theme colors (accent palette swaps).
- Name color effects.
- Never gameplay-relevant. Never pay-to-win.

---

## 14. Production Constitution

### Studio Workflow
1. **Design Session:** Prose/gdd output, no code. Systems and economy design.
2. **Planning Session:** Break design into Epics → Features → Stories → Tasks. Prioritize.
3. **Implementation:** Iterative, one TODO at a time. After each: verify (tsc + lint + test).
4. **Review:** After each milestone, full QA walkthrough. Does it improve gameplay? Retention? Feel? Bugs?
5. **Documentation:** Update Constitution, Decision Log, Changelog after every session.

### Definition of Done
- TypeScript compiles without errors (`tsc --noEmit`).
- Lint passes (`eslint .`).
- All tests pass (`vitest run`).
- Production build succeeds (`npm run build`).
- No regressions in critical path (map → location → activity → end day → overlay).
- Constitution updated.

### Quality Gates (pre-v1.0)
- All resolved features reviewed against Game Pillars (Section 3).
- Economy Simulator: simulate 10000 runs, verify <5% bankruptcy rate for skilled playthroughs.
- Load test: 100 saves/loads, verify integrity.
- UX audit: fresh player completes full loop without instructions.

---

## 15. Decision Log

### D-001 — Hybrid Business Model
- **Date:** 2026-07-08
- **Reason:** Premium-only limits audience. F2P+p2w damages design integrity. Hybrid keeps design clean and revenue viable.
- **Alternatives:** Premium-only, F2P with forced ads, F2P with energy-gating
- **Decision:** Paid base ($9.99–$12.99) + cosmetic-only IAP. No ads, no pay-to-win.
- **Impact:** Economy design does not need monetization pressure. All engagement mechanics are pure retention, not revenue.

### D-002 — Cross-Platform, Mobile-First
- **Date:** 2026-07-08
- **Reason:** Largest addressable audience. Mobile-native development forces UX discipline.
- **Alternatives:** PC-only, Mobile-only, Console-first
- **Decision:** Ship simultaneously on Steam + iOS/Android. Responsive single-column layout. Desktop max-width 480px.
- **Impact:** All UI must work at 375px width. Desktop can never exceed mobile's content density.

### D-003 — Balanced Story/Systems (50/50)
- **Date:** 2026-07-08
- **Reason:** Pure systems lose emotional attachment. Pure narrative loses replayability. Combining both creates retention.
- **Alternatives:** Systems-heavy (emergent), Narrative-heavy (linear)
- **Decision:** Systems loop (economy, risk) + narrative arc (characters, events) have equal weight. NPC relations affect gameplay.
- **Impact:** Both a systems team and a narrative team must work in parallel.

### D-004 — Vertical Slice → Expand
- **Date:** 2026-07-08
- **Reason:** De-risks development. Validate core loop before building city/event expansions.
- **Alternatives:** Full content at launch
- **Decision:** v1.0 is one city with 6 locations, ~15 activities, 5 NPCs, ~30 story nodes. Content patches post-launch.
- **Impact:** Architecture must support adding locations/activities as data without engine changes (confirmed — `LOCATIONS` and `ACTIVITY_EFFECTS` are data arrays).

### D-005 — Real Failure and Bankruptcy
- **Date:** 2026-07-08
- **Reason:** A game where you cannot lose is not a game. Failure creates tension, which makes victory meaningful.
- **Alternatives:** No lose condition, soft fail (restart day), money floor of $0
- **Decision:** Bankruptcy at −$50 triggers game-over screen. Churn (4%/idle day) is real follower loss.
- **Impact:** Requires tutorial/grace period so first-time players don't get punished before learning. Grace period = Days 1–3 (reduced rent, no churn).

### D-006 — Outcome Tiers (Viral/Flop/Normal)
- **Date:** 2026-07-08
- **Reason:** Binary success/fail is boring. Tiers create excitement (viral) and tension (flop) and make monotony rare.
- **Alternatives:** Fixed outcomes, binary success/fail
- **Decision:** 3-tier system. Viral ~2.3×, Normal 1×, Flop ~0.3× with potential follower loss. Creativity tilts odds.
- **Impact:** Creativity becomes a risk-reduction investment, not a vanity stat. All activity numbers balanced around tier multipliers.

### D-007 — No Pay-to-Win IAP
- **Date:** 2026-07-08
- **Reason:** Players feel cheated by games that sell power. Trust is the foundation of retention.
- **Alternatives:** Sell coins, sell energy refills, sell speed-ups
- **Decision:** IAP is strictly cosmetic (avatars, themes). All gameplay content is earnable by playing.
- **Impact:** Economy must be self-balancing. No revenue-based difficulty adjustment.

### D-008 — Juice First, Features Second
- **Date:** 2026-07-08
- **Reason:** A silent, static UI prototype does not feel like a game. Feedback (sound + animation) is the difference between a simulator and a game.
- **Alternatives:** Build features first, add polish later
- **Decision:** Every action (click, activity result, navigation, milestone, event, win/lose) has dedicated audio + visual feedback before any new feature is built.
- **Impact:** Implementation order: audio engine → floating feedback → activity tiers → day summary → win/lose → then more features.

### D-009 — First-Day Grace Period
- **Date:** 2026-07-08
- **Reason:** New players need to learn the loop before being punished. Churn and full rent on Day 1 would be hostile.
- **Alternatives:** Full economy from Day 1
- **Decision:** Days 1–3: rent is fixed at $2 (no scaling), churn is 0% regardless of activity count. Full kicks in Day 4.
- **Impact:** First-time players have a safe window to learn before stakes rise.

### D-010 — Visible Outcome Odds
- **Date:** 2026-07-08
- **Reason:** Players feel cheated by RNG when they can't see the odds. Transparent probability makes loss feel fair and viral feel lucky.
- **Alternatives:** Hidden odds
- **Decision:** Activity cards show live Viral % / Flop % computed from current creativity (implemented 2026-07-09).
- **Impact:** Risk now feels fair; players can invest in creativity to reduce flop odds and increase viral odds. Implemented in ActivityList.

### D-011 — Mega Viral Moment (rare tiers)
- **Date:** 2026-07-09
- **Reason:** Regular viral outcomes (2.3×) are exciting but not memorable. Players need occasional "legendary" moments that feel like a milestone event.
- **Alternatives:** Higher viral multiplier only, entirely separate random event
- **Decision:** Add a `mega` flag: when a roll is viral AND a second rng() < 0.16, outcome becomes MEGA VIRAL (followers ×2.2 again, money/rep ×1.5). Triggers a full-screen ViralMomentOverlay with animated SVG burst, count-up, win sound, and confetti. ~16% of viral rolls ≈ 2–4% of all activity rolls.
- **Impact:** Creates unforgettable moments. Drives screenshot/share behavior. Tuning lever = the 0.16 second-roll chance.

---

## 16. Changelog

| Date | Session | Changes |
|------|---------|---------|
| 2026-07-08 | Initial project scaffold | Vite + React + TypeScript + Zustand + Tailwind setup. Map, Journal, Story, Settings screens. Locations, activities, NPCs, story data. Basic game loop. |
| 2026-07-08 | End-of-Day Summary feature | `computeDaySummary` utility. `dayStartResources` tracking. Day Summary data model. |
| 2026-07-08 | Game feel transformation | Audio engine (Web Audio synth). Floating feedback system (FloatLayer + feedbackStore). Confetti component. Activity outcome tiers (viral/flop/normal). Economy system (upkeep, churn, bankruptcy). Day Summary Overlay. Intro Screen (player identity). Win/Lose End Screens. Random events. Milestone celebration juice. Sound toggle in Settings. Reduced-motion CSS. Tutorial hint banner. |
| 2026-07-08 | Production Readiness Review | Pre-production master plan, 15 TODOs, Market research, Player journey, Core systems design. |
| 2026-07-08 | Project Constitution | Created this document as permanent project authority. Decision log, changelog, open questions, risks, AI agent instructions. |
| 2026-07-09 | Viral Moment + Art Pass | Added mega-viral outcome tier (rare, ~16% of viral rolls) with full-screen ViralMomentOverlay (animated SVG burst, count-up, sound, confetti). Added SVG art: ViralBurst illustration, LocationScene per-location illustrations, logo in Intro, SuccessState/ErrorState in End screens, location scenes on Map grid. Added mega-viral test. |
| 2026-07-09 | UI/UX Enhancement Pass | Added AnimatedNumber component (count-up). TopBar now shows milestone progress bar + animated followers/money. Map hero shows path-to-10K progress bar. Screen transitions use slide-up (animate-screenIn). BottomNav has animated sliding active indicator + aria-current. Activity cards show Visible Outcome Odds (viral%/flop% from creativity) — implements D-010. Global focus-visible outline for keyboard accessibility. |
| 2026-07-09 | Game Enhancement Master Plan | Created `docs/ENHANCEMENT_MASTER_PLAN.md` as the implementation single source of truth. Phases P0 (hardening: store tests, save migration, slice refactor, balance config, selectors) → P1 (meta-progression) → P2 (expansion) → P3 (platform/live-ops) → P4 (live ops). Each feature: deps, complexity, risk, acceptance, files, backward compat. Critical path mandates P0 before P1/P2. |
| 2026-07-09 | Engineering Blueprint (Pre-Phase) | Created `docs/ENGINEERING_BLUEPRINT.md` as the permanent engineering SSoT. 9 sections: System Architecture (folder/dep/data/state/event/component/store/render/save flows), Feature Constitution (per-feature schema for existing + planned), Save System Spec (schema/versioning/migration/validation/corruption recovery/integrity), Testing Constitution, Coding Constitution, 7 ADRs (React/Zustand/data-driven/local-save/synth-audio/slices/structure), Dependency & Risk Analysis, Future Scalability (10x/100x/mods/cloud/mobile/desktop), Final Blueprint + golden rules. No code modified. |
| 2026-07-10 | Phase 0 Complete (Hardening) | Implemented all P0 items. P0-4: `src/game/data/balance.ts` central config (outcome/mega/economy/randomEvent); activities + economy read from it. P0-2: `src/game/state/saveSystem.ts` — `SAVE_VERSION=3`, versioned envelope (`ie_save_v3`), `validateState`, `coerceGameState` repair, `migrateV2ToV3`, legacy `ie_save_v2` fallback, corrupt-quarantine. P0-1: `gameStore.test.ts` (26 tests) + fixed milestone bug (now marks ALL crossed milestones, triggers win on big jumps). P0-3: store split into `slices/` (core/ui/save/activity/event/economy/progress) + `selectors.ts`; `gameStore.ts` is a ~30-line composition root; public API unchanged. P0-5: `MapScreen` uses granular selector hooks (no whole-state subscription). Gates: tsc clean, eslint clean, 38 tests pass, build green (94 KB gzip). |

---

## 17. Roadmap

### Current Phase: Vertical Slice — Core Loop Complete
- [x] Locations + activities + resolve system
- [x] Dialogue + story events
- [x] Economy (upkeep, churn, bankruptcy)
- [x] Outcome tiers (viral/flop/normal)
- [x] Audio SFX engine
- [x] Floating feedback + confetti
- [x] Milestones + win/lose
- [x] Day Summary overlay
- [x] Player identity (name + intro)
- [x] Random events
- [x] Sound toggle + reduced-motion
- [x] Visible outcome odds on activity cards (D-010)
- [x] Animated HUD counters + milestone/path progress bars
- [x] Screen slide transitions + animated nav indicator
- [x] Keyboard focus-visible accessibility

### Next Phase: Meta-Progression (v0.5 → v1.0)
- [ ] Competitor AI (Leo parallel curve)
- [ ] Empire Mode (post-win endless)
- [ ] Missions system (rotating goals)
- [ ] Achievements (~30)
- [ ] Equipment shop (tiered gear)
- [ ] Brand deals system
- [ ] Social feed (post history)
- [ ] Cloud save
- [ ] Aspirational: 2 new cities, soundtrack, cosmetic store

### Future Roadmap
- v1.0 Launch: Steam + iOS/Android
- v1.1: Cloud save, leaderboards
- v1.2: Creator specializations (gamer, beauty, tech)
- v1.3: Cancel culture arc, reputation recovery
- v1.4: City expansions
- v2.0: Switch, Steam Deck verified, season pass

---

## 18. Known Risks

| ID | Risk | Category | Likelihood | Impact | Mitigation |
|----|------|----------|-----------|--------|-----------|
| R1 | Scope creep as new city/event ideas emerge | Scope | High | Medium | Data-driven pipeline makes most content additions easy; roadmapped after v1.0 |
| R2 | Hybrid model under-monetizes | Business | Medium | High | Cosmetic desirability research; seasonal rotation; A/B test store UX |
| R3 | Early churn if economy feels punitive | Engagement | Medium | High | Grace period (Days 1–3 reduced pressure); tutorial hint; first-day guidance |
| R4 | Story fatigue on replays | Retention | Medium | Medium | Optional dialogue skip; relationship perks still accrue; prestige system provides goal variety |
| R5 | Mobile-native audio fails on desktop browsers | Technical | Low | Medium | Audio context created on first click; fallback to silent |
| R6 | Leaderboard anti-cheat | Live Ops | Low | High | Server-side score verification; rate limiting |
| R7 | "10K is not enough" endgame perception | Design | Medium | High | Empire Mode (endless + leaderboard) shipped in v0.5; prestige system |

---

## 19. Open Questions

| ID | Question | Category | Discussion |
|----|----------|----------|-----------|
| Q1 | Should prestige (rebirth) exist pre-win or only post-win? | Progression | Pre-win prestige creates strategic depth (reset early for long-term gain). Post-win prestige is safer and more traditional. Recommend post-win only for v1.0, consider pre-win for v1.1. |
| Q2 | Cosmetics — avatar emoji swaps or full UI themes? | Art | Emoji swaps are minimal scope. Full themes require significant CSS + art. Recommend emoji swaps for v1.0, themes for expansion. |
| Q3 | Leaderboard — global or friends-only? | Social | Global drives more engagement but requires anti-cheat. Friends-only is safe but less motivating. Recommend both: friends tab as default, global as opt-in. |
| Q4 | Difficulty scaling — fixed curve or player-selectable? | Design | Fixed curve keeps fairness (everyone plays the same game). Player-selectable difficulty adds accessibility but fragments leaderboard. Recommend fixed curve with grace period. |
| Q5 | How many cosmetic items at launch? | Monetization | Need enough for a credible shop (~15) but not so many it's overwhelming. Recommend: 8 avatar emojis, 4 name colors, 3 accent themes. |
| Q6 | Should there be an "undo End Day" feature? | UX | Accidental End Day can ruin a run. Confirmation dialog exists? Currently just a button on Map with no confirmation. Consider adding a "Yes, end day" confirmation modal. |

---

## 20. AI Agent Instructions

### For every future AI agent joining this project:

1. **Read `docs/PROJECT_CONSTITUTION.md` first.** This document is the single source of truth for the project. Do not rely on chat history.

2. **Never contradict the constitution without explicit justification.** If you believe a change is needed, present the conflict to the user and suggest an amendment before proceeding.

3. **Review the Decision Log (Section 15) before proposing changes.** If a decision was already made, reference it. If it needs revisiting, propose a superseding entry.

4. **Preserve project consistency.** When adding features, match the existing code style, folder structure, design patterns, and balancing philosophy.

5. **Update the constitution after every planning or implementation session.** At minimum:
   - Update the Changelog (Section 16) with date and changes.
   - Record new decisions in the Decision Log (Section 15).
   - Update the Roadmap (Section 17) with completed milestones.
   - Update Open Questions (Section 19) as they are resolved.
   - Add new risks to Known Risks (Section 18).

6. **Record every important decision.** Any choice that affects architecture, gameplay balance, economy numbers, or product strategy must be documented. If in doubt, write it down.

7. **Work order for implementation:**
   - Always verify `tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` after changes.
   - Implement one TODO at a time. Verify before continuing.
   - Update tests when data or logic changes.
   - After each milestone, do a QA walkthrough (see Definition of Done, Section 14).

8. **When in doubt about a design decision:**
   - Reference the Game Pillars (Section 3). Does the decision violate a pillar?
   - Reference the Design Philosophy (Section 2). Is the decision aligned?
   - If still unsure, ask the user and log the question.

9. **Architecture note:** All content is data-driven. Adding a new activity/location/event/NPC requires editing only data files in `src/game/data/`. No component changes needed.

10. **Balance changes:** Numbers live in data files only. When tuning, run `vitest run` to ensure tests still pass. Update tests if bounds change.
