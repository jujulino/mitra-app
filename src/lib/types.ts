export type ProgressionLevel = "single-words" | "word-combos" | "short-phrases" | "simple-sentences";

export type InterestTheme = "animals" | "music" | "vehicles" | "nature" | "food";

export type AvatarStyle =
  | "bear" | "bunny" | "cat" | "dinosaur" | "dog" | "frog" | "owl" | "unicorn"
  | "robot" | "fairy" | "wizard" | "mermaid" | "pirate" | "astronaut"
  | "superhero" | "princess" | "ninja" | "dragon";

export type AvatarExpression = "idle" | "happy" | "encouraging" | "celebrating" | "speaking";

export interface AvatarConfig {
  style: AvatarStyle;
  name: string;
  theme: InterestTheme;
}

export interface WordItem {
  word: string;
  image: string; // emoji for v1
  scene: string;
}

export interface PhraseItem {
  phrase: string;
  words: string[];
  scene: string;
}

export interface LevelContent {
  level: ProgressionLevel;
  items: WordItem[] | PhraseItem[];
}

export interface SessionResult {
  date: string;
  level: ProgressionLevel;
  theme: InterestTheme;
  attempted: string[];
  produced: string[];
  durationSeconds: number;
}

export interface ChildProfile {
  name: string;
  avatar: AvatarConfig;
  createdAt: string;
  sessions: SessionResult[];
  currentLevel: ProgressionLevel;
  streak: number;
  lastSessionDate: string | null;
}

export const PROGRESSION_ORDER: ProgressionLevel[] = [
  "single-words",
  "word-combos",
  "short-phrases",
  "simple-sentences",
];
