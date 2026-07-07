export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  category: "equipment" | "skill" | "studio";
  cost: number;
  effects: Partial<{
    qualityBonus: number;
    incomeMultiplier: number;
    followerRateBonus: number;
    engagementBonus: number;
  }>;
  requiredLevel: number;
  prerequisiteId: string | null;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: "better_phone",
    name: "Better Phone",
    description: "A flagship phone with a decent camera",
    category: "equipment",
    cost: 50,
    effects: { qualityBonus: 1 },
    requiredLevel: 1,
    prerequisiteId: null,
  },
  {
    id: "ring_light",
    name: "Ring Light",
    description: "Proper lighting makes everything look better",
    category: "equipment",
    cost: 30,
    effects: { qualityBonus: 1, engagementBonus: 0.1 },
    requiredLevel: 1,
    prerequisiteId: null,
  },
  {
    id: "microphone",
    name: "Lavalier Microphone",
    description: "Crystal clear audio for videos",
    category: "equipment",
    cost: 40,
    effects: { qualityBonus: 1 },
    requiredLevel: 1,
    prerequisiteId: null,
  },
  {
    id: "dslr_camera",
    name: "DSLR Camera",
    description: "Professional grade photo and video",
    category: "equipment",
    cost: 200,
    effects: { qualityBonus: 3, engagementBonus: 0.2 },
    requiredLevel: 2,
    prerequisiteId: "better_phone",
  },
  {
    id: "editing_pc",
    name: "Editing PC",
    description: "Render videos 10x faster with better effects",
    category: "equipment",
    cost: 500,
    effects: { qualityBonus: 2, followerRateBonus: 0.15 },
    requiredLevel: 3,
    prerequisiteId: "dslr_camera",
  },
  {
    id: "green_screen",
    name: "Green Screen Setup",
    description: "Professional background effects",
    category: "studio",
    cost: 150,
    effects: { qualityBonus: 1, engagementBonus: 0.15 },
    requiredLevel: 2,
    prerequisiteId: null,
  },
  {
    id: "stream_deck",
    name: "Stream Deck",
    description: "Live production control at your fingertips",
    category: "equipment",
    cost: 100,
    effects: { engagementBonus: 0.25 },
    requiredLevel: 2,
    prerequisiteId: null,
  },
  {
    id: "editing_course",
    name: "Editing Masterclass",
    description: "Learn professional video editing techniques",
    category: "skill",
    cost: 80,
    effects: { qualityBonus: 2 },
    requiredLevel: 1,
    prerequisiteId: null,
  },
  {
    id: "photography_course",
    name: "Photography Fundamentals",
    description: "Master composition, lighting, and color grading",
    category: "skill",
    cost: 60,
    effects: { qualityBonus: 1, engagementBonus: 0.1 },
    requiredLevel: 1,
    prerequisiteId: null,
  },
  {
    id: "marketing_course",
    name: "Social Media Marketing",
    description: "Grow your audience strategically",
    category: "skill",
    cost: 100,
    effects: { followerRateBonus: 0.2, incomeMultiplier: 0.1 },
    requiredLevel: 2,
    prerequisiteId: null,
  },
  {
    id: "studio_room",
    name: "Home Studio",
    description: "Convert a room into a dedicated content studio",
    category: "studio",
    cost: 1000,
    effects: { qualityBonus: 3, incomeMultiplier: 0.25 },
    requiredLevel: 4,
    prerequisiteId: "green_screen",
  },
  {
    id: "lighting_kit",
    name: "Professional Lighting Kit",
    description: "Three-point lighting for cinematic quality",
    category: "equipment",
    cost: 300,
    effects: { qualityBonus: 2, engagementBonus: 0.2 },
    requiredLevel: 3,
    prerequisiteId: "ring_light",
  },
  {
    id: "camera_gimbal",
    name: "Camera Gimbal",
    description: "Buttery smooth footage for dynamic shots",
    category: "equipment",
    cost: 250,
    effects: { qualityBonus: 1, engagementBonus: 0.3 },
    requiredLevel: 2,
    prerequisiteId: null,
  },
  {
    id: "audio_interface",
    name: "Audio Interface",
    description: "Studio-quality audio recording",
    category: "equipment",
    cost: 180,
    effects: { qualityBonus: 1, engagementBonus: 0.15 },
    requiredLevel: 2,
    prerequisiteId: "microphone",
  },
  {
    id: "viral_course",
    name: "Viral Content Strategy",
    description: "Learn what makes content spread like wildfire",
    category: "skill",
    cost: 200,
    effects: { followerRateBonus: 0.3 },
    requiredLevel: 3,
    prerequisiteId: "marketing_course",
  },
];
