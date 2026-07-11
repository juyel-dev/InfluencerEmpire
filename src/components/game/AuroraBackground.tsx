import { cn } from "@lib/cn";

/** Cinematic ambient background: slow-drifting brand-color light blobs behind all screens. */
export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div
        className="animate-aurora absolute -top-1/3 -left-1/4 h-[70vw] w-[70vw] rounded-full blur-[110px] opacity-40"
        style={{ background: "radial-gradient(circle, #f43f7a, transparent 60%)" }}
      />
      <div
        className="animate-aurora-slow absolute top-1/4 -right-1/4 h-[60vw] w-[60vw] rounded-full blur-[120px] opacity-30"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 60%)" }}
      />
      <div
        className="animate-aurora absolute -bottom-1/4 left-1/4 h-[65vw] w-[65vw] rounded-full blur-[130px] opacity-25"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 60%)" }}
      />
    </div>
  );
}
