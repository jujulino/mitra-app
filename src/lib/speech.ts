import { ProgressionLevel } from "@/lib/types";

type SpeechPhase = "greeting" | "present" | "model" | "prompt" | "success" | "tryAgain" | "encore" | "farewell";

const GREETINGS = [
  "Hey there, sunshine! I'm so happy to see you today!",
  "Oh good, you're here! I was waiting for you! Let's have some fun!",
  "Hi friend! I missed you! Ready to play and learn together?",
  "Yay, you're back! I have something exciting to show you today!",
  "Hello my wonderful friend! I'm so glad we get to learn together!",
];

const PRESENT_PHRASES = [
  "Ooh, look at what I found! Can you see it?",
  "Wow, look over here! I want to show you something cool!",
  "Hey hey hey! Check this out! Isn't it neat?",
  "Oh look look look! I see something really special!",
  "Ready? Look right here! This is going to be so fun!",
];

const MODEL_SINGLE = [
  "This is a {word}! Can you believe it? A {word}!",
  "See this? It's a {word}! I love {word}s, don't you?",
  "Look closely... it's a {word}! {word}, that's what this is!",
  "Ta-da! It's a {word}! Say it with me, {word}!",
];

const MODEL_PHRASE = [
  "Listen carefully... {phrase}. Did you hear that?",
  "I'm going to say something and I want you to try! {phrase}.",
  "Here's what this is doing... {phrase}. Isn't that cool?",
  "Let me say it first, okay? {phrase}. Now you try!",
];

const PROMPT_SINGLE = [
  "Now it's YOUR turn! Can you say {word}? I know you can do it!",
  "Okay friend, let me hear your beautiful voice! Say {word}!",
  "You're so smart! Show me! Can you say {word}?",
  "Deep breath... and say {word}! You've got this!",
  "I believe in you! Let me hear you say {word}!",
];

const PROMPT_PHRASE = [
  "Now it's your turn to be brave! Try saying... {phrase}!",
  "You can do this! Take your time and say... {phrase}!",
  "I know it's a bit longer, but I know you can do it! Say... {phrase}!",
  "Ready? Big strong voice! Can you say... {phrase}?",
];

const SUCCESS = [
  "YES! You did it! I'm SO proud of you! That was amazing!",
  "Woohoo! You said it perfectly! You are so brave!",
  "Oh my goodness, you are INCREDIBLE! I heard you say it! High five!",
  "That was BEAUTIFUL! You are getting so good at this! I'm so happy!",
  "Yay yay yay! You said it! You make my heart so happy!",
  "I knew you could do it! You are so smart and so brave! Wonderful!",
  "That's it! That's exactly right! I'm doing a happy dance for you!",
  "Oh wow, you are getting SO good! I love hearing your voice!",
];

const TRY_AGAIN = [
  "That was a really good try! You're so brave for trying! Let's do it one more time, okay?",
  "I love that you tried! You're getting closer! Can you try again for me?",
  "Almost! You're doing so well! Let's give it another shot, you've got this!",
  "That was great effort! I'm proud of you for trying! One more time, I believe in you!",
  "You know what? Trying is the most important part! And you tried! Let's go again!",
];

const ENCORE = [
  "You know what? Let's do one more! You're on a roll!",
  "Okay okay, one more time because you're doing so amazing!",
  "Can you do it again? I just love hearing your voice!",
];

const FAREWELL = [
  "Oh my goodness, {name}, you did SO wonderful today! I'm so proud of you! Come back and play with me again soon, okay?",
  "Great job today, {name}! You learned so much! You make the best learning buddy! See you next time!",
  "That was so much fun, {name}! You were so brave and so smart today! I can't wait to see you again!",
];

const LEVEL_INTRO: Record<ProgressionLevel, string> = {
  "single-words": "Today we're going to learn some fun new words! Just one word at a time, nice and easy!",
  "word-combos": "You're getting so good! Today we're going to put TWO words together! Isn't that exciting?",
  "short-phrases": "Wow, you're becoming such a good talker! Today we're going to try some short sentences!",
  "simple-sentences": "You are AMAZING! Today we're going to say whole sentences! I know you can do it!",
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getGreeting() {
  return pick(GREETINGS);
}

export function getLevelIntro(level: ProgressionLevel) {
  return LEVEL_INTRO[level];
}

export function getPresentPhrase() {
  return pick(PRESENT_PHRASES);
}

export function getModelPhrase(word: string, level: ProgressionLevel) {
  if (level === "single-words") {
    return pick(MODEL_SINGLE).replaceAll("{word}", word);
  }
  return pick(MODEL_PHRASE).replaceAll("{phrase}", word);
}

export function getPromptPhrase(word: string, level: ProgressionLevel) {
  if (level === "single-words") {
    return pick(PROMPT_SINGLE).replaceAll("{word}", word);
  }
  return pick(PROMPT_PHRASE).replaceAll("{phrase}", word);
}

export function getSuccessPhrase() {
  return pick(SUCCESS);
}

export function getTryAgainPhrase(word: string, level: ProgressionLevel) {
  const template = level === "single-words" ? "Can you try saying {word} one more time?" : "Can you try saying {word} one more time?";
  return pick(TRY_AGAIN) + " " + template.replaceAll("{word}", word);
}

export function getEncorePhrase(word: string) {
  return pick(ENCORE) + " Say {word} one more time!".replaceAll("{word}", word);
}

export function getFarewell(name: string) {
  return pick(FAREWELL).replaceAll("{name}", name);
}

export { speak } from "@/lib/tts";
