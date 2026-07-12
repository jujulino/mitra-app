"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  startListening: (targetWord: string) => void;
  stopListening: () => void;
  lastResult: string | null;
  lastMatch: boolean;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [lastMatch, setLastMatch] = useState(false);
  const recognitionRef = useRef<any>(null);
  const targetRef = useRef<string>("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setIsSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript: string = event.results[0][0].transcript.toLowerCase().trim();
        setLastResult(transcript);

        const target = targetRef.current.toLowerCase();
        const words = target.split(" ");
        const matched = words.length === 1
          ? transcript.includes(target) || levenshtein(transcript, target) <= 2
          : words.every((w) => transcript.includes(w) || [...transcript.split(" ")].some((t) => levenshtein(t, w) <= 1));

        setLastMatch(matched);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = useCallback((targetWord: string) => {
    targetRef.current = targetWord;
    setLastResult(null);
    setLastMatch(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // already started
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, isSupported, startListening, stopListening, lastResult, lastMatch };
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return dp[a.length][b.length];
}
