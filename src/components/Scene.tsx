"use client";

import { WordItem, PhraseItem } from "@/lib/types";

interface SceneProps {
  scene: string;
  currentTarget: WordItem | PhraseItem;
  showTarget: boolean;
  onTap: () => void;
}

const SCENE_BACKGROUNDS: Record<string, string> = {
  farm: "bg-gradient-to-b from-sky-300 via-green-200 to-green-400",
  garden: "bg-gradient-to-b from-sky-300 via-green-300 to-emerald-400",
  pond: "bg-gradient-to-b from-sky-300 via-blue-200 to-blue-400",
  forest: "bg-gradient-to-b from-green-600 via-green-500 to-emerald-700",
  stage: "bg-gradient-to-b from-purple-900 via-purple-700 to-amber-600",
  room: "bg-gradient-to-b from-amber-100 via-orange-100 to-amber-200",
};

const SCENE_DECORATIONS: Record<string, string[]> = {
  farm: ["🌾", "🏠", "🌳", "☀️"],
  garden: ["🌸", "🌺", "🦋", "🌿"],
  pond: ["🪷", "🌊", "🪵", "☁️"],
  forest: ["🌲", "🍄", "🌿", "🦊"],
  stage: ["🎤", "🎸", "💡", "🎵"],
  room: ["🪟", "📚", "🪑", "🖼️"],
};

export default function Scene({ scene, currentTarget, showTarget, onTap }: SceneProps) {
  const bg = SCENE_BACKGROUNDS[scene] || SCENE_BACKGROUNDS.farm;
  const decorations = SCENE_DECORATIONS[scene] || SCENE_DECORATIONS.farm;

  const targetImage = "image" in currentTarget ? currentTarget.image : "";
  const targetWord = "word" in currentTarget ? currentTarget.word : currentTarget.phrase;

  return (
    <div className={`relative w-full flex-1 rounded-2xl overflow-hidden ${bg} flex items-center justify-center min-h-[300px]`}>
      {/* Scene decorations */}
      <div className="absolute inset-0 flex items-end justify-around p-4 pointer-events-none">
        {decorations.map((d, i) => (
          <span key={i} className="text-3xl opacity-60">{d}</span>
        ))}
      </div>

      {/* Current target item */}
      <button
        onClick={onTap}
        className="relative z-10 flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/30 backdrop-blur-sm transition-all hover:bg-white/50 active:scale-95 cursor-pointer"
      >
        {targetImage && (
          <span className="text-7xl">{targetImage}</span>
        )}
        {"words" in currentTarget && (
          <div className="flex gap-2 flex-wrap justify-center">
            {currentTarget.words.map((w, i) => (
              <span key={i} className="text-3xl bg-white/60 rounded-xl px-3 py-1">
                {showTarget ? w : "…"}
              </span>
            ))}
          </div>
        )}
        {showTarget && (
          <p className="text-lg font-medium text-gray-800">{targetWord}</p>
        )}
      </button>
    </div>
  );
}
