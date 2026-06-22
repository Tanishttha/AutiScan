export interface SpeechResult {
  transcript: string;
  isCorrect: boolean;
  confidence: number;
  phonics: string[];
  feedback: string;
  practiceRequired: number;
  difficultyLevel: string;
  emotionalFeedback: string;
  starsEarned: number;
  nextSuggestion: string;
}

const encouragements = [
  "🌟 Amazing speaking!",
  "🎉 Great pronunciation!",
  "😊 You are improving!",
  "🚀 Fantastic effort!",
  "👏 Excellent practice!"
];

const emotionalResponses = [
  "💖 It's okay. Let's practice slowly together.",
  "🌈 You are learning beautifully.",
  "😊 AI Buddy believes in you!",
  "✨ Great effort. Try one more time.",
  "🦄 Every practice makes you stronger."
];

const adaptiveSuggestions = [
  "🎤 Try speaking slower.",
  "🧠 Break the word into small sounds.",
  "👂 Listen carefully and repeat.",
  "🌈 Practice the first sound first.",
  "✨ Repeat after AI Buddy slowly."
];

export const getEncouragement = () => {
  return encouragements[
    Math.floor(
      Math.random() * encouragements.length
    )
  ];
};

export const speakSlowly = (
  text: string,
  rate: number = 0.75
) => {

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.lang = "en-US";

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  speechSynthesis.cancel();
};

export const splitIntoPhonics = (
  word: string
): string[] => {

  const cleanWord = word
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const phonics: string[] = [];

  const vowelGroups = [
    "ai", "ee", "oo", "ou", "ea", "sh", "ch", "th"
  ];

  let i = 0;

  while (i < cleanWord.length) {

    const pair = cleanWord.slice(i, i + 2);

    if (vowelGroups.includes(pair)) {
      phonics.push(pair);
      i += 2;
    } else {
      phonics.push(cleanWord[i]);
      i += 1;
    }
  }

  return phonics.length > 0
    ? phonics
    : [word];
};

const calculateSpeechAccuracy = (
  spoken: string,
  target: string
) => {

  let matches = 0;

  const spokenChars = spoken.split("");

  spokenChars.forEach((char, index) => {
    if (target[index] === char) {
      matches += 1;
    }
  });

  return Math.min(
    100,
    Math.floor(
      (matches / Math.max(target.length, 1)) * 100
    )
  );
};

export const analyzePronunciation = (
  spokenText: string,
  targetWord: string
): SpeechResult => {

  const normalizedSpoken =
    spokenText.toLowerCase().trim();

  const normalizedTarget =
    targetWord.toLowerCase().trim();

  const phonics = splitIntoPhonics(targetWord);

  const exactMatch =
    normalizedSpoken === normalizedTarget;

  const partialMatch =
    normalizedSpoken.includes(normalizedTarget) ||
    normalizedTarget.includes(normalizedSpoken);

  let confidence = calculateSpeechAccuracy(
    normalizedSpoken,
    normalizedTarget
  );

  if (exactMatch) {
    confidence = 100;
  } else if (partialMatch) {
    confidence = Math.max(confidence, 80);
  }

  const isCorrect = confidence >= 80;

  const practiceRequired = isCorrect
    ? 0
    : Math.max(5, Math.floor((100 - confidence) / 10));

  const difficultyLevel =
    targetWord.length <= 4
      ? "Easy"
      : targetWord.length <= 7
      ? "Medium"
      : "Hard";

  const starsEarned = isCorrect
    ? Math.max(1, Math.floor(confidence / 20))
    : 0;

  return {
    transcript: spokenText,
    isCorrect,
    confidence,
    phonics,
    practiceRequired,
    difficultyLevel,
    starsEarned,
    emotionalFeedback: isCorrect
      ? getEncouragement()
      : emotionalResponses[
          Math.floor(
            Math.random() * emotionalResponses.length
          )
        ],
    nextSuggestion:
      adaptiveSuggestions[
        Math.floor(
          Math.random() * adaptiveSuggestions.length
        )
      ],
    feedback: isCorrect
      ? `✅ Amazing! You pronounced ${targetWord} correctly.`
      : `❌ Let's practice ${targetWord} slowly together.`
  };
};

export const startSpeechRecognition = (
  onResult: (result: SpeechResult) => void,
  targetWord: string,
  onListeningChange?: (listening: boolean) => void
) => {

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech recognition is not supported in this browser."
    );
    return null;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    onListeningChange?.(true);
  };

  recognition.onend = () => {
    onListeningChange?.(false);
  };

  recognition.onerror = () => {
    onListeningChange?.(false);
  };

  recognition.onresult = (event: any) => {

    const spokenText =
      event.results[0][0].transcript;

    const result = analyzePronunciation(
      spokenText,
      targetWord
    );
    console.log("🎤 Speech Analysis:", result);
    onResult(result);
  };

  recognition.start();

  return recognition;
};
