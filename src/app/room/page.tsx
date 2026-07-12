"use client";

import { useState } from "react";
import Link from "next/link";
import MitraRoom from "@/components/MitraRoom";

export default function RoomPage() {
  const [taps, setTaps] = useState(0);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-purple-100">
      <MitraRoom onPop={() => setTaps((t) => t + 1)} />

      {/* Back */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          ← Home
        </Link>
      </div>

      {/* Magic counter */}
      <div className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
        ✨ Magic taps: {taps}
      </div>

      {/* Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="text-lg font-bold text-gray-700 drop-shadow-sm">
          Tap the shapes! Make them dance! 🎉
        </p>
      </div>
    </div>
  );
}
