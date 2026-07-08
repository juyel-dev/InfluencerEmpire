import type { Resources } from "../types";

export interface ActivityOutcome {
  resources: Partial<Resources>;
  journal: string;
  message: string;
}

export interface ActivityEffectDef {
  oncePerDay?: boolean;
  requires?: { money?: number; reputation?: number };
  resolve: (rng: () => number, current: Resources) => ActivityOutcome;
}

const dice = (rng: () => number, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1));

export const ACTIVITY_EFFECTS: Record<string, ActivityEffectDef> = {
  sleep: {
    resolve: (_rng, current) => ({
      resources: { energy: current.maxEnergy },
      journal: "Slept well. Full energy restored.",
      message: "Energy fully restored!",
    }),
  },

  check_phone: {
    resolve: (rng, current) => {
      const gain = dice(rng, 0, 1);
      if (gain > 0) {
        return {
          resources: { followers: current.followers + gain },
          journal: `Saw your notifications. +${gain} follower.`,
          message: `+${gain} follower from notifications.`,
        };
      }
      return {
        resources: {},
        journal: "No notifications today. Keep grinding.",
        message: "Quiet on the timeline. Go create something!",
      };
    },
  },

  record_video: {
    resolve: (rng, current) => {
      const c = dice(rng, 4, 7);
      const f = dice(rng, 8, 15);
      return {
        resources: { creativity: current.creativity + c, followers: current.followers + f },
        journal: `Recorded a video! Creativity +${c}, Followers +${f}`,
        message: `Video recorded! +${c} creativity, +${f} followers`,
      };
    },
  },

  edit_content: {
    resolve: (rng, current) => {
      const c = dice(rng, 1, 2);
      const f = dice(rng, 5, 12);
      return {
        resources: { creativity: current.creativity + c, followers: current.followers + f },
        journal: `Edited content. +${c} creativity, +${f} followers.`,
        message: `Content polished! +${c} creativity, +${f} followers`,
      };
    },
  },

  live_stream: {
    resolve: (rng, current) => {
      const m = dice(rng, 15, 35);
      const f = dice(rng, 12, 25);
      const r = dice(rng, 1, 2);
      return {
        resources: {
          money: current.money + m,
          followers: current.followers + f,
          reputation: current.reputation + r,
        },
        journal: `Live streamed! Earned $${m}, gained ${f} followers, +${r} reputation.`,
        message: `Great stream! +$${m}, +${f} followers`,
      };
    },
  },

  workout: {
    oncePerDay: true,
    resolve: (_rng, current) => ({
      resources: { maxEnergy: current.maxEnergy + 1 },
      journal: "Worked out hard. Max energy +1.",
      message: "Max energy +1!",
    }),
  },

  sauna: {
    resolve: (_rng, current) => ({
      resources: { reputation: current.reputation + 2 },
      journal: "Relaxed in sauna. +2 reputation.",
      message: "Reputation +2",
    }),
  },

  meet_people: {
    resolve: (rng, current) => {
      const f = dice(rng, 5, 12);
      const r = dice(rng, 1, 2);
      return {
        resources: { followers: current.followers + f, reputation: current.reputation + r },
        journal: `Networked at cafe. +${f} followers, +${r} reputation.`,
        message: `+${f} followers from networking!`,
      };
    },
  },

  work_alone: {
    resolve: (rng, current) => {
      const c = dice(rng, 5, 9);
      return {
        resources: { creativity: current.creativity + c },
        journal: `Planned content. Creativity +${c}.`,
        message: `Creativity +${c}`,
      };
    },
  },

  party: {
    resolve: (rng, current) => {
      const f = dice(rng, 8, 18);
      const r = dice(rng, 1, 3);
      return {
        resources: { followers: current.followers + f, reputation: current.reputation + r },
        journal: `Partied at the club! +${f} followers, +${r} reputation.`,
        message: `+${f} followers from partying!`,
      };
    },
  },

  perform: {
    resolve: (rng, current) => {
      const f = dice(rng, 5, 15);
      const r = dice(rng, 5, 10);
      const m = dice(rng, 10, 25);
      return {
        resources: {
          followers: current.followers + f,
          reputation: current.reputation + r,
          money: current.money + m,
        },
        journal: `Performed on stage! +${f} followers, +${r} reputation, +$${m}.`,
        message: `Amazing! +${f} followers, +${r} reputation`,
      };
    },
  },

  shop_gear: {
    requires: { money: 25 },
    resolve: (rng, current) => {
      const c = dice(rng, 6, 10);
      return {
        resources: { money: current.money - 25, creativity: current.creativity + c },
        journal: `Bought gear! Creativity +${c}.`,
        message: `New gear! Creativity +${c}`,
      };
    },
  },

  fan_meet: {
    requires: { reputation: 5 },
    resolve: (rng, current) => {
      const f = dice(rng, 10, 20);
      const r = dice(rng, 2, 4);
      return {
        resources: { followers: current.followers + f, reputation: current.reputation + r },
        journal: `Met fans! +${f} followers, +${r} reputation.`,
        message: `+${f} followers from fan meet!`,
      };
    },
  },
};
