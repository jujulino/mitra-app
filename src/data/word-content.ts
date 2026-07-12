import { InterestTheme, LevelContent, PhraseItem, WordItem } from "@/lib/types";

type ThemeContent = Record<string, LevelContent[]>;

const animalSingleWords: WordItem[] = [
  { word: "cat", image: "🐱", scene: "farm" },
  { word: "dog", image: "🐕", scene: "farm" },
  { word: "bird", image: "🐦", scene: "garden" },
  { word: "fish", image: "🐟", scene: "pond" },
  { word: "rabbit", image: "🐰", scene: "garden" },
  { word: "horse", image: "🐴", scene: "farm" },
  { word: "frog", image: "🐸", scene: "pond" },
  { word: "duck", image: "🦆", scene: "pond" },
  { word: "cow", image: "🐄", scene: "farm" },
  { word: "bear", image: "🐻", scene: "forest" },
];

const animalWordCombos: PhraseItem[] = [
  { phrase: "cat sleeps", words: ["cat", "sleeps"], scene: "farm" },
  { phrase: "dog runs", words: ["dog", "runs"], scene: "farm" },
  { phrase: "bird sings", words: ["bird", "sings"], scene: "garden" },
  { phrase: "fish swims", words: ["fish", "swims"], scene: "pond" },
  { phrase: "rabbit hops", words: ["rabbit", "hops"], scene: "garden" },
  { phrase: "horse eats", words: ["horse", "eats"], scene: "farm" },
  { phrase: "frog jumps", words: ["frog", "jumps"], scene: "pond" },
  { phrase: "duck quacks", words: ["duck", "quacks"], scene: "pond" },
];

const animalShortPhrases: PhraseItem[] = [
  { phrase: "the cat is sleeping", words: ["the", "cat", "is", "sleeping"], scene: "farm" },
  { phrase: "the dog is running", words: ["the", "dog", "is", "running"], scene: "farm" },
  { phrase: "the bird is singing", words: ["the", "bird", "is", "singing"], scene: "garden" },
  { phrase: "the fish is swimming", words: ["the", "fish", "is", "swimming"], scene: "pond" },
  { phrase: "the rabbit is hopping", words: ["the", "rabbit", "is", "hopping"], scene: "garden" },
];

const animalSimpleSentences: PhraseItem[] = [
  { phrase: "the cat is eating fish", words: ["the", "cat", "is", "eating", "fish"], scene: "farm" },
  { phrase: "the dog is playing outside", words: ["the", "dog", "is", "playing", "outside"], scene: "farm" },
  { phrase: "the bird can fly high", words: ["the", "bird", "can", "fly", "high"], scene: "garden" },
  { phrase: "the horse likes to run", words: ["the", "horse", "likes", "to", "run"], scene: "farm" },
];

const animalContent: LevelContent[] = [
  { level: "single-words", items: animalSingleWords },
  { level: "word-combos", items: animalWordCombos },
  { level: "short-phrases", items: animalShortPhrases },
  { level: "simple-sentences", items: animalSimpleSentences },
];

const musicSingleWords: WordItem[] = [
  { word: "drum", image: "🥁", scene: "stage" },
  { word: "guitar", image: "🎸", scene: "stage" },
  { word: "piano", image: "🎹", scene: "room" },
  { word: "song", image: "🎵", scene: "stage" },
  { word: "dance", image: "💃", scene: "stage" },
  { word: "sing", image: "🎤", scene: "stage" },
  { word: "bell", image: "🔔", scene: "room" },
  { word: "horn", image: "📯", scene: "stage" },
  { word: "clap", image: "👏", scene: "stage" },
  { word: "music", image: "🎶", scene: "room" },
];

const musicWordCombos: PhraseItem[] = [
  { phrase: "play drum", words: ["play", "drum"], scene: "stage" },
  { phrase: "sing song", words: ["sing", "song"], scene: "stage" },
  { phrase: "hear music", words: ["hear", "music"], scene: "room" },
  { phrase: "ring bell", words: ["ring", "bell"], scene: "room" },
  { phrase: "clap hands", words: ["clap", "hands"], scene: "stage" },
  { phrase: "play piano", words: ["play", "piano"], scene: "room" },
];

const musicShortPhrases: PhraseItem[] = [
  { phrase: "the drum is loud", words: ["the", "drum", "is", "loud"], scene: "stage" },
  { phrase: "the song is happy", words: ["the", "song", "is", "happy"], scene: "stage" },
  { phrase: "I can play guitar", words: ["I", "can", "play", "guitar"], scene: "stage" },
  { phrase: "let us sing together", words: ["let", "us", "sing", "together"], scene: "stage" },
];

const musicSimpleSentences: PhraseItem[] = [
  { phrase: "the band is playing a song", words: ["the", "band", "is", "playing", "a", "song"], scene: "stage" },
  { phrase: "I like to play the piano", words: ["I", "like", "to", "play", "the", "piano"], scene: "room" },
  { phrase: "the music makes me dance", words: ["the", "music", "makes", "me", "dance"], scene: "stage" },
];

const musicContent: LevelContent[] = [
  { level: "single-words", items: musicSingleWords },
  { level: "word-combos", items: musicWordCombos },
  { level: "short-phrases", items: musicShortPhrases },
  { level: "simple-sentences", items: musicSimpleSentences },
];

export const themeContent: Record<InterestTheme, LevelContent[]> = {
  animals: animalContent,
  music: musicContent,
  vehicles: animalContent, // placeholder — will be filled with vehicle content
  nature: animalContent, // placeholder
  food: animalContent, // placeholder
};
