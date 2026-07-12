"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { createProfile, getProfile } from "@/lib/storage";
import { AvatarStyle, InterestTheme } from "@/lib/types";
import { AVATAR_OPTIONS } from "@/lib/avatar-styles";

const THEME_OPTIONS: { theme: InterestTheme; label: string; emoji: string; desc: string }[] = [
  { theme: "animals", label: "Animals", emoji: "🐾", desc: "Cats, dogs, farm animals, and more" },
  { theme: "music", label: "Music", emoji: "🎵", desc: "Instruments, songs, and sounds" },
  { theme: "vehicles", label: "Vehicles", emoji: "🚗", desc: "Cars, trucks, trains, and planes" },
  { theme: "nature", label: "Nature", emoji: "🌿", desc: "Trees, weather, and the outdoors" },
  { theme: "food", label: "Food", emoji: "🍎", desc: "Fruits, meals, and cooking" },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"name" | "avatar" | "theme">("name");
  const [name, setName] = useState("");
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>("bear");
  const [theme, setTheme] = useState<InterestTheme>("animals");

  const handleNameNext = () => {
    if (name.trim()) setStep("avatar");
  };

  const handleComplete = () => {
    createProfile(name.trim(), avatarStyle, theme);
    router.push("/session");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {step === "name" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3">
                <Avatar style="bear" expression="happy" />
              </div>
              <h1 className="text-2xl font-bold">Welcome to Mitra!</h1>
              <p className="text-gray-500 mt-1">Let&apos;s set up a learning friend for your child.</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What is your child&apos;s name?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameNext()}
              placeholder="Enter name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <button
              onClick={handleNameNext}
              disabled={!name.trim()}
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}

        {step === "avatar" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-center mb-1">Pick a friend for {name}!</h2>
            <p className="text-gray-500 text-center mb-4 text-sm">This friend will help {name} learn to communicate.</p>

            {(["animals", "characters", "heroes"] as const).map((category) => {
              const opts = AVATAR_OPTIONS.filter((o) => o.category === category);
              const label = category === "animals" ? "Animals" : category === "characters" ? "Characters" : "Heroes & Adventurers";
              return (
                <div key={category} className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {opts.map((opt) => (
                      <button
                        key={opt.style}
                        onClick={() => setAvatarStyle(opt.style)}
                        className={`flex flex-col items-center p-2 rounded-xl border-2 transition active:scale-95 ${
                          avatarStyle === opt.style
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="w-14 h-14">
                          <Avatar style={opt.style} expression={avatarStyle === opt.style ? "happy" : "idle"} />
                        </div>
                        <span className="mt-1 text-xs font-medium text-gray-600 truncate w-full text-center">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setStep("theme")}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition"
            >
              Next →
            </button>
          </div>
        )}

        {step === "theme" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-center mb-1">What does {name} love?</h2>
            <p className="text-gray-500 text-center mb-6 text-sm">We&apos;ll make learning about their favorite things!</p>
            <div className="space-y-3 mb-6">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.theme}
                  onClick={() => setTheme(opt.theme)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left active:scale-[0.98] ${
                    theme === opt.theme
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-4 mb-6">
              <div className="w-16 h-16">
                <Avatar style={avatarStyle} expression="happy" />
              </div>
              <div>
                <p className="font-bold">{name}&apos;s friend</p>
                <p className="text-sm text-gray-500 capitalize">{avatarStyle} · {theme} theme</p>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-200 active:scale-[0.98]"
            >
              Start Learning! 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
