import type { Npc } from "../types";

export const NPCS: Npc[] = [
  {
    id: "zara",
    name: "Zara",
    icon: "👩‍🎤",
    description: "A seasoned influencer. She mentors you.",
  },
  {
    id: "leo",
    name: "Leo",
    icon: "👨‍🎨",
    description: "A rival creator. Competitive but respectful.",
  },
  {
    id: "maya",
    name: "Maya",
    icon: "👩‍💻",
    description: "A tech-savvy streamer. Friendly and helpful.",
  },
  {
    id: "omar",
    name: "Omar",
    icon: "👨‍💼",
    description: "A talent agent. Always looking for new clients.",
  },
  {
    id: "ava",
    name: "Ava",
    icon: "🧑‍🎭",
    description: "A mysterious artist. Hard to read but talented.",
  },
];

export function getNpc(id: string): Npc | undefined {
  return NPCS.find((n) => n.id === id);
}