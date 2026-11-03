export class OfflineError extends Error {
  constructor(message: string = "No internet connection / Backend server disconnected") {
    super(message);
    this.name = "OfflineError";
  }
}

export interface PredictionPayload {
  [key: string]: string | number;
  age: number;
  gender: string;
  ethnicity: string;
  jaundice: string;
  austim: string;
  contry_of_res: string;
  used_app_before: string;
  result: number;
  relation: string;
}

export interface PredictionResponse {
  status: string;
  prediction: "ASD Positive" | "ASD Negative";
  probability: number;
  raw_score: number;
  threshold: number;
  demographics: {
    age: number;
    gender: string;
    relation: string;
  };
  evaluation: {
    clinical_indication: string;
    confidence_interval: string;
    assessed_at: string;
  };
}

export interface AttentionAnalysis {
  attention_score: number;
  engagement: string;
  emotion: string;
  gaze_direction: string;
  blink_count: number;
  focus_duration: number;
  hyperactivity_score: number;
  face_detected?: boolean;
  tracking_available?: boolean;
  eyes_detected?: number;
  confidence?: number;
  gaze_stability?: number;
  therapy_recommendations?: {
    status: string;
    suggestion: string;
    sensory_pacing?: string;
    next_target?: string;
  };
}

export interface AttentionResponse {
  status: string;
  system: string;
  version: string;
  camera_active: boolean;
  backend_connected: boolean;
  analysis: AttentionAnalysis;
  analytics: {
    attention_score: number;
    engagement: string;
    emotion: string;
    gaze_direction: string;
    blink_count: number;
    focus_duration: number;
    hyperactivity_score: number;
  };
}

export interface TherapyAnalysisResponse {
  status: string;
  realtime_ai: boolean;
  backend_connected: boolean;
  analysis: {
    progress_score: number;
    therapy_intensity: string;
    detected_issues: string[];
    emotional_state: string;
    strengths: string[];
    growth_areas: string[];
    badges: Array<{ title: string; icon: string; description: string }>;
    therapy_sessions_completed: number;
    focus_trend: string;
  };
}

export interface ChatResponse {
  status: string;
  backend_connected: boolean;
  reply: string;
  child_name: string;
  timestamp: string;
}

export interface LessonResponse {
  status: string;
  ai_companion: boolean;
  backend_connected: boolean;
  lesson_data: {
    lesson: {
      word: string;
      title: string;
      phonics: string;
      text: string;
      fun_fact: string;
    };
    confidence_level: number;
    interests: string[];
  };
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationEmoji: string;
  sceneTheme: string;
  focusWord: string;
}

export interface StoryBook {
  title: string;
  hero: string;
  topic: string;
  pages: StoryPage[];
}

export interface StoryResponse {
  status: string;
  backend_connected: boolean;
  story_data: StoryBook;
}

/**
 * Universal safe fetch with offline detection
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!navigator.onLine) {
    throw new OfflineError("No internet connection. Please reconnect to network.");
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      let parsedError = "";
      try {
        const json = JSON.parse(errorText);
        parsedError = json.error || json.message;
      } catch {
        parsedError = errorText;
      }
      throw new Error(parsedError || `Server error (${res.status})`);
    }

    return (await res.json()) as T;
  } catch (error: unknown) {
    if (error instanceof OfflineError) {
      throw error;
    }
    const err = error as { message?: string };
    if (err?.message?.includes("Failed to fetch") || err?.message?.includes("NetworkError")) {
      throw new OfflineError("No internet connection / Backend server disconnected");
    }
    throw error;
  }
}

export const api = {
  // Check health and connectivity
  async checkHealth(): Promise<{ status: string; backend_connected: boolean }> {
    return apiFetch<{ status: string; backend_connected: boolean }>("/api/health");
  },

  // ASD Machine Learning Screening evaluation
  async predictASD(payload: PredictionPayload): Promise<PredictionResponse> {
    return apiFetch<PredictionResponse>("/api/predict", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Real-time attention and gaze telemetry
  async getAttention(frame?: string): Promise<AttentionResponse> {
    if (!frame) return apiFetch<AttentionResponse>("/api/attention");
    return apiFetch<AttentionResponse>("/api/attention", {
      method: "POST",
      body: JSON.stringify({ frame }),
    });
  },

  // Personalized therapy recommendations
  async analyzeTherapy(data: Record<string, unknown>): Promise<TherapyAnalysisResponse> {
    return apiFetch<TherapyAnalysisResponse>("/api/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Live conversational AI companion
  async sendChatMessage(message: string, childName: string = "Friend"): Promise<ChatResponse> {
    return apiFetch<ChatResponse>("/api/live-chat", {
      method: "POST",
      body: JSON.stringify({ message, child_name: childName }),
    });
  },

  // Adaptive interactive lesson
  async generateLesson(childName: string = "Friend", confidence: number = 50, interests: string[] = ["animals"]): Promise<LessonResponse> {
    return apiFetch<LessonResponse>("/api/generate-lesson", {
      method: "POST",
      body: JSON.stringify({ child_name: childName, confidence, interests }),
    });
  },

  // Groq-powered magic story generation
  async generateStory(heroName: string = "Story Hero", prompt: string = "A gentle story about curiosity and kindness."): Promise<StoryResponse> {
    return apiFetch<StoryResponse>("/api/generate-story", {
      method: "POST",
      body: JSON.stringify({ hero_name: heroName, prompt }),
    });
  },
};
