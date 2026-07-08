import type { DialogueNode, StoryEvent, NpcId } from "../types";

export const DIALOGUE_NODES: Record<string, DialogueNode> = {
  // === ZARA (Mentor) — Warm, encouraging, wise ===
  "zara_intro": {
    id: "zara_intro",
    npcId: "zara",
    text: "Hey! I've been watching your content. There's something special about it — raw, honest, unfiltered. Most people try too hard to be perfect. You don't. That's your superpower. Want to turn that into a career?",
    choices: [
      { text: "Yes! That's exactly what I want. Teach me.", nextNodeId: "zara_advice_yes", relationshipChange: { zara: 15 }, resourceChange: { creativity: 3 } },
      { text: "I appreciate the kind words, but I need to figure this out on my own.", nextNodeId: "zara_advice_no", relationshipChange: { zara: -5 } },
      { text: "Who are you, exactly? Why are you helping me?", nextNodeId: "zara_who", relationshipChange: { zara: 5 } },
    ],
  },
  "zara_who": {
    id: "zara_who",
    npcId: "zara",
    text: "Fair question. I've been in this game for 8 years. Built a following of 2 million on YouTube, lost it all when the algorithm changed, rebuilt on Instagram, burned out, took a break, and now I consult. I see a lot of myself in you. That's why I'm here.",
    choices: [
      { text: "That's inspiring. I'd be honored to learn from you.", nextNodeId: "zara_advice_yes", relationshipChange: { zara: 20 } },
      { text: "2 million followers and you lost them? That's terrifying...", nextNodeId: "zara_loss", relationshipChange: { zara: 10 } },
    ],
  },
  "zara_loss": {
    id: "zara_loss",
    npcId: "zara",
    text: "Yeah, it was brutal. One day I'm on top of the world, the next my views drop 80%. I panicked, made bad content, lost more followers. But you know what? That crash taught me more than the rise ever did. Consistency beats virality. Connection beats perfection.",
    choices: [
      { text: "Consistency over virality. I'll remember that.", nextNodeId: "zara_advice_yes", relationshipChange: { zara: 15 } },
    ],
  },
  "zara_advice_yes": {
    id: "zara_advice_yes",
    npcId: "zara",
    text: "Great! First rule: post every single day. Even if it's a blurry photo with a stupid caption. Momentum is everything. Second rule: find your niche — what do you love talking about so much that you'd do it for free? That's your content. Third rule: come find me at the cafe tomorrow. I'll introduce you to people who matter.",
    choices: [
      { text: "The cafe? I'll be there. Can't wait.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 10 }, resourceChange: { creativity: 5 } },
    ],
  },
  "zara_advice_no": {
    id: "zara_advice_no",
    npcId: "zara",
    text: "I respect that. Really, I do. The path is yours to walk. Just know that my door — and the cafe — is always open if you change your mind. Good luck, kid.",
    choices: [
      { text: "...Thanks. Maybe I'll take you up on that.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 5 } },
    ],
  },
  "zara_cafe_meet": {
    id: "zara_cafe_meet",
    npcId: "zara",
    text: "Over here! Grab a coffee and sit down. I want you to meet some folks who can actually help your career. Maya's the one with the pink headphones — she's a streamer with a loyal community. Be yourself around her. She hates fake energy.",
    choices: [
      { text: "Got it. Real energy only. Let's do this.", nextNodeId: "zara_cafe_intro", relationshipChange: { zara: 10 } },
      { text: "I'm nervous around new people. Maybe next time.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: -5 } },
    ],
  },
  "zara_cafe_intro": {
    id: "zara_cafe_intro",
    npcId: "zara",
    text: "Maya! Come here. This is the talent I was telling you about. They've got that spark — you know what I mean. Maya's been looking for a collab partner for her weekend stream. I think you two would kill it together.",
    choices: [
      { text: "Hi Maya! I love your content. I'd love to collab.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 15, maya: 20 }, resourceChange: { followers: 50 } },
      { text: "Nice to meet you. Maybe we can work together sometime.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 5, maya: 10 }, resourceChange: { followers: 25 } },
    ],
  },

  // === LEO (Rival) — Competitive, charismatic, has a hidden soft side ===
  "leo_intro": {
    id: "leo_intro",
    npcId: "leo",
    text: "Well, well, well. The algorithm finally showed me someone worth paying attention to. You've got swagger, I'll give you that. But this town ain't big enough for both of us. Just kidding. ...Mostly.",
    choices: [
      { text: "Haha, I like you. Let's be friends and rivals.", nextNodeId: "leo_friendly", relationshipChange: { leo: 20 } },
      { text: "I didn't come here to compete. I came here to win.", nextNodeId: "leo_rival", relationshipChange: { leo: -15 } },
      { text: "...Are you flexing on me right now?", nextNodeId: "leo_tease", relationshipChange: { leo: 10 } },
    ],
  },
  "leo_tease": {
    id: "leo_tease",
    npcId: "leo",
    text: "Ha! Maybe I am. Look, there's room for all of us. But I'd be lying if I said I didn't want to be the best. Nothing personal — I just want it more. You feel me?",
    choices: [
      { text: "I feel you. May the best creator win — but let's grab a protein shake first.", nextNodeId: "leo_friendly", relationshipChange: { leo: 15 } },
    ],
  },
  "leo_friendly": {
    id: "leo_friendly",
    npcId: "leo",
    text: "You know what? You're alright. Most people in this industry are so fake it hurts. But you seem real. Tell you what — I see you at the gym sometimes. Let's work out together. I'll show you my routine, and maybe we can do a fitness video collab. My audience would eat that up.",
    choices: [
      { text: "Let's do it! Fitness collab sounds epic.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: 20 }, resourceChange: { followers: 100, maxEnergy: 2 } },
      { text: "Gym? I prefer talking business over coffee.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: 5 } },
    ],
  },
  "leo_rival": {
    id: "leo_rival",
    npcId: "leo",
    text: "Ooh, scary. I like the fire. But talking and doing are two different things. Let's see who's still standing in 30 days. Loser buys the winner dinner. Deal?",
    choices: [
      { text: "You're on. Start stretching.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: -10 }, resourceChange: { followers: 20 } },
      { text: "Actually, I was just talking tough. Let's be friends instead?", nextNodeId: "leo_friendly", relationshipChange: { leo: 5 } },
    ],
  },

  // === MAYA (Streamer) — Bubbly, hyper, genuine ===
  "maya_intro": {
    id: "maya_intro",
    npcId: "maya",
    text: "OH MY GOD HIIII! I've seen your stuff and I'm OBSESSED. The way you edited that last video was *chef's kiss*. We have to collab. I'm thinking a co-stream this weekend — we play something silly, chat about content, and our audiences get to meet each other. What do you say?",
    choices: [
      { text: "I'm so in! Let's make it happen!", nextNodeId: "maya_collab", relationshipChange: { maya: 20 } },
      { text: "I'm flattered! Let me build my confidence a bit first.", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 10 }, resourceChange: { followers: 10 } },
      { text: "...Do I know you?", nextNodeId: "maya_offended", relationshipChange: { maya: -20 } },
    ],
  },
  "maya_offended": {
    id: "maya_offended",
    npcId: "maya",
    text: "Ouch. Cold. But okay, I respect the honesty. Hey, when you're ready to network, I'll be at the cafe. No hard feelings either way. 💜",
    choices: [
      { text: "Sorry, I'm just awkward. Let me make it up to you.", nextNodeId: "maya_collab", relationshipChange: { maya: 10 } },
      { text: "Yeah, my bad. I'll hit you up when I'm ready.", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 5 } },
    ],
  },
  "maya_collab": {
    id: "maya_collab",
    npcId: "maya",
    text: "Yesss! Okay, Saturday 8pm. We'll stream for 2 hours. I'll promote it to my community, you promote to yours. Get ready for your follower count to EXPLODE. 💥",
    choices: [
      { text: "I'm ready. Let's blow this up! 🚀", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 25 }, resourceChange: { followers: 200 } },
      { text: "Saturday 8pm. I'll be there. Nervous but excited!", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 20 }, resourceChange: { followers: 150 } },
    ],
  },

  // === OMAR (Agent) — Sleazy but effective ===
  "omar_intro": {
    id: "omar_intro",
    npcId: "omar",
    text: "Let me guess. You're talented, you're working hard, but the money isn't matching the effort. Am I right? I represent people who were exactly where you are now. Last year, one of my clients signed a $50k brand deal. That could be you. How does that sound?",
    choices: [
      { text: "Tell me more. What's the catch?", nextNodeId: "omar_deal", relationshipChange: { omar: 10 } },
      { text: "You sound like a used car salesman. No thanks.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: -20 } },
      { text: "$50k? I'm listening.", nextNodeId: "omar_deal", relationshipChange: { omar: 15 } },
    ],
  },
  "omar_deal": {
    id: "omar_deal",
    npcId: "omar",
    text: "No catch. Standard industry rate. I take 15% of your brand deals and sponsorships. In exchange, I open doors you can't open yourself. Nike, Red Bull, Samsung — these are my clients. You sign with me, you're in the big leagues. What do you say?",
    choices: [
      { text: "15%? That's steep but... okay, let's do it.", nextNodeId: "omar_signed", relationshipChange: { omar: 20 }, resourceChange: { money: 500 } },
      { text: "I'll think about it. Let me grow a bit first.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 5 } },
      { text: "No percentage. Flat fee or nothing.", nextNodeId: "omar_counter", relationshipChange: { omar: 0 } },
    ],
  },
  "omar_counter": {
    id: "omar_counter",
    npcId: "omar",
    text: "Interesting. You negotiate. I like that. Okay, here's my final offer: 10% for the first year, 15% after. And a $200 signing bonus right now. Take it or leave it, kid.",
    choices: [
      { text: "Deal. Shake on it.", nextNodeId: "omar_signed", relationshipChange: { omar: 15 }, resourceChange: { money: 200 } },
      { text: "I'll pass. Thanks for the offer.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: -5 } },
    ],
  },
  "omar_signed": {
    id: "omar_signed",
    npcId: "omar",
    text: "Smart choice. Welcome to the major leagues. Check your phone — I just sent you an advance. I'll be in touch when opportunities come up. Don't embarrass me out there. 😎",
    choices: [
      { text: "Thanks Omar. I won't let you down.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 10 }, setFlag: "signed_with_omar" },
    ],
  },

  // === AVA (Mysterious Artist) — Enigmatic, deep, artistic ===
  "ava_intro": {
    id: "ava_intro",
    npcId: "ava",
    text: "...You stopped. Most people walk past me like I'm part of the furniture. But you stopped. Why? What do you see when you look at me?",
    choices: [
      { text: "I see someone who doesn't belong here. In a good way.", nextNodeId: "ava_explain", relationshipChange: { ava: 25 } },
      { text: "Honestly? You looked interesting. I'm curious.", nextNodeId: "ava_explain", relationshipChange: { ava: 20 } },
      { text: "Sorry, I was lost in thought. I'll leave you alone.", nextNodeId: null, endsDialogue: true, relationshipChange: { ava: -30 } },
    ],
  },
  "ava_explain": {
    id: "ava_explain",
    npcId: "ava",
    text: "I make things. Art, music, poetry — whatever the moment asks for. I don't post online. I don't have followers. I don't care about any of that. I create because I have to. Like breathing. Most people are too busy performing to actually create. But you... you might understand.",
    choices: [
      { text: "I want to see what you make. Please.", nextNodeId: "ava_art", relationshipChange: { ava: 20 } },
      { text: "I create too. Videos, content. But sometimes I feel like I'm just performing.", nextNodeId: "ava_art", relationshipChange: { ava: 25 } },
    ],
  },
  "ava_art": {
    id: "ava_art",
    npcId: "ava",
    text: "Here. This is something I made last night. It's a song. Well, half a song. It's about the space between who we are and who we pretend to be online. Take it. Maybe it'll inspire something real in you.",
    choices: [
      { text: "This is beautiful. I feel it. Thank you, Ava.", nextNodeId: null, endsDialogue: true, relationshipChange: { ava: 30 }, resourceChange: { creativity: 15 } },
      { text: "I'll listen to it when I'm creating tonight. Thanks.", nextNodeId: null, endsDialogue: true, relationshipChange: { ava: 20 }, resourceChange: { creativity: 10 } },
    ],
  },

  // === RANDOM EVENTS (day-end surprises) ===
  "rand_brand": {
    id: "rand_brand",
    npcId: "omar",
    text: "Psst — a brand saw your stuff. They'll pay you $60 to feature their product, but your followers might smell the sellout. Your call.",
    choices: [
      { text: "Take the deal. Rent won't pay itself.", nextNodeId: null, endsDialogue: true, resourceChange: { money: 60, reputation: -3 }, relationshipChange: { omar: 10 } },
      { text: "Decline. I keep my integrity.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 5 }, resourceChange: { creativity: 3 } },
    ],
  },
  "rand_troll": {
    id: "rand_troll",
    npcId: null,
    text: "A troll army just flooded your comments. The drama is getting attention — fast. How do you play it?",
    choices: [
      { text: "Clap back and ride the drama.", nextNodeId: null, endsDialogue: true, resourceChange: { followers: 40, reputation: -4 } },
      { text: "Stay classy and ignore them.", nextNodeId: null, endsDialogue: true, resourceChange: { followers: -8, reputation: 2 } },
    ],
  },
  "rand_resurface": {
    id: "rand_resurface",
    npcId: null,
    text: "One of your old videos is quietly resurfacing on the feeds. People are rediscovering you.",
    choices: [
      { text: "Repost it with a fresh take.", nextNodeId: null, endsDialogue: true, resourceChange: { followers: 55, energy: -2 } },
      { text: "Let it breathe on its own.", nextNodeId: null, endsDialogue: true, resourceChange: { followers: 20 } },
    ],
  },
  "rand_leo_drama": {
    id: "rand_leo_drama",
    npcId: "leo",
    text: "Leo's in some hot water and the internet is picking sides. A clip of you two together is circulating. Distance yourself, or back him up?",
    choices: [
      { text: "Back Leo publicly. Loyalty > clout.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: 25 }, resourceChange: { followers: -15, reputation: 5 } },
      { text: "Stay silent and protect your brand.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: -15 }, resourceChange: { followers: 10, reputation: 2 } },
    ],
  },
};

export const RANDOM_EVENTS: string[] = [
  "rand_brand",
  "rand_troll",
  "rand_resurface",
  "rand_leo_drama",
];

export const STORY_EVENTS: StoryEvent[] = [
  { id: "meet_zara", triggerDay: 1, locationId: "studio", npcId: "zara", dialogueNodeId: "zara_intro", priority: 1 },
  { id: "meet_leo", triggerDay: 2, locationId: "gym", npcId: "leo", dialogueNodeId: "leo_intro", priority: 2 },
  { id: "meet_maya", triggerDay: 3, locationId: "cafe", npcId: "maya", dialogueNodeId: "maya_intro", priority: 3 },
  { id: "meet_omar", triggerDay: 4, locationId: "mall", npcId: "omar", dialogueNodeId: "omar_intro", priority: 4 },
  { id: "meet_ava", triggerDay: 5, locationId: "club", npcId: "ava", dialogueNodeId: "ava_intro", priority: 5 },
  { id: "zara_cafe", triggerDay: 2, locationId: "cafe", npcId: "zara", dialogueNodeId: "zara_cafe_meet", conditionFlags: { "met_zara": true }, priority: 6 },
];

// === REPEATABLE ENCOUNTERS (after main story) ===
const REPEAT_DIALOGUES: Record<string, DialogueNode[]> = {
  zara: [
    {
      id: "zara_repeat_1", npcId: "zara",
      text: "Hey! How's the content grind going? Remember — consistency over perfection. Keep showing up.",
      choices: [{ text: "Thanks Zara. Still going strong!", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 3 }, resourceChange: { creativity: 2 } }],
    },
    {
      id: "zara_repeat_2", npcId: "zara",
      text: "I saw your latest post. Great work! You're finding your voice. Proud of you.",
      choices: [{ text: "That means a lot coming from you.", nextNodeId: null, endsDialogue: true, relationshipChange: { zara: 5 }, resourceChange: { followers: 15 } }],
    },
  ],
  leo: [
    {
      id: "leo_repeat_1", npcId: "leo",
      text: "Still grinding? Good. Me too. Competition keeps us sharp. Don't fall behind.",
      choices: [{ text: "Wouldn't dream of it. You first.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: 3 }, resourceChange: { followers: 10 } }],
    },
    {
      id: "leo_repeat_2", npcId: "leo",
      text: "Hey! Wanna hit the gym together? I'll spot you. Good content starts with good energy.",
      choices: [{ text: "Let's go! Push me hard.", nextNodeId: null, endsDialogue: true, relationshipChange: { leo: 5 }, resourceChange: { maxEnergy: 1, followers: 5 } }],
    },
  ],
  maya: [
    {
      id: "maya_repeat_1", npcId: "maya",
      text: "HEY BESTIEEE! We should stream again soon! Our collab did NUMBERS last time!",
      choices: [{ text: "Let's do it! Same time this weekend?", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 5 }, resourceChange: { followers: 50 } }],
    },
    {
      id: "maya_repeat_2", npcId: "maya",
      text: "I just hit 10k subs! If I can do it, you definitely can. Keep pushing! 💜",
      choices: [{ text: "Congrats! And thanks for the motivation.", nextNodeId: null, endsDialogue: true, relationshipChange: { maya: 5 }, resourceChange: { followers: 20 } }],
    },
  ],
  omar: [
    {
      id: "omar_repeat_1", npcId: "omar",
      text: "I've got a brand that's interested in you. $500 for a single Instagram post. You in?",
      choices: [
        { text: "Hell yes! Send me the details.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 5 }, resourceChange: { money: 500 } },
        { text: "Let me see the brand first. I'm picky.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 3 } },
      ],
    },
    {
      id: "omar_repeat_2", npcId: "omar",
      text: "You're getting noticed, kid. I've had three brands ask about you this week. Keep it up.",
      choices: [{ text: "That's amazing! Thanks for the update.", nextNodeId: null, endsDialogue: true, relationshipChange: { omar: 5 }, resourceChange: { money: 200, followers: 30 } }],
    },
  ],
  ava: [
    {
      id: "ava_repeat_1", npcId: "ava",
      text: "You came back. Most people don't. I made something new — want to see it?",
      choices: [{ text: "Always. Show me.", nextNodeId: null, endsDialogue: true, relationshipChange: { ava: 10 }, resourceChange: { creativity: 8 } }],
    },
    {
      id: "ava_repeat_2", npcId: "ava",
      text: "I've been watching your journey from afar. You're not performing anymore. You're creating. I can tell the difference.",
      choices: [{ text: "That means everything. Thank you.", nextNodeId: null, endsDialogue: true, relationshipChange: { ava: 15 }, resourceChange: { creativity: 10, followers: 10 } }],
    },
  ],
};

export function getRepeatDialogue(npcId: string, seenNodes: string[]): DialogueNode | null {
  const dialogues = REPEAT_DIALOGUES[npcId];
  if (!dialogues || dialogues.length === 0) return null;
  const unseen = dialogues.filter((d) => !seenNodes.includes(d.id));
  if (unseen.length === 0) return dialogues[0];
  return unseen[Math.floor(Math.random() * unseen.length)];
}

const NPC_FAVORITE_LOCATIONS: Record<NpcId, string[]> = {
  zara: ["cafe"],
  leo: ["gym"],
  maya: ["cafe", "studio"],
  omar: ["mall"],
  ava: ["club"],
};

export function getRepeatEncounter(locationId: string, relationships: Record<string, number>): NpcId | null {
  const candidates: NpcId[] = [];
  for (const [npcId, locations] of Object.entries(NPC_FAVORITE_LOCATIONS)) {
    const npc = npcId as NpcId;
    if (locations.includes(locationId) && (relationships[npc] ?? 0) > -20) {
      candidates.push(npc);
    }
  }
  if (candidates.length === 0) return null;
  const rolled = Math.random() < 0.35;
  if (!rolled) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getDialogueNode(id: string): DialogueNode | undefined {
  return DIALOGUE_NODES[id];
}
