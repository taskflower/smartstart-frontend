/* eslint-disable @typescript-eslint/no-explicit-any */
// Base types
export interface Course {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Section {
  id: string;
  course_id: string;
  name: string;
  sequence: number;
  type: "standard";
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: string;
  section_id: string;
  type: "quiz" | "assignment" | "forum";
  name: string;
  description: string;
  sequence: number;
  visible: boolean;
  settings: any; // TODO: Define specific settings types
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  section_id: string;
  type: "file" | "url" | "page";
  name: string;
  content: string;
  sequence: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}

// Page state types
export interface CoursePageState {
  course: Course | null;
  sections: Section[];
  activities: Activity[];
  resources: Resource[];
  loading: boolean;
  error: string | null;
  selectedSectionId: string | null;
  isAddContentOpen: boolean;
}

// Form data types
export interface AddSectionData {
  name: string;
}

export interface AddActivityData {
  type: Activity["type"];
  name: string;
  description: string;
}

export interface AddResourceData {
  type: Resource["type"];
  name: string;
  content: string;
}

// Utility types
export type VisibilityToggleType = "section" | "activity" | "resource";

// Component props types
export interface ContentItemBaseProps {
  name: string;
  visible: boolean;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
}

export interface SectionHeaderProps {
  name: string;
  visible: boolean;
  onToggleVisibility: () => void;
  onAddContent: () => void;
}

export interface SectionContentProps {
  children: React.ReactNode;
}

export interface SectionCardProps extends Section {
  onToggleVisibility: () => void;
  onAddContent: () => void;
  children: React.ReactNode;
}

// Dialog props types
export interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export interface ResourceDialogProps {
  open: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export interface Question {
  id: string;
  course_id: string;
  section_id: string;
  activity_id?: string;
  type: "multiple_choice";
  question_type: "multiple_choice";
  question_text: string;
  default_grade: number;
  created_at: Date;
  updated_at: Date;
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  fraction: number;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateQuestionData = Omit<Question, 'id' | 'created_at' | 'updated_at'>;
export type CreateAnswerData = Omit<Answer, 'id' | 'question_id' | 'created_at' | 'updated_at'>;