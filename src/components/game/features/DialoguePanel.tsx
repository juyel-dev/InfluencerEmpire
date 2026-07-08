import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@game/state/gameStore";
import { getNpc } from "@game/data/npcs";
import { getDialogueNode } from "@game/data/story";
import { getLocation } from "@game/data/locations";
import { IconBox } from "@ui/index";
import { CharacterPortrait, NPC_PORTRAITS } from "@assets/characters";
import { TypewriterText } from "./TypewriterText";

export function DialoguePanel() {
  const state = useGameStore((s) => s.state);
  const selectDialogueChoice = useGameStore((s) => s.selectDialogueChoice);
  const endDialogue = useGameStore((s) => s.endDialogue);
  const setScreen = useGameStore((s) => s.setScreen);

  const [showChoices, setShowChoices] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setShowChoices(false);
    setAnimKey((k) => k + 1);
  }, [state.activeDialogueNodeId]);

  const handleChoice = useCallback((i: number) => {
    selectDialogueChoice(i);
    setShowChoices(false);
  }, [selectDialogueChoice]);

  if (!state.activeDialogueNodeId) return null;

  const node = getDialogueNode(state.activeDialogueNodeId);
  const npc = state.activeNpcId ? getNpc(state.activeNpcId) : null;
  const loc = getLocation(state.currentLocation);
  const theme = loc?.theme;

  if (!node) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <p className="text-text-secondary text-center py-10">Dialogue not found.</p>
        <button onClick={() => endDialogue()} className="w-full py-3 rounded-xl text-sm bg-accent-cyan text-black font-semibold">Close</button>
      </div>
    );
  }

  const relationship = state.activeNpcId ? state.relationships[state.activeNpcId] ?? 0 : 0;

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${theme?.gradient ?? ""}`} key={animKey}>
      <button onClick={() => setScreen("map")} className="text-xs text-text-muted hover:text-text-secondary transition-colors">← Back</button>

      <div className="backdrop-blur-2xl rounded-3xl p-5 space-y-5 border border-white/10 animate-scaleIn" style={{ background: `linear-gradient(135deg, ${theme?.accent ?? "#fff"}11, ${theme?.accent ?? "#fff"}06)` }}>
        {/* NPC header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {npc && NPC_PORTRAITS[npc.id] ? (
              <CharacterPortrait config={NPC_PORTRAITS[npc.id]} expression="happy" size={64} className="drop-shadow-lg" />
            ) : (
              <IconBox size="lg" color={theme?.accent}>?</IconBox>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-bg-primary flex items-center justify-center text-[10px] font-bold ${
              relationship >= 10 ? "bg-accent-emerald text-white" : relationship >= 0 ? "bg-accent-amber text-black" : "bg-error text-white"
            }`}>
              {relationship >= 10 ? "+" : relationship >= 0 ? "~" : "-"}
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{npc?.name ?? "???"}</p>
            <p className="text-xs text-text-secondary">{npc?.description ?? ""}</p>
            <div className="flex items-center gap-1 mt-1">
              {[-20, -10, 0, 10, 20].map((threshold) => (
                <div key={threshold} className={`w-4 h-1 rounded-full ${relationship >= threshold ? "bg-accent-emerald" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Dialogue text */}
        <div className="bg-black/30 rounded-card-sm p-5 border border-white/5 min-h-[80px]">
          <p className="text-sm text-white/85 leading-relaxed">
            <TypewriterText key={animKey} text={node.text} speed={20} onDone={() => setTimeout(() => setShowChoices(true), 300)} />
          </p>
        </div>

        {/* Choices */}
        {showChoices && (
          <div className="space-y-2 animate-fadeIn">
            {node.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="w-full text-left px-5 py-3.5 rounded-card-sm border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-accent-cyan/30 hover:translate-x-1 transition-all text-sm text-white/70 hover:text-white active:scale-[0.98]"
              >
                <span className="text-accent-cyan/50 mr-2">▸</span>
                {choice.text}
                {choice.resourceChange && (
                  <span className="ml-2 text-[10px] text-accent-emerald/70">
                    {Object.entries(choice.resourceChange).map(([k, v]) => `+${v} ${k}`).join(" ")}
                  </span>
                )}
                {choice.relationshipChange && (
                  <span className="ml-2 text-[10px] text-accent-purple/70">
                    {Object.entries(choice.relationshipChange).map(([, v]) => `${v > 0 ? "+" : ""}${v} relationship`).join(" ")}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}