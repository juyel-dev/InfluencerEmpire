import { useState } from "react";
import { useGameStore } from "@game/state/gameStore";
import { Card } from "@ui/index";
import { LogoMark } from "@assets/illustrations";
import { audio } from "@lib/audio";

const AVATARS = ["😎", "🦄", "🔥", "🌟", "👑", "🐱", "🤖", "💡"];

export function IntroScreen() {
  const playerName = useGameStore((s) => s.state.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  if (playerName) return null;

  const start = () => {
    audio.play("open");
    setPlayerName(name.trim() || "Creator");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-bg-primary animate-fadeIn">
      <Card className="w-full max-w-sm p-6 animate-scaleIn" variant="glass">
        <div className="text-center">
          <LogoMark size={56} className="mx-auto text-accent-cyan" />
          <p className="text-4xl mt-2">{avatar}</p>
          <h1 className="mt-2 text-2xl font-extrabold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Influencer Empire
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Build a following from zero. Post daily, make friends, survive the algorithm.
          </p>
        </div>

        <label className="block mt-5 text-xs uppercase tracking-widest text-text-secondary">Your name</label>
        <input
          autoFocus
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="e.g. Alex"
          className="mt-1 w-full rounded-button bg-white/[0.06] border border-white/10 px-4 py-3 text-white outline-none focus:border-accent-cyan transition-colors"
        />

        <label className="block mt-4 text-xs uppercase tracking-widest text-text-secondary">Pick a look</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => {
                audio.play("click");
                setAvatar(a);
              }}
              className={`text-2xl py-2 rounded-card-xs border transition-all ${
                avatar === a ? "border-accent-cyan bg-white/[0.1]" : "border-white/10 hover:bg-white/[0.05]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          onClick={start}
          className="mt-6 w-full py-3 rounded-button text-sm font-bold bg-gradient-to-r from-accent-cyan to-accent-purple text-black active:scale-[0.98] transition-all"
        >
          Start Your Journey
        </button>
        <p className="text-[10px] text-text-muted text-center mt-3">Tip: post every day or you lose followers to the feed.</p>
      </Card>
    </div>
  );
}
