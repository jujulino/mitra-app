"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { getProfile } from "@/lib/storage";

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    const profile = getProfile();
    if (profile) {
      router.push("/dashboard");
    } else {
      router.push("/setup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md text-center">
        {/* Logo / Avatar preview */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28">
            <Avatar style="bear" expression="happy" size="lg" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mitra</h1>
        <p className="text-lg text-gray-500 mb-1">Learn to Communicate</p>
        <p className="text-sm text-gray-400 mb-8">An avatar companion for expressive communication</p>

        {/* Value prop */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🗣️</span>
            <div>
              <p className="font-medium">Speak with your avatar friend</p>
              <p className="text-sm text-gray-500">Practice words, phrases, and sentences at your own pace</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="font-medium">Learn through what you love</p>
              <p className="text-sm text-gray-500">Animals, music, vehicles — content tailored to your interests</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-medium">No wrong answers, only progress</p>
              <p className="text-sm text-gray-500">Every attempt is celebrated. Build confidence one word at a time.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGetStarted}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600 transition shadow-lg"
        >
          Get Started
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Designed for autistic learners ages 4-8<br />
          with parental guidance
        </p>
      </div>
    </div>
  );
}
