export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface Material {
  id: number;
  student_key: string;
  title: string;
  original_filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string | null;
  chunks_count?: number;
  topics_count?: number;
  quizzes_count?: number;
  topics?: Topic[];
  created_at: string;
  updated_at: string;
}

export interface MaterialChunk {
  id: number;
  material_id: number;
  chunk_index: number;
  content: string;
  page_number: number | null;
}

export interface Topic {
  id: number;
  material_id: number;
  name: string;
  description: string | null;
  order: number;
}

export interface TutorSource {
  material_id: number;
  page: number;
  excerpt?: string;
}

export interface TutorResponse {
  answer: string;
  sources: TutorSource[];
}

export interface Question {
  id: number;
  quiz_id: number;
  topic_id?: number | null;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: string;
  explanation?: string | null;
}

export interface Quiz {
  id: number;
  material_id: number;
  topic_id?: number | null;
  title: string;
  total_questions: number;
  questions: Question[];
  material?: Material;
  topic?: Topic;
}

export interface EvaluatedAnswer {
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
  correct_answer: string;
  explanation?: string | null;
  topic_name?: string;
}

export interface QuizSubmitResult {
  attempt_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  diagnostic: {
    strengths: string[];
    weaknesses: string[];
    analysis: string;
  };
  recommendation?: Recommendation | null;
  answers: EvaluatedAnswer[];
}

export interface TopicProgress {
  id: number;
  topic_id: number;
  name: string;
  description: string;
  mastery: number;
  status: 'Dikuasai' | 'Cukup' | 'Perlu Latihan' | 'Belum Dipelajari';
  attempt_count: number;
  correct_count: number;
  last_attempt_at: string | null;
}

export interface KnowledgeProfile {
  student_key: string;
  overall_mastery: number;
  topics_count: number;
  mastered_topics_count: number;
  topics: TopicProgress[];
}

export interface Recommendation {
  id: number;
  topic_id: number;
  topic_name: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'dismissed';
  created_at: string;
}

export interface DashboardData {
  student_key: string;
  stats: {
    total_materials: number;
    total_topics: number;
    overall_mastery: number;
    latest_score: number | null;
    average_score: number;
    total_quiz_attempts: number;
  };
  recent_materials: Material[];
  topic_progress: {
    topic_id: number;
    name: string;
    mastery: number;
  }[];
  recent_quizzes: {
    id: number;
    quiz_id: number;
    title: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    completed_at: string | null;
  }[];
  recommendation?: {
    id: number;
    topic_id: number;
    topic_name: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  } | null;
}
