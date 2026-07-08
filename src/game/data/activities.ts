import type { Resources } from "../types";

export type OutcomeTier = "flop" | "normal" | "viral";

export interface ActivityOutcome {
  resources: Partial<Resources>;
  journal: string;
  message: string;
  tier: OutcomeTier;
}

export interface ActivityEffectDef {
  oncePerDay?: boolean;
  requires?: { money?: number; reputation?: number };
  resolve: (rng: () => number, current: Resources) => ActivityOutcome;
}

const dice = (rng: () => number, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1));

function rollTier(rng: () => number, creativity: number): OutcomeTier {
  const viral = Math.min(0.04 + creativity * 0.008, 0.26);
  const flop = Math.max(0.24 - creativity * 0.008, 0.08);
  const r = rng();
  if (r < viral) return "viral";
  if (r > 1 - flop) return "flop";
  return "normal";
}

function scale(t: OutcomeTier, v: number): number {
  if (t === "viral") return Math.round(v * 2.3);
  if (t === "flop") return Math.round(v * 0.3);
  return v;
}

interface PostOpts {
  verb: string;
  fMin: number;
  fMax: number;
  cMin?: number;
  cMax?: number;
  mMin?: number;
  mMax?: number;
  rMin?: number;
  rMax?: number;
  flopRisk?: boolean;
  moneyLabel?: string;
}

function post(rng: () => number, current: Resources, o: PostOpts): ActivityOutcome {
  const t = rollTier(rng, current.creativity);
  let f = scale(t, dice(rng, o.fMin, o.fMax));
  const c = o.cMin != null ? scale(t, dice(rng, o.cMin, o.cMax!)) : 0;
  const m = o.mMin != null ? scale(t, dice(rng, o.mMin, o.mMax!)) : 0;
  const r = o.rMin != null ? scale(t, dice(rng, o.rMin, o.rMax!)) : 0;
  if (t === "flop" && o.flopRisk) f = -Math.max(1, Math.round(Math.abs(f) * 0.4));

  const parts: string[] = [];
  if (f !== 0) parts.push(`${f > 0 ? "+" : ""}${f} followers`);
  if (c !== 0) parts.push(`${c > 0 ? "+" : ""}${c} creativity`);
  if (m !== 0) parts.push(`${m > 0 ? "+" : ""}$${m}`);
  if (r !== 0) parts.push(`${r > 0 ? "+" : ""}${r} rep`);

  let message: string;
  let journal: string;
  if (t === "viral") {
    message = `🔥 VIRAL! ${o.verb} blew up! ${parts.join(", ")}`;
    journal = `Went viral! ${o.verb}. ${parts.join(", ")}.`;
  } else if (t === "flop") {
    message = f < 0 ? `💔 Flopped. ${o.verb} backfired. ${parts.join(", ")}` : `Meh. ${o.verb} fell flat. ${parts.join(", ")}`;
    journal = `Flopped. ${o.verb}. ${parts.join(", ")}.`;
  } else {
    message = `${o.verb} done! ${parts.join(", ")}`;
    journal = `${o.verb}. ${parts.join(", ")}.`;
  }

  const resources: Partial<Resources> = {};
  if (f !== 0) resources.followers = current.followers + f;
  if (c !== 0) resources.creativity = current.creativity + c;
  if (m !== 0) resources.money = current.money + m;
  if (r !== 0) resources.reputation = current.reputation + r;

  return { resources, journal, message, tier: t };
}

export const ACTIVITY_EFFECTS: Record<string, ActivityEffectDef> = {
  sleep: {
    resolve: (_rng, current) => ({
      resources: { energy: current.maxEnergy },
      journal: "Slept well. Full energy restored.",
      message: "Energy fully restored!",
      tier: "normal",
    }),
  },

  check_phone: {
    resolve: (rng, current) => {
      const gain = dice(rng, 0, 2);
      if (gain > 0) {
        return {
          resources: { followers: current.followers + gain },
          journal: `Saw your notifications. +${gain} follower.`,
          message: `+${gain} follower from notifications.`,
          tier: "normal",
        };
      }
      return {
        resources: {},
        journal: "No notifications today. Keep grinding.",
        message: "Quiet on the timeline. Go create something!",
        tier: "flop",
      };
    },
  },

  record_video: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Recorded a video", fMin: 8, fMax: 15, cMin: 4, cMax: 7, mMin: -4, mMax: -2, flopRisk: true }),
  },

  edit_content: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Edited content", fMin: 5, fMax: 12, cMin: 1, cMax: 2, mMin: -1, mMax: 0 }),
  },

  live_stream: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Live streamed", fMin: 12, fMax: 25, mMin: 10, mMax: 30, rMin: 1, rMax: 2 }),
  },

  workout: {
    oncePerDay: true,
    resolve: (_rng, current) => ({
      resources: { maxEnergy: current.maxEnergy + 1 },
      journal: "Worked out hard. Max energy +1.",
      message: "Max energy +1!",
      tier: "normal",
    }),
  },

  sauna: {
    resolve: (_rng, current) => ({
      resources: { reputation: current.reputation + 2 },
      journal: "Relaxed in sauna. +2 reputation.",
      message: "Reputation +2",
      tier: "normal",
    }),
  },

  meet_people: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Networked at cafe", fMin: 5, fMax: 12, rMin: 1, rMax: 2 }),
  },

  work_alone: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Planned content", fMin: 0, fMax: 0, cMin: 5, cMax: 9 }),
  },

  party: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Partied at the club", fMin: 8, fMax: 18, rMin: 1, rMax: 3 }),
  },

  perform: {
    resolve: (rng, current) =>
      post(rng, current, { verb: "Performed on stage", fMin: 5, fMax: 15, rMin: 5, rMax: 10, mMin: 2, mMax: 17, flopRisk: true }),
  },

  shop_gear: {
    requires: { money: 25 },
    resolve: (rng, current) => {
      const c = dice(rng, 6, 10);
      return {
        resources: { money: current.money - 25, creativity: current.creativity + c },
        journal: `Bought gear! Creativity +${c}.`,
        message: `New gear! Creativity +${c}`,
        tier: "normal",
      };
    },
  },

  fan_meet: {
    requires: { reputation: 5 },
    resolve: (rng, current) =>
      post(rng, current, { verb: "Met fans", fMin: 10, fMax: 20, rMin: 2, rMax: 4 }),
  },
};
