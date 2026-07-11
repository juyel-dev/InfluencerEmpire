import { useGameStore } from "@game/state/gameStore";
import {
  useResources,
  usePlayerName,
  useFlags,
  useRelationships,
  usePendingEvents,
  useCurrentLocation,
  useCompletedActivities,
} from "@game/state/selectors";
import { LOCATIONS } from "@game/data/locations";
import { NPCS } from "@game/data/npcs";
import type { LocationId } from "@game/types";
import { FINAL_GOAL } from "@game/types";
import { Card, AnimatedNumber } from "@ui/index";
import { CharacterPortrait, NPC_PORTRAITS } from "@assets/characters";
import { audio } from "@lib/audio";
import { cn } from "@lib/cn";
import {
  UserRound,
  Star,
  Zap,
  DollarSign,
  Sparkles,
  Heart,
  Moon,
  Lock,
  Home,
  Flame,
  Lightbulb,
  Clapperboard,
  Dumbbell,
  Coffee,
  Music2,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const LOCATION_ICON: Record<LocationId, LucideIcon> = {
  home: Home,
  studio: Clapperboard,
  gym: Dumbbell,
  cafe: Coffee,
  club: Music2,
  mall: ShoppingBag,
};

function StatTile({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) {
  return (
    <div className="glass-panel rounded-card-xs p-2.5 flex flex-col items-center gap-1.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}22`, color }}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-sm font-bold leading-none text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-wide text-text-secondary">{label}</p>
    </div>
  );
}

export function MapScreen() {
  const res = useResources();
  const playerName = usePlayerName() || "Creator";
  const flags = useFlags();
  const relationships = useRelationships();
  const pendingEvents = usePendingEvents();
  const currentLocation = useCurrentLocation();
  const completedActivities = useCompletedActivities();
  const goToLocation = useGameStore((s) => s.goToLocation);
  const setScreen = useGameStore((s) => s.setScreen);
  const showToast = useGameStore((s) => s.showToast);

  const mainLocations = LOCATIONS.filter((l) => l.id !== "home");
  const home = LOCATIONS.find((l) => l.id === "home")!;
  const progressPct = Math.min((res.followers / FINAL_GOAL) * 100, 100);

  const handleGoTo = (id: LocationId) => {
    const msg = goToLocation(id);
    if (msg) {
      audio.play("fail");
      showToast(msg, "warning");
    } else {
      audio.play("open");
      setScreen("story");
    }
  };

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
      {/* HERO */}
      <Card variant="glass" className="glass-panel glow-brand relative overflow-hidden p-4">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-3/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="brand-gradient h-16 w-16 rounded-2xl p-[2px] shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-bg-primary">
                <UserRound className="h-8 w-8 text-white/90" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-bg-primary">
              <Star className="h-3 w-3 fill-accent-amber text-accent-amber" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-display text-xl font-bold text-white">{playerName}</h1>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                Day {res.day}
              </span>
            </div>
            <div className="mt-1 flex items-end gap-1.5">
              <span className="font-display text-3xl font-extrabold leading-none text-gradient">
                <AnimatedNumber value={res.followers} />
              </span>
              <span className="mb-1 text-xs text-text-secondary">followers</span>
            </div>
          </div>
        </div>

        {/* Path to 10K */}
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-text-secondary">
              <Flame className="h-3.5 w-3.5 text-accent-amber" /> Path to 10K
            </span>
            <span className="font-semibold text-white/80">{progressPct.toFixed(0)}%</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="relative h-full overflow-hidden rounded-full brand-gradient transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-2.5">
        <StatTile icon={Zap} label="Energy" value={`${res.energy}/${res.maxEnergy}`} color="#f59e0b" />
        <StatTile icon={DollarSign} label="Money" value={`$${res.money}`} color="#10b981" />
        <StatTile icon={Sparkles} label="Creative" value={`${res.creativity}`} color="#d946ef" />
        <StatTile icon={Heart} label="Rep" value={`${res.reputation}`} color="#f43f7a" />
      </div>

      {/* FIRST-DAY HINT */}
      {res.day <= 2 && completedActivities.length === 0 && (
        <div className="flex items-start gap-2.5 rounded-card border border-accent-cyan/30 p-3 glass-panel">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
          <p className="text-[11px] leading-relaxed text-text-secondary">
            Tap a location to do activities, grow your following, then{" "}
            <span className="font-semibold text-white">End Day</span> to recover. Post daily or the algorithm eats your
            followers!
          </p>
        </div>
      )}

      {/* NPCS */}
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {NPCS.map((npc) => {
          const met = flags[`met_${npc.id}`];
          const rel = relationships[npc.id] ?? 0;
          const portrait = NPC_PORTRAITS[npc.id];
          return (
            <div
              key={npc.id}
              className={cn(
                "w-[92px] shrink-0 rounded-2xl border p-3 glass-panel flex flex-col items-center gap-2 transition",
                met ? "border-white/10" : "border-white/5 opacity-60",
              )}
            >
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white/5">
                {portrait ? (
                  <CharacterPortrait
                    config={portrait}
                    expression={met ? (rel >= 0 ? "happy" : "sad") : "neutral"}
                    size={48}
                  />
                ) : (
                  <UserRound className="mx-auto mt-3 h-6 w-6 text-white/40" />
                )}
              </div>
              <p className="w-full truncate text-center text-[11px] font-semibold text-white">
                {met ? npc.name : "???"}
              </p>
              <p className={cn("text-[10px]", met ? (rel >= 0 ? "text-success" : "text-error") : "text-text-muted")}>
                {met ? (rel >= 0 ? `+${rel}` : rel) : "Not met"}
              </p>
            </div>
          );
        })}
      </div>

      {/* HOME (featured) */}
      <button
        type="button"
        onClick={() => handleGoTo(home.id)}
        className={cn(
          "flex w-full items-center gap-4 rounded-card border p-4 text-left glass-panel transition active:scale-[0.98]",
          currentLocation === home.id ? "border-accent-cyan/40 glow-brand" : "border-white/10 hover:bg-white/[0.07]",
        )}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: home.theme.accent }}
        >
          <Home className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-white">{home.name}</p>
          <p className="text-xs text-text-secondary">{home.description}</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px]"
          style={
            currentLocation === home.id
              ? { background: `${home.theme.accent}33`, color: home.theme.accent }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }
          }
        >
          {currentLocation === home.id ? "HERE" : "GO"}
        </span>
      </button>

      {/* MAIN LOCATIONS (bento) */}
      <div className="grid grid-cols-2 gap-3">
        {mainLocations
          .filter((l) => l.unlockedDay <= res.day)
          .map((loc) => {
            const Icon = LOCATION_ICON[loc.id];
            const hasEvent = pendingEvents.some((e) => e.locationId === loc.id && e.triggerDay <= res.day);
            const isHere = currentLocation === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleGoTo(loc.id)}
                className={cn(
                  "relative overflow-hidden rounded-card border text-left glass-panel transition active:scale-[0.97]",
                  isHere ? "border-white/25" : "border-white/10 hover:-translate-y-0.5 hover:bg-white/[0.07]",
                )}
                style={
                  isHere
                    ? { boxShadow: `0 0 0 1px ${loc.theme.accent}55, 0 10px 30px ${loc.theme.accent}22` }
                    : undefined
                }
              >
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${loc.theme.accent}, transparent)` }}
                />
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow"
                      style={{ background: `${loc.theme.accent}cc` }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {hasEvent && (
                      <span
                        className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-amber"
                        style={{ boxShadow: "0 0 10px #f59e0b" }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-white">{loc.name}</p>
                    <p className="line-clamp-2 text-[10px] leading-tight text-text-secondary">{loc.description}</p>
                  </div>
                </div>
                {isHere && (
                  <span className="absolute right-2 top-2 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] text-white">
                    HERE
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* LOCKED LOCATIONS */}
      <div className="grid grid-cols-2 gap-3">
        {mainLocations
          .filter((l) => l.unlockedDay > res.day)
          .map((loc) => {
            const Icon = LOCATION_ICON[loc.id];
            return (
              <div
                key={loc.id}
                className="flex flex-col gap-3 rounded-card border border-white/5 p-4 opacity-50 glass-panel"
              >
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-white/70">{loc.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Lock className="h-3 w-3" /> Unlocks Day {loc.unlockedDay}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* END DAY CTA */}
      <button
        type="button"
        onClick={() => {
          useGameStore.getState().endDay();
          showToast("New day begun! Energy restored.", "info");
        }}
        className="flex w-full items-center justify-center gap-2 rounded-card py-4 font-display text-sm font-bold text-white shadow-[0_8px_30px_rgba(168,85,247,0.35)] brand-gradient transition active:scale-[0.98] hover:brightness-110"
      >
        <Moon className="h-4 w-4" /> End Day — Recover Energy
      </button>
    </div>
  );
}
