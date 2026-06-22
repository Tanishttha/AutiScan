import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarAssistant from "@/components/ui/AvatarAssistant";
import VoiceWave from "@/components/ui/VoiceWave";

import {
  speakSlowly,
  analyzePronunciation,
  splitIntoPhonics
} from "@/services/speechService";

interface AIMessage {
  role: string;
  text: string;
}

const practiceWords = [
  "Apple",
  "Ball",
  "Cat",
  "Dog",
  "Elephant",
  "Friend",
  "Happy",
  "School",
  "Rainbow",
  "Butterfly"
];

const encouragements = [
  "🌟 Amazing effort!",
  "🎉 Great speaking!",
  "😊 You are improving!",
  "🚀 Fantastic pronunciation!",
  "👏 Keep practicing slowly!"
];

const storyModes = [
  {
    emoji: "🌴",
    title: "Magic Jungle Adventure",
    text: "Help the friendly lion say Apple 🍎"
  },
  {
    emoji: "🚀",
    title: "Rainbow Rocket Mission",
    text: "Practice speaking with the space robot 🤖"
  },
  {
    emoji: "🏫",
    title: "Happy School Day",
    text: "Say hello to your classmates 😊"
  }
];

const rewards = [
  "⭐ Superstar Speaker",
  "🏆 Pronunciation Hero",
  "🌈 Rainbow Voice",
  "🚀 Speech Champion"
];

