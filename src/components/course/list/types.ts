// src/components/course/list/types.ts
import { Category } from "@/services/categoryService";
import { Course } from "@/types/moodle";

export interface CourseListProps {
  categories: Category[];
  selectedCategory: string | null;
  coursesInCategory: Record<string, number>;
  isLoading: boolean;
}

export interface CourseItemProps {
  course: Course;
  categoryInfo: {
    name: string;
    icon: string | null;
  };
}
