import { AvatarStyle } from "@/lib/types";

export interface AvatarOption {
  style: AvatarStyle;
  label: string;
  category: "animals" | "characters" | "heroes";
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // Animals
  { style: "bear", label: "Buddy Bear", category: "animals" },
  { style: "bunny", label: "Bouncy Bunny", category: "animals" },
  { style: "cat", label: "Cuddles Cat", category: "animals" },
  { style: "dinosaur", label: "Dino", category: "animals" },
  { style: "dog", label: "Happy Dog", category: "animals" },
  { style: "frog", label: "Froggy", category: "animals" },
  { style: "owl", label: "Professor Owl", category: "animals" },
  { style: "unicorn", label: "Sparkle Unicorn", category: "animals" },
  // Characters
  { style: "robot", label: "Beep Robot", category: "characters" },
  { style: "fairy", label: "Twinkle Fairy", category: "characters" },
  { style: "wizard", label: "Wise Wizard", category: "characters" },
  { style: "mermaid", label: "Ocean Mermaid", category: "characters" },
  { style: "pirate", label: "Captain Pirate", category: "characters" },
  { style: "astronaut", label: "Space Explorer", category: "characters" },
  // Heroes
  { style: "superhero", label: "Super Hero", category: "heroes" },
  { style: "princess", label: "Brave Princess", category: "heroes" },
  { style: "ninja", label: "Silent Ninja", category: "heroes" },
  { style: "dragon", label: "Friendly Dragon", category: "heroes" },
];

export const AVATAR_COLORS: Record<string, { body: string; face: string; accent: string; highlight: string }> = {
  bear: { body: "#C4956A", face: "#F5DEB3", accent: "#8B6914", highlight: "#D4A574" },
  bunny: { body: "#FFB6C1", face: "#FFF0F5", accent: "#FF69B4", highlight: "#FF85A2" },
  cat: { body: "#FFB347", face: "#FFF3E0", accent: "#FF8C00", highlight: "#FFC966" },
  dinosaur: { body: "#77DD77", face: "#E8F5E9", accent: "#2E7D32", highlight: "#A5D6A7" },
  dog: { body: "#DEB887", face: "#FAEBD7", accent: "#8B4513", highlight: "#E8C89E" },
  frog: { body: "#66BB6A", face: "#C8E6C9", accent: "#1B5E20", highlight: "#81C784" },
  owl: { body: "#A1887F", face: "#EFEBE9", accent: "#4E342E", highlight: "#BCAAA4" },
  unicorn: { body: "#CE93D8", face: "#F3E5F5", accent: "#7B1FA2", highlight: "#E1BEE7" },
  robot: { body: "#6CB4EE", face: "#E8E8E8", accent: "#2E5A88", highlight: "#90CAF9" },
  fairy: { body: "#DDA0DD", face: "#FFF0F5", accent: "#BA55D3", highlight: "#E8B4E8" },
  wizard: { body: "#5C6BC0", face: "#E8EAF6", accent: "#283593", highlight: "#7986CB" },
  mermaid: { body: "#26C6DA", face: "#E0F7FA", accent: "#00838F", highlight: "#4DD0E1" },
  pirate: { body: "#8D6E63", face: "#EFEBE9", accent: "#3E2723", highlight: "#A1887F" },
  astronaut: { body: "#E0E0E0", face: "#F5F5F5", accent: "#1565C0", highlight: "#BDBDBD" },
  superhero: { body: "#EF5350", face: "#FFEBEE", accent: "#B71C1C", highlight: "#EF9A9A" },
  princess: { body: "#F48FB1", face: "#FCE4EC", accent: "#C2185B", highlight: "#F8BBD0" },
  ninja: { body: "#424242", face: "#616161", accent: "#F44336", highlight: "#757575" },
  dragon: { body: "#66BB6A", face: "#E8F5E9", accent: "#FF6F00", highlight: "#A5D6A7" },
};