export default function AICompanion() {

  const navigate = useNavigate();

  const recognitionRef = useRef<any>(null);

  const [conversationMode, setConversationMode] =
    useState(true);

  const [currentWord, setCurrentWord] =
    useState("Apple");

  const [transcript, setTranscript] =
    useState("");

  const [feedback, setFeedback] =
    useState(
      "Press Start and speak slowly."
    );

  const [isListening, setIsListening] =
    useState(false);

  const [score, setScore] = useState(0);

  const [level, setLevel] = useState(1);

  const [stars, setStars] = useState(0);

  const [avatarMood, setAvatarMood] =
    useState("😊");

  const [waveActive, setWaveActive] =
    useState(false);

  const [practiceProgress, setPracticeProgress] =
    useState(0);

  const [targetPractice, setTargetPractice] =
    useState(5);

  const [showConfetti, setShowConfetti] =
    useState(false);

  const [storyMode, setStoryMode] =
    useState(storyModes[0]);

  const [rewardPopup, setRewardPopup] =
    useState("");

  const [aiMessages, setAiMessages] =
    useState<AIMessage[]>([]);

  const [lessonImage, setLessonImage] =
    useState("");

  const [lessonTopic, setLessonTopic] =
    useState("");

  const [lessonSentence, setLessonSentence] =
    useState("");

  const [loadingLesson, setLoadingLesson] =
    useState(false);

  const phonics = splitIntoPhonics(currentWord);

  const speakText = (text: string) => {
    speakSlowly(text, 0.75);
  };

  const generateAILesson = async () => {

    try {

      setLoadingLesson(true);

      const response = await fetch(
        "https://botanical-sneak-jumble.ngrok-free.dev/generate-lesson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            child_name: "Friend",
            confidence: score
          })
        }
      );

      const data = await response.json();

      console.log("AI DATA:", data);

      const lesson =
        data?.lesson;

      if (lesson) {

        setCurrentWord(
          lesson.word || "Apple"
        );

        setLessonTopic(
          lesson.title || "Learning"
        );

        setLessonSentence(
          lesson.text || ""
        );

        setRewardPopup(
          lesson.reward || "🌟 Great Job"
        );

        setFeedback(
          lesson.text ||
            "Let's learn together"
        );

        setStoryMode({
          emoji: "🌈",
          title: lesson.title || "AI Lesson",
          text:
            lesson.text ||
            "Let's practice together"
        });

        setLessonImage(
          `https://placehold.co/600x400/png?text=${encodeURIComponent(
            lesson.word
          )}`
        );

        speakText(
          lesson.text ||
            `Can you say ${lesson.word}`
        );
      }

    } catch (error) {

      console.error(error);

      setFeedback(
        "⚠ AI lesson loading failed."
      );

    } finally {

      setLoadingLesson(false);
    }
  };

  const nextWord = () => {

    const randomWord =
      practiceWords[
        Math.floor(
          Math.random() *
            practiceWords.length
        )
      ];

    setCurrentWord(randomWord);

    setPracticeProgress(0);

    setStoryMode(
      storyModes[
        Math.floor(
          Math.random() *
            storyModes.length
        )
      ]
    );

    speakText(
      `Can you say ${randomWord}`
    );
  };

  const startListening = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {

      setFeedback(
        "Speech recognition not supported."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {

      setIsListening(true);

      setWaveActive(true);

      setAvatarMood("🎤");
    };

    recognition.onend = () => {

      setIsListening(false);

      setWaveActive(false);

      setAvatarMood("😊");

      if (conversationMode) {

        setTimeout(() => {

          startListening();

        }, 2500);
      }
    };

    recognition.onerror = () => {

      setFeedback(
        "⚠ Please try speaking again slowly."
      );

      setAvatarMood("😅");
    };

    recognition.onresult = async (
      event: any
    ) => {

      const spokenText =
        event.results[0][0].transcript;

      setTranscript(spokenText);

      setAiMessages((prev) => [
        ...prev,
        {
          role: "child",
          text: spokenText
        }
      ]);

      try {

        const aiResponse = await fetch(
          "https://botanical-sneak-jumble.ngrok-free.dev/live-chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: spokenText,
              child_name: "Friend"
            })
          }
        );

        const aiData =
          await aiResponse.json();

        const aiReply =
          aiData?.reply ||
          "😊 I am listening carefully.";

        setAiMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: aiReply
          }
        ]);

        setFeedback(aiReply);

        speakText(aiReply);

      } catch (error) {

        console.error(error);

        const fallbackReply =
          "⚠ AI chat connection failed.";

        setFeedback(fallbackReply);

        speakText(fallbackReply);
      }

      const result =
        analyzePronunciation(
          spokenText,
          currentWord
        );

      if (result.isCorrect) {

        const updatedProgress =
          practiceProgress + 1;

        setPracticeProgress(
          updatedProgress
        );

        setAvatarMood("🤩");

        setStars(
          (prev) =>
            prev + result.starsEarned
        );

        setScore(
          (prev) => prev + 10
        );

        setRewardPopup(
          rewards[
            Math.floor(
              Math.random() *
                rewards.length
            )
          ]
        );

        setShowConfetti(true);

        setTimeout(() => {

          setShowConfetti(false);

        }, 2500);

        if (
          updatedProgress >=
          targetPractice
        ) {

          setLevel(
            (prev) => prev + 1
          );

          setAvatarMood("🥳");

          setTimeout(() => {

            nextWord();

          }, 2500);
        }

      } else {

        setTargetPractice(
          result.practiceRequired || 5
        );
      }
    };

    recognition.start();
  };

  useEffect(() => {

    speakText(
      "Hello friend. Lets practice speaking together."
    );

    generateAILesson();

  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fde7ff,#dbeafe,#fef9c3)] p-3 sm:p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-10">

          <div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
              🤖 AI Friend Companion
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-700 mt-3">
              Interactive voice companion for speech practice.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 rounded-[30px] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-black text-sm sm:text-base"
          >
            ← Back
          </button>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">

          <div>

            <AvatarAssistant
              mood={avatarMood}
              message={feedback}
              listening={isListening}
            />

          </div>

          <div className="xl:col-span-2 rounded-[25px] md:rounded-[40px] bg-white p-4 sm:p-6 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.12)] overflow-hidden">

            <div className="mb-8">



            </div>

            <div className="rounded-[25px] md:rounded-[35px] bg-white border-[3px] md:border-[4px] border-cyan-100 p-4 sm:p-6 md:p-8">

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-6">

                <button
                  onClick={() => {

                    setConversationMode(
                      true
                    );

                    startListening();
                  }}
                  className={`w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-5 rounded-[30px] text-white font-black text-base sm:text-xl ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600"
                  }`}
                >
                  {isListening
                    ? "🎙 Listening..."
                    : "🎤 Start Speaking"}
                </button>

                <button
                  onClick={() => {

                    setConversationMode(
                      false
                    );

                    recognitionRef.current?.stop();
                  }}
                  className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-5 rounded-[30px] bg-gradient-to-r from-gray-500 to-gray-700 text-white font-black text-base sm:text-xl"
                >
                  ⏹ Stop Talking
                </button>

              </div>

              <VoiceWave active={waveActive} />

              <div className="rounded-[25px] md:rounded-[35px] bg-gradient-to-r from-cyan-50 to-blue-50 p-4 sm:p-6 text-center mb-5">

                <div className="text-lg font-black text-cyan-700 mb-2">
                  📝 You Said
                </div>

                <div className="text-lg sm:text-xl md:text-2xl font-black text-gray-700 break-words">
                  {transcript ||
                    "Waiting for speech..."}
                </div>

              </div>

              <div className="space-y-4 mt-6">

                {aiMessages.map(
                  (msg, index) => (

                    <div
                      key={index}
                      className={`max-w-full sm:max-w-[85%] rounded-[20px] sm:rounded-[30px] text-white px-4 sm:px-6 py-4 sm:py-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] break-words ${
                        msg.role === "child"
                          ? "ml-auto rounded-br-[10px] bg-gradient-to-r from-pink-500 to-rose-500"
                          : "rounded-bl-[10px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                      }`}
                    >

                      <div className="text-sm font-black opacity-80 mb-2">

                        {msg.role ===
                        "child"
                          ? "🧒 Friend"
                          : "🤖 AI Teacher"}

                      </div>

                      <div className="text-sm sm:text-base md:text-lg font-bold leading-relaxed">
                        {msg.text}
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}