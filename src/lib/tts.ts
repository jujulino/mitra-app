// ElevenLabs TTS with in-memory audio cache
// Falls back to browser SpeechSynthesis if no API key

const ELEVENLABS_API = "https://api.elevenlabs.io/v1/text-to-speech";

// Warm, nurturing voices from ElevenLabs
const RECOMMENDED_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", desc: "Warm, calm, motherly" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", desc: "Sweet, friendly, energetic" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", desc: "Gentle, encouraging, deep" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", desc: "Playful, upbeat, fun" },
  { id: "jBpfuIE2acCO8z3wKNLl", name: "Gigi", desc: "Child-friendly, soft, cheerful" },
  { id: "oWAxZDx7w5VEj9dCyTzz", name: "Grace", desc: "Patient, kind, clear" },
];

const DEFAULT_VOICE = RECOMMENDED_VOICES[0]; // Rachel

// In-memory audio cache: text+voice → Audio blob URL
const audioCache = new Map<string, string>();

function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mitra-tts-key") || null;
}

export function getTTSSettings() {
  if (typeof window === "undefined") return { hasKey: false, voiceId: DEFAULT_VOICE.id, voiceName: DEFAULT_VOICE.name };
  const key = localStorage.getItem("mitra-tts-key") || "";
  const voiceId = localStorage.getItem("mitra-tts-voice") || DEFAULT_VOICE.id;
  const voiceName = RECOMMENDED_VOICES.find((v) => v.id === voiceId)?.name || DEFAULT_VOICE.name;
  return { hasKey: key.length > 0, voiceId, voiceName };
}

export function setTTSKey(key: string) {
  localStorage.setItem("mitra-tts-key", key);
}

export function setTTSVoice(voiceId: string) {
  localStorage.setItem("mitra-tts-voice", voiceId);
}

export function getVoices() {
  return RECOMMENDED_VOICES;
}

function cacheKey(text: string, voiceId: string): string {
  return `${voiceId}:${text}`;
}

async function fetchElevenLabs(text: string, voiceId: string): Promise<string | null> {
  const key = getApiKey();
  if (!key) return null;

  const cached = audioCache.get(cacheKey(text, voiceId));
  if (cached) return cached;

  try {
    const res = await fetch(`${ELEVENLABS_API}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": key,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.6, // more expressive
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      console.error("ElevenLabs error:", res.status, await res.text());
      return null;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioCache.set(cacheKey(text, voiceId), url);
    return url;
  } catch (err) {
    console.error("ElevenLabs fetch failed:", err);
    return null;
  }
}

function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

// Score a voice for warmth/naturalness. Higher = better.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  let s = 0;
  if (n.includes("natural")) s += 12; // e.g. "Microsoft Aria Online (Natural)"
  if (n.includes("google")) s += 7; // Chrome's Google voices
  if (n.includes("aria") || n.includes("jenny") || n.includes("maya") || n.includes("libby") || n.includes("sonia")) s += 9;
  if (n.includes("samantha")) s += 6; // macOS/iOS
  if (n.includes("zira")) s += 3; // Windows fallback
  if (v.lang === "en-US") s += 2;
  else if (v.lang.startsWith("en")) s += 1;
  return s;
}

// Voices load async on most browsers; wait up to 800ms so we pick a good one
// instead of falling back to the default (often the most robotic) voice.
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const cur = synth.getVoices();
    if (cur.length) {
      resolve(cur);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener("voiceschanged", finish);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish);
    setTimeout(finish, 800);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  return pool.reduce((best, v) => (scoreVoice(v) > scoreVoice(best) ? v : best), pool[0]);
}

function browserSpeak(text: string): Promise<void> {
  return (async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = await loadVoices();
    await new Promise<void>((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voices);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.82; // slightly slower = warmer, easier to follow
      utterance.pitch = 1.12;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  })();
}

// Main speak function: tries ElevenLabs first, falls back to browser
export async function speak(text: string): Promise<void> {
  const settings = getTTSSettings();

  if (settings.hasKey) {
    const audioUrl = await fetchElevenLabs(text, settings.voiceId);
    if (audioUrl) {
      await playAudioUrl(audioUrl);
      return;
    }
  }

  // Fallback to browser TTS
  await browserSpeak(text);
}
