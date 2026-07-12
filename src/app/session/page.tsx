"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import Scene from "@/components/Scene";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { getProfile, addSessionResult } from "@/lib/storage";
import { AvatarExpression, InterestTheme, PhraseItem, ProgressionLevel, WordItem } from "@/lib/types";
import { themeContent } from "@/data/word-content";
import {
  speak,
  getGreeting,
  getLevelIntro,
  getPresentPhrase,
  getModelPhrase,
  getPromptPhrase,
  getSuccessPhrase,
  getTryAgainPhrase,
  getFarewell,
} from "@/lib/speech";

type Phase = "greeting" | "present" | "model" | "prompt" | "listen" | "success" | "retry";

export default function SessionPage() {
  const router = useRouter();
  const { isListening, isSupported, startListening, stopListening, lastResult, lastMatch } = useSpeechRecognition();
  const [phase, setPhase] = useState<Phase>("greeting");
  const [itemIndex, setItemIndex] = useState(0);
  const [expression, setExpression] = useState<AvatarExpression>("happy");
  const [speaking, setSpeaking] = useState(false);
  const [items, setItems] = useState<(WordItem | PhraseItem)[]>([]);
  const [theme, setTheme] = useState<InterestTheme>("animals");
  const [level, setLevel] = useState<ProgressionLevel>("single-words");
  const [avatarStyle, setAvatarStyle] = useState<string>("bear");
  const [childName, setChildName] = useState("friend");
  const [attempted, setAttempted] = useState<string[]>([]);
  const [produced, setProduced] = useState<string[]>([]);
  const [showTarget, setShowTarget] = useState(false);
  const [avatarCaption, setAvatarCaption] = useState("");
  const [parentOverride, setParentOverride] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const startTime = useRef(Date.now());
  const mounted = useRef(false);

  // Load profile and content
  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/setup");
      return;
    }
    setChildName(profile.name);
    setTheme(profile.avatar.theme);
    setLevel(profile.currentLevel);
    setAvatarStyle(profile.avatar.style);

    const content = themeContent[profile.avatar.theme];
    const levelContent = content.find((l) => l.level === profile.currentLevel);
    if (levelContent) {
      const shuffled = [...levelContent.items].sort(() => Math.random() - 0.5).slice(0, 5);
      setItems(shuffled);
    }

    // Load voices eagerly
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, [router]);

  // Wrapper for speak that also manages expression state
  const say = useCallback(
    async (text: string, whileExpression: AvatarExpression = "speaking"): Promise<void> => {
      setSpeaking(true);
      setExpression(whileExpression);
      setAvatarCaption(text);
      await speak(text);
      setSpeaking(false);
      setExpression("idle");
    },
    []
  );

  // Greeting + first item
  useEffect(() => {
    if (items.length === 0 || mounted.current) return;
    mounted.current = true;
    startTime.current = Date.now();

    (async () => {
      setExpression("happy");
      await say(getGreeting(), "happy");
      await say(getLevelIntro(level), "encouraging");
      startItemFlow();
    })();
  }, [items]);

  const startItemFlow = useCallback(async () => {
    setPhase("present");
    setShowTarget(false);
    setExpression("happy");
    setAvatarCaption("");
    setRetryCount(0);

    const item = items[itemIndex];
    if (!item) return;
    const word = "word" in item ? item.word : item.phrase;

    await say(getPresentPhrase(), "happy");
    setPhase("model");
    setShowTarget(true);
    await say(getModelPhrase(word, level), "speaking");
    setPhase("prompt");
    setExpression("encouraging");
    await say(getPromptPhrase(word, level), "encouraging");
    setPhase("listen");
    setExpression("encouraging");
    if (isSupported) {
      startListening(word);
    }
  }, [items, itemIndex, level, isSupported, startListening, say]);

  // Handle speech recognition result
  useEffect(() => {
    if (phase !== "listen" || lastResult === null) return;

    stopListening();
    const word = items[itemIndex] ? ("word" in items[itemIndex] ? items[itemIndex].word : items[itemIndex].phrase) : "";
    setAttempted((prev) => [...prev, word]);

    if (lastMatch || parentOverride) {
      handleSuccess(word);
    } else {
      handleRetry(word);
    }
    setParentOverride(false);
  }, [lastResult, lastMatch, phase, parentOverride]);

  const handleSuccess = useCallback(
    async (word: string) => {
      setProduced((prev) => [...prev, word]);
      setExpression("celebrating");
      setPhase("success");
      await say(getSuccessPhrase(), "celebrating");
      advanceItem();
    },
    [say]
  );

  const handleRetry = useCallback(
    async (word: string) => {
      setRetryCount((prev) => prev + 1);
      setExpression("encouraging");
      setPhase("retry");

      if (retryCount >= 2) {
        // After 2 retries, move on with encouragement
        await say("You know what, that's okay! Trying is what makes you brave! Let's try a new one!", "encouraging");
        advanceItem();
        return;
      }

      await say(getTryAgainPhrase(word, level), "encouraging");
      setPhase("listen");
      setExpression("encouraging");
      if (isSupported) {
        startListening(word);
      }
    },
    [retryCount, level, isSupported, startListening, say]
  );

  const advanceItem = useCallback(() => {
    if (itemIndex + 1 >= items.length) {
      endSession();
      return;
    }
    setItemIndex((prev) => prev + 1);
    // Start flow for next item after state update
    setTimeout(() => startItemFlow(), 100);
  }, [itemIndex, items.length, startItemFlow]);

  const endSession = useCallback(async () => {
    const profile = getProfile();
    if (!profile) return;

    const duration = Math.round((Date.now() - startTime.current) / 1000);
    addSessionResult({
      date: new Date().toISOString(),
      level,
      theme,
      attempted,
      produced,
      durationSeconds: duration,
    });

    setExpression("celebrating");
    await say(getFarewell(childName), "celebrating");
    router.push("/dashboard");
  }, [attempted, produced, level, theme, childName, router, say]);

  const handleParentConfirm = () => {
    setParentOverride(true);
  };

  const handleSkip = () => {
    stopListening();
    const word = items[itemIndex] ? ("word" in items[itemIndex] ? items[itemIndex].word : items[itemIndex].phrase) : "";
    setAttempted((prev) => [...prev, word]);
    advanceItem();
  };

  const handleMicRetry = () => {
    const word = items[itemIndex] ? ("word" in items[itemIndex] ? items[itemIndex].word : items[itemIndex].phrase) : "";
    if (isSupported) {
      startListening(word);
    }
  };

  const currentItem = items[itemIndex];

  if (!currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <Avatar style="bear" expression="happy" size="lg" />
          </div>
          <p className="text-xl text-gray-600">Getting ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-400 hover:text-gray-600 bg-white/50 px-3 py-1 rounded-full"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < itemIndex ? "bg-green-400" : i === itemIndex ? "bg-blue-500 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-2">
        <div className={speaking ? "animate-bounce" : ""}>
          <Avatar style={avatarStyle as any} expression={expression} size="lg" speaking={speaking} />
        </div>
        {avatarCaption && (
          <div className="mt-2 max-w-[280px] text-center">
            <p className="text-sm text-gray-600 bg-white/70 rounded-xl px-4 py-2 leading-relaxed">
              {avatarCaption.length > 80 ? avatarCaption.substring(0, 80) + "..." : avatarCaption}
            </p>
          </div>
        )}
      </div>

      {/* Scene */}
      <div className="flex-1 px-4 pb-4">
        <Scene
          scene={currentItem.scene}
          currentTarget={currentItem}
          showTarget={showTarget}
          onTap={() => {
            if (phase === "present" || phase === "model") return;
            const word = "word" in currentItem ? currentItem.word : currentItem.phrase;
            say(word);
          }}
        />
      </div>

      {/* Controls */}
      <div className="px-4 pb-6 pt-2">
        {phase === "listen" && (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${
                isListening ? "bg-red-100 animate-pulse shadow-lg shadow-red-200" : "bg-white/80"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${isListening ? "bg-red-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium">
                {isListening ? `Listening for ${"word" in currentItem ? currentItem.word : currentItem.phrase}...` : "Tap the mic to try!"}
              </span>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={handleMicRetry}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 shadow-sm transition active:scale-95"
              >
                🎤 Try again
              </button>
              <button
                onClick={handleParentConfirm}
                className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 shadow-sm transition active:scale-95"
              >
                👍 Yes, they said it!
              </button>
              <button
                onClick={handleSkip}
                className="px-5 py-2.5 bg-white text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 border border-gray-200 transition active:scale-95"
              >
                Next →
              </button>
            </div>
            {lastResult && !lastMatch && (
              <p className="text-xs text-gray-400">I heard: &quot;{lastResult}&quot;</p>
            )}
          </div>
        )}
        {phase !== "listen" && (
          <p className="text-center text-sm text-gray-400">
            {phase === "greeting" && `${childName}'s avatar is saying hello!`}
            {phase === "present" && "Look at what your friend found!"}
            {phase === "model" && "Listen carefully to your friend!"}
            {phase === "prompt" && "Get ready to use your voice!"}
            {phase === "success" && "You did it! Amazing!"}
            {phase === "retry" && "Keep trying, you're doing great!"}
          </p>
        )}
      </div>
    </div>
  );
}
