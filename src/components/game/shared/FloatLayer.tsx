import { useFeedbackStore, type FloatKind } from "@game/state/feedbackStore";

const KIND_STYLES: Record<FloatKind, string> = {
  follower: "text-accent-cyan",
  money: "text-accent-emerald",
  reputation: "text-accent-purple",
  creativity: "text-accent-fuchsia",
  energy: "text-amber-300",
  good: "text-accent-emerald",
  bad: "text-error",
  info: "text-text-secondary",
};

export function FloatLayer() {
  const floats = useFeedbackStore((s) => s.floats);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {floats.map((f) => (
        <span
          key={f.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 font-extrabold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] animate-floatUp ${KIND_STYLES[f.kind]}`}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </span>
      ))}
    </div>
  );
}
