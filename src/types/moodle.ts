// Podstawowe typy aktywności i zasobów
export type ActivityType = 'quiz' | 'assignment' | 'forum';
export type ResourceType = 'file' | 'url' | 'page';
export type SectionType = 'weekly' | 'topic';

// Interfejsy dla głównych encji
export interface Course {
  id: string;
  name: string;
  description: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Section {
  id: string;
  course_id: string;
  name: string;
  type: SectionType;
  summary?: string;
  sequence: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: string;
  section_id: string;
  type: ActivityType;
  name: string;
  description?: string;
  sequence: number;
  visible: boolean;
  settings: QuizSettings | AssignmentSettings | ForumSettings;
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  section_id: string;
  type: ResourceType;
  name: string;
  description?: string;
  content: string; // URL dla typu 'url', treść dla typu 'page', link do storage dla typu 'file'
  sequence: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}

// Ustawienia specyficzne dla różnych typów aktywności
export interface QuizSettings {
  time_limit?: number; // w minutach
  attempts_allowed: number;
  passing_grade: number;
  shuffle_questions: boolean;
  show_correct_answers: boolean;
}

export interface AssignmentSettings {
  due_date?: Date;
  max_points: number;
  submission_type: 'text' | 'file' | 'both';
  allow_late_submissions: boolean;
}

export interface ForumSettings {
  type: 'standard' | 'single' | 'qanda';
  grade_category?: string;
  max_attachments: number;
}

// Pytania i odpowiedzi (dla quizów)
export interface Question {
  id: string;
  activity_id: string; // Powiązane z quiz
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  default_grade: number;
  created_at: Date;
  updated_at: Date;
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  fraction: number; // procent poprawności (0-100)
  feedback?: string;
  created_at: Date;
  updated_at: Date;
}