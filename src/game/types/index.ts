export type ScreenId = "dashboard" | "studio" | "analytics" | "settings";

export type ContentType = "photo" | "video" | "stream";

export type ContentStatus = "draft" | "publishing" | "published";

export interface GameTime {
  day: number;
  hour: number;
  totalHours: number;
}

export interface PlayerState {
  followers: number;
  totalFollowersEarned: number;
  money: number;
  totalMoneyEarned: number;
  level: number;
  experience: number;
  reputation: number;
  algorithmScore: number;
  ownedUpgrades: string[];
  hoursSinceLastPost: number;
  equipment: Equipment[];
  currentEquipmentSlot: string | null;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  quality: number;
  owned: boolean;
  equipped: boolean;
  cost: number;
}

export type EquipmentType = "phone" | "camera" | "pc" | "lighting" | "audio";

export interface ContentPiece {
  id: string;
  title: string;
  type: ContentType;
  quality: number;
  views: number;
  followersGained: number;
  moneyEarned: number;
  engagement: number;
  createdAt: GameTime;
  status: ContentStatus;
  trendBoost: number;
}

export interface ContentDraft {
  title: string;
  type: ContentType;
  quality: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "achievement";
  createdAt: GameTime;
  read: boolean;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reached: boolean;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  autoSaveInterval: number;
  darkMode: boolean;
}

export interface SaveData {
  version: number;
  timestamp: number;
  player: PlayerState;
  content: ContentPiece[];
  gameTime: GameTime;
  milestones: Milestone[];
  settings: GameSettings;
}
