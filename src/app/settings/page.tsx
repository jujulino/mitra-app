"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTTSSettings, setTTSKey, setTTSVoice, getVoices, speak } from "@/lib/tts";

export default function SettingsPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getTTSSettings();
    const storedKey = typeof window !== "undefined" ? localStorage.getItem("mitra-tts-key") || "" : "";
    setApiKey(storedKey);
    setVoiceId(settings.voiceId);
  }, []);

  const handleSave = () => {
    setTTSKey(apiKey.trim());
    setTTSVoice(voiceId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTTSKey(apiKey.trim());
    setTTSVoice(voiceId);
    await speak("Hey there, sunshine! I'm so happy to see you today! Let's learn together!");
    setTesting(false);
  };

  const voices = getVoices();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Voice Settings</h1>
        </div>

        {/* Why this matters */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Why ElevenLabs?</strong> The built-in computer voice sounds robotic and lacks emotion.
            Autistic children need a warm, human-sounding voice they can bond with and trust.
            ElevenLabs provides real human voices with genuine warmth and emotion.
          </p>
        </div>

        {/* API Key */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <h2 className="font-semibold mb-1">ElevenLabs API Key</h2>
          <p className="text-xs text-gray-500 mb-3">
            Free at <span className="font-mono text-blue-600">elevenlabs.io</span> — 10,000 free characters/month (~50 sessions)
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your ElevenLabs API key"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
          />
          <p className="text-xs text-gray-400 mt-2">
            Your key is stored only on this device. It is never sent anywhere except ElevenLabs.
          </p>
        </div>

        {/* Voice Selection */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <h2 className="font-semibold mb-3">Choose a Voice</h2>
          <div className="space-y-2">
            {voices.map((v) => (
              <button
                key={v.id}
                onClick={() => setVoiceId(v.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                  voiceId === v.id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.desc}</p>
                </div>
                {voiceId === v.id && <span className="text-blue-500 text-lg">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
          <button
            onClick={handleTest}
            disabled={!apiKey.trim() || testing}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-40 transition"
          >
            {testing ? "Playing..." : "▶ Test Voice"}
          </button>
        </div>

        {/* No key fallback notice */}
        {!apiKey.trim() && (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">
              Without an API key, the app will use the built-in computer voice.<br />
              It works, but it won&apos;t sound as warm and human.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
