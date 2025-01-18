// src/components/course/PaginatedCoursesList.tsx
import { useState, useEffect } from "react";
import { Course } from "@/types/moodle";
import { Category } from "@/services/categoryService";
import { CourseList } from "./list";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import { PAGE_SIZE } from "@/constants/pagination";
import { fetchPaginatedCourses } from "@/services/course/courseQueries";

interface PaginatedCoursesListProps {
  categories: Category[];
  selectedCategory: string | null;
  coursesInCategory: Record<string, number>;
}

interface PaginatedCoursesListState {
  courses: Course[];
  lastCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const PaginatedCoursesList = ({
  categories,
  selectedCategory,
  coursesInCategory,
}: PaginatedCoursesListProps) => {
  const [state, setState] = useState<PaginatedCoursesListState>({
    courses: [],
    lastCursor: null,
    hasMore: true,
    isLoading: false,
    error: null
  });

  const fetchCourses = async (isLoadingMore: boolean = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await fetchPaginatedCourses(
        PAGE_SIZE, 
        isLoadingMore ? state.lastCursor : undefined,
        selectedCategory,
        categories
      );

      setState(prev => ({
        courses: isLoadingMore ? [...prev.courses, ...result.items] : result.items,
        lastCursor: result.lastCursor,
        hasMore: result.hasMore,
        isLoading: false,
        error: null
      }));
    } catch  {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Wystąpił problem z pobieraniem kursów. Spróbuj ponownie później."
      }));
    }
  };

  useEffect(() => {
    setState({
      courses: [],
      lastCursor: null,
      hasMore: true,
      isLoading: false,
      error: null
    });
    void fetchCourses();
  }, [selectedCategory]);

  if (state.isLoading && !state.courses.length) {
    return <PageLoader title="Ładowanie kursów..." />;
  }

  return (
    <div>
      <CourseList 
        courses={state.courses}
        categories={categories}
        selectedCategory={selectedCategory}
        coursesInCategory={coursesInCategory}
        isLoading={false}
      />
      {state.error && (
        <p className="text-center text-red-500">{state.error}</p>
      )}
      {state.hasMore && !state.error && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => fetchCourses(true)}
            disabled={state.isLoading}
          >
            {state.isLoading ? "Ładowanie..." : "Załaduj więcej"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginatedCoursesList;