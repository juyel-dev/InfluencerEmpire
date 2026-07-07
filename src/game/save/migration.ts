import type { SaveData } from "../types";

const CURRENT_VERSION = 1;

export function migrateSaveData(data: Record<string, unknown>): SaveData | null {
  const version = (data.version as number) ?? 0;

  if (version === CURRENT_VERSION) {
    return data as unknown as SaveData;
  }

  if (version < CURRENT_VERSION) {
    return migrateFromV0(data);
  }

  return null;
}

function migrateFromV0(data: Record<string, unknown>): SaveData {
  const player = (data.player as Record<string, unknown>) ?? {};
  return {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    player: {
      followers: (player.followers as number) ?? 3,
      totalFollowersEarned: (player.totalFollowersEarned as number) ?? 0,
      money: (player.money as number) ?? 0,
      totalMoneyEarned: (player.totalMoneyEarned as number) ?? 0,
      level: (player.level as number) ?? 1,
      experience: (player.experience as number) ?? 0,
      reputation: (player.reputation as number) ?? 0,
      algorithmScore: (player.algorithmScore as number) ?? 50,
      ownedUpgrades: (player.ownedUpgrades as string[]) ?? [],
      hoursSinceLastPost: (player.hoursSinceLastPost as number) ?? 0,
      equipment: (player.equipment as SaveData["player"]["equipment"]) ?? [],
      currentEquipmentSlot: (player.currentEquipmentSlot as string) ?? null,
    },
    content: (data.content as SaveData["content"]) ?? [],
    gameTime: (data.gameTime as SaveData["gameTime"]) ?? { day: 1, hour: 8, totalHours: 0 },
    milestones: (data.milestones as SaveData["milestones"]) ?? [],
    settings: (data.settings as SaveData["settings"]) ?? { musicVolume: 50, sfxVolume: 50, autoSaveInterval: 30, darkMode: true },
  };
}

export { CURRENT_VERSION };
