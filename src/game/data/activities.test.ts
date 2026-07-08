import { describe, it, expect } from "vitest";
import { ACTIVITY_EFFECTS } from "./activities";
import type { Resources } from "../types";

const base: Resources = {
  followers: 100,
  money: 100,
  energy: 10,
  maxEnergy: 10,
  reputation: 10,
  creativity: 10,
  day: 1,
};

const rngMin = () => 0;
const rngMid = () => 0.5;
const rngMax = () => 0.999;

const delta = (out: { resources: Partial<Resources> }, key: keyof Resources) =>
  (out.resources[key] as number) - (base[key] as number);

describe("ACTIVITY_EFFECTS", () => {
  it("every activity resolves to valid finite numbers, text, and a tier", () => {
    for (const def of Object.values(ACTIVITY_EFFECTS)) {
      for (const rng of [rngMin, rngMid, rngMax]) {
        const out = def.resolve(rng, base);
        expect(typeof out.journal).toBe("string");
        expect(typeof out.message).toBe("string");
        expect(out.journal.length).toBeGreaterThan(0);
        expect(["flop", "normal", "viral"]).toContain(out.tier);
        for (const v of Object.values(out.resources)) {
          expect(Number.isFinite(v)).toBe(true);
        }
      }
    }
  });

  it("activities can fail (flop) or succeed big (viral) at low/high rng", () => {
    const flop = ACTIVITY_EFFECTS.record_video.resolve(rngMax, base);
    const viral = ACTIVITY_EFFECTS.record_video.resolve(rngMin, base);
    expect(flop.tier).toBe("flop");
    expect(viral.tier).toBe("viral");
    expect(delta(viral, "followers")).toBeGreaterThan(delta(flop, "followers"));
  });

  it("sleep restores energy to maxEnergy", () => {
    const out = ACTIVITY_EFFECTS.sleep.resolve(rngMid, { ...base, energy: 3 });
    expect(out.resources.energy).toBe(10);
  });

  it("workout is oncePerDay and increments maxEnergy", () => {
    expect(ACTIVITY_EFFECTS.workout.oncePerDay).toBe(true);
    const out = ACTIVITY_EFFECTS.workout.resolve(rngMid, base);
    expect(out.resources.maxEnergy).toBe(11);
  });

  it("shop_gear requires money and subtracts exactly 25", () => {
    expect(ACTIVITY_EFFECTS.shop_gear.requires?.money).toBe(25);
    const out = ACTIVITY_EFFECTS.shop_gear.resolve(rngMid, base);
    expect(delta(out, "money")).toBe(-25);
    expect(delta(out, "creativity")).toBeGreaterThanOrEqual(6);
    expect(delta(out, "creativity")).toBeLessThanOrEqual(10);
  });

  it("fan_meet requires reputation", () => {
    expect(ACTIVITY_EFFECTS.fan_meet.requires?.reputation).toBe(5);
  });

  it("record_video stays within normal-tier bounds", () => {
    const out = ACTIVITY_EFFECTS.record_video.resolve(rngMid, base);
    expect(out.tier).toBe("normal");
    expect(delta(out, "creativity")).toBeGreaterThanOrEqual(4);
    expect(delta(out, "creativity")).toBeLessThanOrEqual(7);
    expect(delta(out, "followers")).toBeGreaterThanOrEqual(8);
    expect(delta(out, "followers")).toBeLessThanOrEqual(15);
  });

  it("live_stream produces money, followers, and reputation", () => {
    const out = ACTIVITY_EFFECTS.live_stream.resolve(rngMid, base);
    expect(delta(out, "money")).toBeGreaterThanOrEqual(10);
    expect(delta(out, "money")).toBeLessThanOrEqual(30);
    expect(delta(out, "followers")).toBeGreaterThanOrEqual(12);
    expect(delta(out, "followers")).toBeLessThanOrEqual(25);
    expect(delta(out, "reputation")).toBeGreaterThanOrEqual(1);
    expect(delta(out, "reputation")).toBeLessThanOrEqual(2);
  });
});
