export type ScreenId = "map" | "story" | "journal" | "settings";

export type LocationId = "home" | "studio" | "gym" | "cafe" | "club" | "mall";

export type ActivityId = string;

export type NpcId = "zara" | "leo" | "maya" | "omar" | "ava";

export type ActivityCategory = "create" | "social" | "train" | "explore";

export interface Activity {
  id: ActivityId;
  name: string;
  description: string;
  category: ActivityCategory;
  energyCost: number;
  minDay: number;
}

export interface LocationTheme {
  gradient: string;
  accent: string;
  surface: string;
  text: string;
  buttonBg: string;
}

export interface Location {
  id: LocationId;
  name: string;
  icon: string;
  description: string;
  activities: Activity[];
  unlockedDay: number;
  theme: LocationTheme;
}

export interface Npc {
  id: NpcId;
  name: string;
  icon: string;
  description: string;
}

export interface DialogueChoice {
  text: string;
  nextNodeId: string | null;
  relationshipChange?: Partial<Record<NpcId, number>>;
  resourceChange?: Partial<Resources>;
  setFlag?: string;
  endsDialogue?: boolean;
  conditionFlag?: string;
  conditionValue?: string | number | boolean;
  unlocksLocation?: LocationId;
}

export interface DialogueNode {
  id: string;
  npcId: NpcId | null;
  text: string;
  choices: DialogueChoice[];
  conditionFlag?: string;
  conditionValue?: string | number | boolean;
  autoAdvanceNodeId?: string;
  isEnd?: boolean;
}

export interface StoryEvent {
  id: string;
  triggerDay: number;
  locationId: LocationId;
  npcId: NpcId;
  dialogueNodeId: string;
  conditionFlags?: Record<string, string | number | boolean>;
  priority: number;
}

export interface Resources {
  followers: number;
  money: number;
  energy: number;
  maxEnergy: number;
  reputation: number;
  creativity: number;
  day: number;
}

export interface JournalEntry {
  id: string;
  day: number;
  text: string;
  type: "story" | "activity" | "system";
}

export interface DaySummary {
  day: number;
  followersDelta: number;
  moneyDelta: number;
  reputationDelta: number;
  creativityDelta: number;
  activitiesDone: number;
}

export interface Milestone {
  goal: number;
  label: string;
}

export const MILESTONES: Milestone[] = [
  { goal: 10, label: "First 10 followers — someone out there likes you!" },
  { goal: 50, label: "50 followers — you're building a community!" },
  { goal: 100, label: "100 followers — micro-influencer status!" },
  { goal: 500, label: "500 followers — people are talking about you!" },
  { goal: 1000, label: "1,000 followers — you're a real creator now!" },
  { goal: 5000, label: "5,000 followers — this is getting serious!" },
  { goal: 10000, label: "🎉 10,000 FOLLOWERS — YOU'RE AN INFLUENCER! 🎉" },
];

export const FINAL_GOAL = MILESTONES[MILESTONES.length - 1].goal;

export interface GameState {
  resources: Resources;
  currentLocation: LocationId;
  flags: Record<string, string | number | boolean>;
  relationships: Record<NpcId, number>;
  visitedLocations: LocationId[];
  completedActivities: string[];
  seenDialogueNodes: string[];
  activeDialogueNodeId: string | null;
  activeNpcId: NpcId | null;
  journal: JournalEntry[];
  pendingEvents: StoryEvent[];
  reachedMilestones: number[];
  won: boolean;
  lost: boolean;
  playerName: string;
  dayStartResources: Resources;
}
