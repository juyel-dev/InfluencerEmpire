import { useGameStore } from "@game/state/gameStore";
import { getLocation } from "@game/data/locations";
import { DialoguePanel } from "../features/DialoguePanel";
import { ActivityList } from "../features/ActivityList";

export function StoryScreen() {
  const state = useGameStore((s) => s.state);
  const setScreen = useGameStore((s) => s.setScreen);

  if (state.activeDialogueNodeId) {
    return <DialoguePanel />;
  }

  const loc = getLocation(state.currentLocation);

  if (!loc) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <p className="text-text-secondary text-center py-10">Location not found.</p>
        <button onClick={() => setScreen("map")} className="w-full py-3 rounded-xl text-sm bg-accent-cyan text-black font-semibold">Back to Map</button>
      </div>
    );
  }

  return <ActivityList loc={loc} />;
}