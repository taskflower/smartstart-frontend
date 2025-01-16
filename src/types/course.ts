import type { Course, Section, Activity, Resource } from "@/types/moodle";

export type CoursePageState = {
  course: Course | null;
  sections: Section[];
  activities: Activity[];
  resources: Resource[];
  loading: boolean;
  error: string | null;
  selectedSectionId: string | null;
  isAddContentOpen: boolean;
};

export type AddSectionData = {
  name: string;
};

export type AddActivityData = {
  type: Activity["type"];
  name: string;
  description: string;
};

export type AddResourceData = {
  type: Resource["type"];
  name: string;
  content: string;
};

export type VisibilityToggleType = "section" | "activity" | "resource";

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
