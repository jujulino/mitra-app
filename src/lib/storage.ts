import { ChildProfile, ProgressionLevel, PROGRESSION_ORDER, SessionResult } from "@/lib/types";

const STORAGE_KEY = "mitra-profile";

export function getProfile(): ChildProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChildProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ChildProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createProfile(name: string, avatarStyle: string, theme: string): ChildProfile {
  const profile: ChildProfile = {
    name,
    avatar: {
      style: avatarStyle as ChildProfile["avatar"]["style"],
      name: avatarStyle,
      theme: theme as ChildProfile["avatar"]["theme"],
    },
    createdAt: new Date().toISOString(),
    sessions: [],
    currentLevel: "single-words",
    streak: 0,
    lastSessionDate: null,
  };
  saveProfile(profile);
  return profile;
}

export function addSessionResult(result: SessionResult): ChildProfile {
  const profile = getProfile();
  if (!profile) throw new Error("No profile found");

  profile.sessions.push(result);

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastDate = profile.lastSessionDate
    ? new Date(profile.lastSessionDate).toDateString()
    : null;

  if (lastDate === today) {
    // same day, streak unchanged
  } else if (lastDate === yesterday) {
    profile.streak += 1;
  } else {
    profile.streak = 1;
  }
  profile.lastSessionDate = new Date().toISOString();

  saveProfile(profile);
  return profile;
}

export function advanceLevel(profile: ChildProfile): ChildProfile {
  const idx = PROGRESSION_ORDER.indexOf(profile.currentLevel);
  if (idx < PROGRESSION_ORDER.length - 1) {
    profile.currentLevel = PROGRESSION_ORDER[idx + 1];
    saveProfile(profile);
  }
  return profile;
}

export function getStats(profile: ChildProfile) {
  const totalSessions = profile.sessions.length;
  const totalAttempted = profile.sessions.reduce((sum, s) => sum + s.attempted.length, 0);
  const totalProduced = profile.sessions.reduce((sum, s) => sum + s.produced.length, 0);
  const last5 = profile.sessions.slice(-5).reverse();
  return { totalSessions, totalAttempted, totalProduced, last5, streak: profile.streak, level: profile.currentLevel };
}
