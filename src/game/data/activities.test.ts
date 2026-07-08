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
const rngMax = () => 0.999;

describe("ACTIVITY_EFFECTS", () => {
  it("every activity resolves to valid finite numbers with text", () => {
    for (const def of Object.values(ACTIVITY_EFFECTS)) {
      for (const rng of [rngMin, rngMax]) {
        const out = def.resolve(rng, base);
        expect(typeof out.journal).toBe("string");
        expect(typeof out.message).toBe("string");
        expect(out.journal.length).toBeGreaterThan(0);
        for (const v of Object.values(out.resources)) {
          expect(Number.isFinite(v)).toBe(true);
        }
      }
    }
  });

  it("sleep restores energy to maxEnergy", () => {
    const out = ACTIVITY_EFFECTS.sleep.resolve(rngMin, { ...base, energy: 3 });
    expect(out.resources.energy).toBe(10);
  });

  it("workout is oncePerDay and increments maxEnergy", () => {
    expect(ACTIVITY_EFFECTS.workout.oncePerDay).toBe(true);
    const out = ACTIVITY_EFFECTS.workout.resolve(rngMin, base);
    expect(out.resources.maxEnergy).toBe(11);
  });

  it("shop_gear requires money and subtracts exactly 25", () => {
    expect(ACTIVITY_EFFECTS.shop_gear.requires?.money).toBe(25);
    const out = ACTIVITY_EFFECTS.shop_gear.resolve(rngMin, base);
    expect(out.resources.money).toBe(75);
    expect(out.resources.creativity).toBe(16); // 10 + min(6)
  });

  it("fan_meet requires reputation", () => {
    expect(ACTIVITY_EFFECTS.fan_meet.requires?.reputation).toBe(5);
  });

  it("record_video stays within documented bounds", () => {
    const min = ACTIVITY_EFFECTS.record_video.resolve(rngMin, base);
    expect(min.resources.creativity).toBe(14); // 10 + 4
    expect(min.resources.followers).toBe(108); // 100 + 8
    const max = ACTIVITY_EFFECTS.record_video.resolve(rngMax, base);
    expect(max.resources.creativity).toBe(17); // 10 + 7
    expect(max.resources.followers).toBe(115); // 100 + 15
  });

  it("live_stream produces money, followers, and reputation", () => {
    const out = ACTIVITY_EFFECTS.live_stream.resolve(rngMin, base);
    expect(out.resources.money).toBe(115); // 100 + 15
    expect(out.resources.followers).toBe(112); // 100 + 12
    expect(out.resources.reputation).toBe(11); // 10 + 1
  });
});
