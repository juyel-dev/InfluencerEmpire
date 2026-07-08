import type { Location } from "../types";

export const LOCATIONS: Location[] = [
  {
    id: "home",
    name: "Home",
    icon: "🏠",
    description: "Rest and recover energy. Check your messages.",
    unlockedDay: 1,
    theme: { gradient: "from-amber-900/40 via-yellow-800/20 to-amber-950/40", accent: "#f59e0b", surface: "rgba(146,114,54,0.15)", text: "text-amber-200", buttonBg: "bg-amber-700/60 hover:bg-amber-600/70" },
    activities: [
      { id: "sleep", name: "Sleep", description: "Fully recover energy", category: "train", energyCost: 0, minDay: 1 },
      { id: "check_phone", name: "Check Phone", description: "See what's happening online", category: "explore", energyCost: 0, minDay: 1 },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    icon: "🎬",
    description: "Create content. Record, edit, and publish.",
    unlockedDay: 1,
    theme: { gradient: "from-sky-900/40 via-blue-800/20 to-indigo-950/40", accent: "#3b82f6", surface: "rgba(59,130,246,0.15)", text: "text-blue-200", buttonBg: "bg-blue-700/60 hover:bg-blue-600/70" },
    activities: [
      { id: "record_video", name: "Record Video", description: "Make a new video. +Creativity", category: "create", energyCost: 3, minDay: 1 },
      { id: "edit_content", name: "Edit Content", description: "Polish your drafts. +Followers", category: "create", energyCost: 2, minDay: 1 },
      { id: "live_stream", name: "Live Stream", description: "Go live and interact. +Money", category: "create", energyCost: 4, minDay: 3 },
    ],
  },
  {
    id: "gym",
    name: "Gym",
    icon: "💪",
    description: "Build stamina and meet fitness influencers.",
    unlockedDay: 1,
    theme: { gradient: "from-emerald-900/40 via-green-800/20 to-teal-950/40", accent: "#10b981", surface: "rgba(16,185,129,0.15)", text: "text-emerald-200", buttonBg: "bg-emerald-700/60 hover:bg-emerald-600/70" },
    activities: [
      { id: "workout", name: "Workout", description: "Boost max energy permanently", category: "train", energyCost: 2, minDay: 1 },
      { id: "sauna", name: "Sauna", description: "Relax and gain reputation", category: "train", energyCost: 1, minDay: 2 },
    ],
  },
  {
    id: "cafe",
    name: "Cafe",
    icon: "☕",
    description: "Network with other creators. Make connections.",
    unlockedDay: 2,
    theme: { gradient: "from-orange-900/40 via-amber-800/20 to-yellow-950/40", accent: "#d97706", surface: "rgba(217,119,6,0.15)", text: "text-amber-200", buttonBg: "bg-amber-700/60 hover:bg-amber-600/70" },
    activities: [
      { id: "meet_people", name: "Meet People", description: "Network and make friends", category: "social", energyCost: 2, minDay: 2 },
      { id: "work_alone", name: "Work Alone", description: "Plan content strategy. +Creativity", category: "create", energyCost: 1, minDay: 2 },
    ],
  },
  {
    id: "club",
    name: "Club",
    icon: "🎤",
    description: "Party scene. High risk, high reward connections.",
    unlockedDay: 4,
    theme: { gradient: "from-purple-900/40 via-fuchsia-800/20 to-pink-950/40", accent: "#d946ef", surface: "rgba(217,70,239,0.15)", text: "text-fuchsia-200", buttonBg: "bg-fuchsia-700/60 hover:bg-fuchsia-600/70" },
    activities: [
      { id: "party", name: "Party", description: "Meet celebrities. +Followers fast", category: "social", energyCost: 3, minDay: 4 },
      { id: "perform", name: "Perform", description: "Show your talent. +Reputation", category: "social", energyCost: 4, minDay: 5 },
    ],
  },
  {
    id: "mall",
    name: "Mall",
    icon: "🏪",
    description: "Shop for gear and meet fans.",
    unlockedDay: 3,
    theme: { gradient: "from-cyan-900/40 via-teal-800/20 to-sky-950/40", accent: "#06b6d4", surface: "rgba(6,182,212,0.15)", text: "text-cyan-200", buttonBg: "bg-cyan-700/60 hover:bg-cyan-600/70" },
    activities: [
      { id: "shop_gear", name: "Shop Gear", description: "Buy equipment. +Creativity", category: "explore", energyCost: 2, minDay: 3 },
      { id: "fan_meet", name: "Fan Meet", description: "Meet followers. +Followers +Reputation", category: "social", energyCost: 3, minDay: 4 },
    ],
  },
];

export function getLocation(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
