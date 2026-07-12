"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { getProfile, getStats, clearProfile } from "@/lib/storage";
import { ChildProfile } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.push("/setup");
      return;
    }
    setProfile(p);
  }, [router]);

  if (!profile) return null;

  const stats = getStats(profile);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Avatar style={profile.avatar.style} expression="happy" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.name}&apos;s Dashboard</h1>
              <p className="text-sm text-gray-500 capitalize">{profile.currentLevel.replace(/-/g, " ")}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">{stats.streak}🔥</p>
            <p className="text-xs text-gray-400">day streak</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Start session button */}
        <button
          onClick={() => router.push("/session")}
          className="w-full py-5 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600 transition shadow-sm flex items-center justify-center gap-3"
        >
          Start Session ▶
        </button>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-500">{stats.totalSessions}</p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-500">{stats.totalProduced}</p>
            <p className="text-xs text-gray-500">Words spoken</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-500">{stats.totalAttempted}</p>
            <p className="text-xs text-gray-500">Tried</p>
          </div>
        </div>

        {/* Current level */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Current Level</h2>
          <div className="flex items-center gap-3">
            <span className="text-lg capitalize font-bold">{profile.currentLevel.replace(/-/g, " ")}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">{profile.avatar.theme} theme</span>
          </div>
          <div className="mt-3 flex gap-1">
            {["single-words", "word-combos", "short-phrases", "simple-sentences"].map((lvl, i) => (
              <div
                key={lvl}
                className={`h-2 flex-1 rounded-full ${
                  ["single-words", "word-combos", "short-phrases", "simple-sentences"].indexOf(profile.currentLevel) >= i
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        {stats.last5.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Recent Sessions</h2>
            <div className="space-y-3">
              {stats.last5.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{s.level.replace(/-/g, " ")}</p>
                    <p className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{s.produced.length} spoken</p>
                    <p className="text-xs text-gray-400">{s.attempted.length} attempted</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice settings */}
        <button
          onClick={() => router.push("/settings")}
          className="w-full py-3 bg-white text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 border border-purple-200 transition flex items-center justify-center gap-2"
        >
          🎙 Voice Settings — Make the avatar sound real
        </button>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/setup")}
            className="flex-1 py-3 bg-white text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 border border-gray-200 transition"
          >
            Change Settings
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all progress and start over?")) {
                clearProfile();
                router.push("/setup");
              }
            }}
            className="flex-1 py-3 bg-white text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 border border-red-200 transition"
          >
            Reset Profile
          </button>
        </div>
      </div>
    </div>
  );
}
