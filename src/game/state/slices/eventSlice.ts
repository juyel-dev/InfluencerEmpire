import type { SliceCreator } from "../storeTypes";
import type { LocationId } from "../../types";
import { getLocation } from "../../data/locations";
import { getDialogueNode, getRepeatDialogue, getRepeatEncounter } from "../../data/story";
import { audio } from "../../../lib/audio";

export interface EventSlice {
  goToLocation: (id: LocationId) => string | null;
  selectDialogueChoice: (choiceIndex: number) => void;
  endDialogue: () => void;
  startRandomEvent: (nodeId: string) => void;
}

export const createEventSlice: SliceCreator<EventSlice> = (set, get) => ({
  goToLocation: (id) => {
    const s = get().state;
    const loc = getLocation(id);
    if (!loc) return "Location not found.";
    const dialogueUnlocked = s.flags[`unlocked_${id}`];
    if (loc.unlockedDay > s.resources.day && !dialogueUnlocked) return `Locked. (Unlocks day ${loc.unlockedDay})`;

    const events = s.pendingEvents
      .filter((e) => e.locationId === id && e.triggerDay <= s.resources.day)
      .sort((a, b) => b.priority - a.priority);

    if (events.length > 0) {
      const event = events[0];
      const meetsFlags = event.conditionFlags
        ? Object.entries(event.conditionFlags).every(([k, v]) => s.flags[k] === v)
        : true;
      if (meetsFlags) {
        set((st) => ({
          state: {
            ...st.state,
            currentLocation: id,
            visitedLocations: st.state.visitedLocations.includes(id)
              ? st.state.visitedLocations
              : [...st.state.visitedLocations, id],
            pendingEvents: st.state.pendingEvents.filter((e) => e.id !== event.id),
            activeDialogueNodeId: event.dialogueNodeId,
            activeNpcId: event.npcId,
            flags: { ...st.state.flags, [`met_${event.npcId}`]: true },
          },
        }));
        return null;
      }
    }

    const repeatNpcId = getRepeatEncounter(id, s.relationships);
    if (repeatNpcId) {
      const repeatNode = getRepeatDialogue(repeatNpcId, s.seenDialogueNodes);
      if (repeatNode) {
        set((st) => ({
          state: {
            ...st.state,
            currentLocation: id,
            visitedLocations: st.state.visitedLocations.includes(id)
              ? st.state.visitedLocations
              : [...st.state.visitedLocations, id],
            activeDialogueNodeId: repeatNode.id,
            activeNpcId: repeatNpcId,
            seenDialogueNodes: [...st.state.seenDialogueNodes, repeatNode.id],
          },
        }));
        return null;
      }
    }

    set((st) => ({
      state: {
        ...st.state,
        currentLocation: id,
        visitedLocations: st.state.visitedLocations.includes(id)
          ? st.state.visitedLocations
          : [...st.state.visitedLocations, id],
      },
    }));
    return null;
  },

  selectDialogueChoice: (choiceIndex) => {
    const s = get().state;
    if (!s.activeDialogueNodeId) return;
    const node = getDialogueNode(s.activeDialogueNodeId);
    if (!node) return;
    const choice = node.choices[choiceIndex];
    if (!choice) return;

    set((st) => {
      const newState = { ...st.state };
      if (choice.relationshipChange) {
        const rel = { ...newState.relationships };
        for (const [npcId, delta] of Object.entries(choice.relationshipChange)) {
          const key = npcId as keyof typeof rel;
          rel[key] = (rel[key] ?? 0) + (delta as number);
        }
        newState.relationships = rel;
      }
      if (choice.resourceChange) {
        const res = { ...newState.resources };
        for (const [key, val] of Object.entries(choice.resourceChange)) {
          const k = key as keyof typeof res;
          res[k] = (res[k] ?? 0) + (val as number);
        }
        newState.resources = res;
      }
      if (choice.setFlag) newState.flags = { ...newState.flags, [choice.setFlag]: true };
      if (choice.unlocksLocation) {
        newState.flags = { ...newState.flags, [`unlocked_${choice.unlocksLocation}`]: true };
      }
      newState.seenDialogueNodes = [...newState.seenDialogueNodes, node.id];
      if (choice.endsDialogue || choice.nextNodeId === null) {
        newState.activeDialogueNodeId = null;
        newState.activeNpcId = null;
      } else {
        newState.activeDialogueNodeId = choice.nextNodeId;
      }
      return { state: newState };
    });
  },

  endDialogue: () =>
    set((st) => ({ state: { ...st.state, activeDialogueNodeId: null, activeNpcId: null } })),

  startRandomEvent: (nodeId) => {
    const node = getDialogueNode(nodeId);
    if (!node) return;
    audio.play("event");
    set((st) => ({
      screen: "story",
      state: { ...st.state, activeDialogueNodeId: nodeId, activeNpcId: node.npcId },
    }));
  },
});
