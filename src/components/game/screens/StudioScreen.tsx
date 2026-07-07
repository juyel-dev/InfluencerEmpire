import { useState } from "react";
import { usePlayerStore } from "../../../game/state/playerStore";
import { useGameStore } from "../../../game/state/gameStore";
import { publishContent } from "../../../game/engine/GameLoop";
import { CONTENT } from "../../../game/data/constants";
import type { ContentType, ContentDraft } from "../../../game/types";
import { formatNumber } from "../../../game/utils/formatting";

const contentTypes: { id: ContentType; label: string; icon: string; desc: string }[] = [
  { id: "photo", label: "Photo", icon: "📸", desc: "Quick post, low effort" },
  { id: "video", label: "Video", icon: "🎥", desc: "Medium effort, good reach" },
  { id: "stream", label: "Stream", icon: "🔴", desc: "High effort, best reach" },
];

export function StudioScreen() {
  const content = usePlayerStore((s) => s.content);
  const addNotification = useGameStore((s) => s.addNotification);
  const gameTime = useGameStore((s) => s.gameTime);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("photo");
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    if (title.trim().length < CONTENT.MIN_TITLE_LENGTH) return;
    setIsPublishing(true);

    const draft: ContentDraft = {
      title: title.trim(),
      type: contentType,
      quality: contentType === "photo" ? CONTENT.PHOTO_BASE_QUALITY : contentType === "video" ? CONTENT.VIDEO_BASE_QUALITY : CONTENT.STREAM_BASE_QUALITY,
    };

    publishContent(draft);

    addNotification({
      id: `notif_${Date.now()}`,
      message: `Published: ${title.trim().slice(0, 50)}`,
      type: "success",
      createdAt: gameTime,
      read: false,
    });

    setTitle("");
    setContentType("photo");
    setTimeout(() => setIsPublishing(false), 500);
  };

  const published = content.filter((c) => c.status === "published");
  const totalViews = published.reduce((s, c) => s + c.views, 0);
  const totalFollowers = published.reduce((s, c) => s + c.followersGained, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Studio</h1>
        <p className="text-sm text-white/40 mt-0.5">Create and publish content</p>
      </div>
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 space-y-4 max-w-2xl border border-white/10">
        <div className="space-y-2">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Content Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/10 placeholder:text-white/25 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
            maxLength={CONTENT.MAX_TITLE_LENGTH}
          />
          <p className="text-xs text-white/30 text-right">{title.length}/{CONTENT.MAX_TITLE_LENGTH}</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Content Type</label>
          <div className="grid grid-cols-3 gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setContentType(type.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:bg-white/5 active:scale-[0.98] ${contentType === type.id ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400" : "border-white/10 text-white/50"}`}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-xs font-semibold">{type.label}</span>
                <span className="text-[10px] text-white/30 text-center leading-tight">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handlePublish}
          disabled={title.trim().length < CONTENT.MIN_TITLE_LENGTH || isPublishing}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-cyan-400 text-black hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPublishing ? "Publishing..." : "Publish Now"}
        </button>
      </div>
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 max-w-2xl border border-white/10">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Publishing Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-white/40">Total Published</p><p className="font-semibold text-white tabular-nums">{published.length}</p></div>
          <div><p className="text-white/40">Total Views</p><p className="font-semibold text-white tabular-nums">{formatNumber(totalViews)}</p></div>
          <div><p className="text-white/40">Followers Gained</p><p className="font-semibold text-white tabular-nums">{formatNumber(totalFollowers)}</p></div>
        </div>
      </div>
    </div>
  );
}
