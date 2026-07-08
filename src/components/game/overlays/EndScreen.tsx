import { useEffect } from "react";
import { useGameStore } from "@game/state/gameStore";
import { Card } from "@ui/index";
import { audio } from "@lib/audio";

export function EndScreen() {
  const won = useGameStore((s) => s.state.won);
  const lost = useGameStore((s) => s.state.lost);
  const res = useGameStore((s) => s.state.resources);
  const playerName = useGameStore((s) => s.state.playerName);
  const resetGame = useGameStore((s) => s.resetGame);

  const show = won || lost;

  useEffect(() => {
    if (show) audio.play(won ? "win" : "lose");
  }, [show, won]);

  if (!show) return null;

  const playAgain = () => {
    audio.play("click");
    resetGame();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <Card className="w-full max-w-sm p-6 text-center animate-scaleIn" variant="glass">
        <div className="text-5xl">{won ? "🏆" : "💸"}</div>
        <h1 className={`mt-3 text-2xl font-extrabold ${won ? "bg-gradient-to-r from-amber-300 to-accent-purple bg-clip-text text-transparent" : "text-error"}`}>
          {won ? "You Made It!" : "Bankrupt"}
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          {won
            ? `${playerName || "Creator"}, you reached 10,000 followers and became a real influencer.`
            : `The bills caught up, ${playerName || "Creator"}. The empire couldn't sustain itself.`}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-card-xs bg-white/[0.04] p-3">
            <p className="text-[10px] text-text-muted uppercase">Followers</p>
            <p className="font-bold text-accent-cyan tabular-nums">{res.followers}</p>
          </div>
          <div className="rounded-card-xs bg-white/[0.04] p-3">
            <p className="text-[10px] text-text-muted uppercase">Money</p>
            <p className="font-bold text-accent-emerald tabular-nums">${res.money}</p>
          </div>
          <div className="rounded-card-xs bg-white/[0.04] p-3">
            <p className="text-[10px] text-text-muted uppercase">Reputation</p>
            <p className="font-bold text-accent-purple tabular-nums">{res.reputation}</p>
          </div>
          <div className="rounded-card-xs bg-white/[0.04] p-3">
            <p className="text-[10px] text-text-muted uppercase">Day</p>
            <p className="font-bold text-white tabular-nums">{res.day}</p>
          </div>
        </div>

        <button
          onClick={playAgain}
          className="mt-6 w-full py-3 rounded-button text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-black active:scale-[0.98] transition-all"
        >
          {won ? "Play Again" : "Try Again"}
        </button>
      </Card>
    </div>
  );
}
