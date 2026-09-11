import {
  ApiResponse,
  DashboardData,
  KnowledgeProfile,
  Material,
  Quiz,
  QuizSubmitResult,
  Recommendation,
  Topic,
  TutorResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
export const DEFAULT_STUDENT_KEY = 'demo-student';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (!headers.has('X-Student-Key')) {
    headers.set('X-Student-Key', DEFAULT_STUDENT_KEY);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn(`API Error [${endpoint}]:`, error.message);
    }
    throw error;
  }
}

// 1. Dashboard
export async function getDashboard(studentKey: string = DEFAULT_STUDENT_KEY): Promise<DashboardData> {
  return request<DashboardData>(`/dashboard?student_key=${encodeURIComponent(studentKey)}`);
}

// 2. Materials
export async function getMaterials(studentKey: string = DEFAULT_STUDENT_KEY): Promise<Material[]> {
  return request<Material[]>(`/materials?student_key=${encodeURIComponent(studentKey)}`);
}

export async function getMaterial(id: number): Promise<Material> {
  return request<Material>(`/materials/${id}`);
}

export async function uploadMaterial(
  file: File,
  title: string,
  studentKey: string = DEFAULT_STUDENT_KEY
): Promise<Material> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('student_key', studentKey);

  const url = `${API_BASE_URL}/materials`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Student-Key': studentKey,
    },
    body: formData,
  });

  const data: ApiResponse<Material> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengunggah materi.');
  }

  return data.data;
}

export async function processMaterial(id: number): Promise<Material> {
  return request<Material>(`/materials/${id}/process`, {
    method: 'POST',
  });
}

export async function getMaterialStatus(id: number): Promise<{ id: number; status: string; chunks_count: number; topics_count: number }> {
  return request<{ id: number; status: string; chunks_count: number; topics_count: number }>(`/materials/${id}/status`);
}

export async function getMaterialTopics(id: number): Promise<Topic[]> {
  return request<Topic[]>(`/materials/${id}/topics`);
}

// 3. AI Tutor
export async function askTutor(
  question: string,
  materialId?: number,
  studentKey: string = DEFAULT_STUDENT_KEY
): Promise<TutorResponse> {
  return request<TutorResponse>('/tutor/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_key: studentKey,
      material_id: materialId || null,
      question,
    }),
  });
}

// 4. Quizzes
export async function generateQuiz(
  materialId: number,
  topicId?: number,
  numberOfQuestions: number = 5,
  studentKey: string = DEFAULT_STUDENT_KEY
): Promise<Quiz> {
  return request<Quiz>('/quizzes/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_key: studentKey,
      material_id: materialId,
      topic_id: topicId || null,
      number_of_questions: numberOfQuestions,
    }),
  });
}

export async function getQuiz(id: number): Promise<Quiz> {
  return request<Quiz>(`/quizzes/${id}`);
}

export async function submitQuiz(
  quizId: number,
  answers: { question_id: number; selected_answer: string }[],
  studentKey: string = DEFAULT_STUDENT_KEY
): Promise<QuizSubmitResult> {
  return request<QuizSubmitResult>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_key: studentKey,
      answers,
    }),
  });
}

// 5. Knowledge Profile
export async function getKnowledgeProfile(studentKey: string = DEFAULT_STUDENT_KEY): Promise<KnowledgeProfile> {
  return request<KnowledgeProfile>(`/progress?student_key=${encodeURIComponent(studentKey)}`);
}

// 6. Recommendations
export async function getRecommendations(studentKey: string = DEFAULT_STUDENT_KEY): Promise<Recommendation[]> {
  return request<Recommendation[]>(`/recommendations?student_key=${encodeURIComponent(studentKey)}`);
}
