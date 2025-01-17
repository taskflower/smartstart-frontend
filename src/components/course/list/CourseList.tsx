// src/components/course/list/CourseList.tsx
import { Course } from "@/types/moodle";
import { CourseListProps } from "./types";
import { lazy, Suspense } from 'react';
import { EmptyState } from './EmptyState';
import { Category } from "@/services/categoryService";

const CourseListDesktop = lazy(() => import("./desktop/CourseListDesktop"));
const CourseListMobile = lazy(() => import("./mobile/CourseListMobile"));

export const CourseList: React.FC<CourseListProps & {courses: Course[]}> = ({
  courses,
  categories,
}) => {
  const getCategoryInfo = (categoryId: string) => {
    interface CategoryInfo {
      name: string;
      icon: string | null;
    }

    const findCategory = (categories: Category[], targetId: string): CategoryInfo => {
      for (const category of categories) {
        if (category.id === targetId) {
          return {
            name: category.name,
            icon: category.icon,
          };
        }
        if (category.items) {
          const found = findCategory(category.items, targetId);
          if (found) return found;
        }
      }
      return { name: "Brak kategorii", icon: null };
    };

    return findCategory(categories, categoryId);
  };

  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <Suspense fallback={<div className="hidden md:block">Ładowanie widoku...</div>}>
        <CourseListDesktop courses={courses} getCategoryInfo={getCategoryInfo} />
      </Suspense>
      <Suspense fallback={<div className="md:hidden">Ładowanie widoku...</div>}>
        <CourseListMobile courses={courses} getCategoryInfo={getCategoryInfo} />
      </Suspense>
    </>
  );
};