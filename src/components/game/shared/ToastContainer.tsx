import { useGameStore } from "@game/state/gameStore";

const TOAST_STYLES = {
  success: "bg-accent-emerald/20 border-accent-emerald/30 text-accent-emerald",
  warning: "bg-accent-amber/20 border-accent-amber/30 text-accent-amber",
  info: "bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan",
} as const;

export function ToastContainer() {
  const toasts = useGameStore((s) => s.toasts);
  const dismissToast = useGameStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className={`pointer-events-auto w-full px-4 py-3 rounded-card-sm text-sm font-medium shadow-lg backdrop-blur-2xl border animate-slideDown cursor-pointer ${TOAST_STYLES[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}