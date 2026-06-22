

export interface ConversationPrompt {
  id: number;
  category: string;
  emoji: string;
  level: number;
  question: string;
  expectedAnswer: string;
  encouragement: string;
  phonics: string[];
}

export const conversationPrompts: ConversationPrompt[] = [
  {
    id: 1,
    category: "Greeting",
    emoji: "👋",
    level: 1,
    question: "Can you say Hello?",
    expectedAnswer: "Hello",
    encouragement: "🌟 Wonderful greeting!",
    phonics: ["Hel", "lo"]
  },
  {
    id: 2,
    category: "Animals",
    emoji: "🐶",
    level: 1,
    question: "Can you say Dog?",
    expectedAnswer: "Dog",
    encouragement: "🐾 Great job saying Dog!",
    phonics: ["Dog"]
  },
  {
    id: 3,
    category: "Food",
    emoji: "🍎",
    level: 1,
    question: "Can you say Apple?",
    expectedAnswer: "Apple",
    encouragement: "🍎 Excellent pronunciation!",
    phonics: ["Ap", "ple"]
  },
  {
    id: 4,
    category: "Feelings",
    emoji: "😊",
    level: 2,
    question: "How are you today?",
    expectedAnswer: "Happy",
    encouragement: "💖 I am happy too!",
    phonics: ["Ha", "ppy"]
  },
  {
    id: 5,
    category: "School",
    emoji: "🏫",
    level: 2,
    question: "Can you say Teacher?",
    expectedAnswer: "Teacher",
    encouragement: "📚 Amazing speaking!",
    phonics: ["Tea", "cher"]
  },
  {
    id: 6,
    category: "Colors",
    emoji: "🌈",
    level: 2,
    question: "Can you say Rainbow?",
    expectedAnswer: "Rainbow",
    encouragement: "🌈 Beautiful pronunciation!",
    phonics: ["Rain", "bow"]
  },
  {
    id: 7,
    category: "Social Skills",
    emoji: "🤝",
    level: 3,
    question: "Can you say Friend?",
    expectedAnswer: "Friend",
    encouragement: "🤝 You are a wonderful friend!",
    phonics: ["Friend"]
  },
  {
    id: 8,
    category: "Conversation",
    emoji: "💬",
    level: 3,
    question: "What is your name?",
    expectedAnswer: "My name is",
    encouragement: "💬 Excellent conversation practice!",
    phonics: ["My", "Name", "Is"]
  },
  {
    id: 9,
    category: "Nature",
    emoji: "🦋",
    level: 3,
    question: "Can you say Butterfly?",
    expectedAnswer: "Butterfly",
    encouragement: "🦋 Fantastic pronunciation!",
    phonics: ["But", "ter", "fly"]
  },
  {
    id: 10,
    category: "Adventure",
    emoji: "🚀",
    level: 4,
    question: "Can you say Rocket?",
    expectedAnswer: "Rocket",
    encouragement: "🚀 You are learning super fast!",
    phonics: ["Ro", "cket"]
  }
];

export const rewardMessages = [
  "🌟 Amazing speaking!",
  "🎉 Great pronunciation!",
  "😊 You are improving every day!",
  "🚀 Fantastic effort!",
  "👏 Keep practicing slowly!",
  "🏆 You are becoming a speech superstar!",
  "💖 Wonderful communication!",
  "✨ Your voice sounds amazing!"
];

export const socialQuestions = [
  "What is your favorite color?",
  "Can you tell me your favorite animal?",
  "What makes you happy today?",
  "Can you say good morning?",
  "Who is your best friend?",
  "Can you describe your favorite toy?",
  "What do you like to eat?",
  "Can you say thank you?"
];

export const emotionPrompts = [
  {
    emoji: "😊",
    emotion: "Happy",
    sentence: "I feel happy today!"
  },
  {
    emoji: "😢",
    emotion: "Sad",
    sentence: "I feel sad today."
  },
  {
    emoji: "😲",
    emotion: "Surprised",
    sentence: "Wow! That surprised me!"
  },
  {
    emoji: "😴",
    emotion: "Sleepy",
    sentence: "I feel sleepy now."
  },
  {
    emoji: "🤩",
    emotion: "Excited",
    sentence: "I am excited to learn!"
  }
];

export const storyAdventures = [
  {
    emoji: "🌴",
    title: "Magic Jungle Adventure",
    story:
      "The friendly lion lost his magic apple 🍎. Can you help him say Apple?",
    challenge: "Say Apple slowly and clearly.",
    reward: "🦁 Jungle Hero Badge"
  },
  {
    emoji: "🚀",
    title: "Rainbow Rocket Mission",
    story:
      "The rainbow rocket needs power words to fly through space.",
    challenge: "Can you say Rocket?",
    reward: "🚀 Space Explorer Badge"
  },
  {
    emoji: "🏫",
    title: "Happy School Day",
    story:
      "Your friends are waiting for you at school 😊",
    challenge: "Can you say Hello Friend?",
    reward: "📚 School Superstar"
  },
  {
    emoji: "🦄",
    title: "Unicorn Rainbow Land",
    story:
      "The magical unicorn wants to learn colors 🌈",
    challenge: "Can you say Rainbow?",
    reward: "🌈 Rainbow Champion"
  },
  {
    emoji: "🐼",
    title: "Panda Tea Party",
    story:
      "The baby panda wants to make new friends 💖",
    challenge: "Can you say Friend?",
    reward: "🐼 Friendship Badge"
  }
];

export const funLearningGames = [
  {
    emoji: "🎤",
    title: "Echo Voice Game",
    instruction:
      "Repeat the funny word after AI Buddy slowly.",
    activity: "Speech Practice"
  },
  {
    emoji: "😊",
    title: "Emotion Match",
    instruction:
      "Can you copy this happy face?",
    activity: "Emotion Learning"
  },
  {
    emoji: "🧠",
    title: "Memory Bubble",
    instruction:
      "Remember and repeat the magic word.",
    activity: "Memory Training"
  },
  {
    emoji: "🎯",
    title: "Focus Challenge",
    instruction:
      "Watch the bouncing star carefully ✨",
    activity: "Attention Training"
  },
  {
    emoji: "🌈",
    title: "Rainbow Speaking",
    instruction:
      "Say colorful words slowly and clearly.",
    activity: "Pronunciation Learning"
  }
];

export const emotionalLearningPrompts = [
  {
    emoji: "😊",
    title: "Happy Time",
    prompt:
      "What makes you feel happy today?"
  },
  {
    emoji: "💖",
    title: "Kindness Practice",
    prompt:
      "Can you say something kind to your friend?"
  },
  {
    emoji: "😌",
    title: "Calm Breathing",
    prompt:
      "Take a deep breath with AI Buddy 🌈"
  },
  {
    emoji: "🤗",
    title: "Friendship Moment",
    prompt:
      "Can you say thank you?"
  },
  {
    emoji: "✨",
    title: "Confidence Boost",
    prompt:
      "You are amazing. Can you say I can do it?"
  }
];

export const aiBuddyMessages = [
  "🌟 Amazing speaking superstar!",
  "🚀 Let's go on another adventure together!",
  "💖 AI Buddy is proud of you.",
  "🎉 Fantastic pronunciation today!",
  "🦄 You unlocked a magical reward!",
  "🌈 Keep smiling and learning slowly.",
  "😊 You are becoming more confident every day!",
  "🎤 Let's practice another fun word together!"
];