// src/components/course/PaginatedCoursesList.tsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Course } from "@/types/moodle";
import { Category } from "@/services/categoryService";
import { CourseList } from "./list";
import Pagination from "../Pagination";
import PageLoader from "@/components/PageLoader";


interface PaginatedCoursesListProps {
  categories: Category[];
  selectedCategory: string | null;
  coursesInCategory: Record<string, number>;
}

const PAGE_SIZE = 20;

const PaginatedCoursesList: React.FC<PaginatedCoursesListProps> = ({
  categories,
  selectedCategory,
  coursesInCategory,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const totalCourses = selectedCategory
      ? coursesInCategory[selectedCategory] || 0
      : Object.values(coursesInCategory).reduce((a, b) => a + b, 0);
    setTotalPages(Math.ceil(totalCourses / PAGE_SIZE) || 1);
    setCurrentPage(1);
    setCourses([]);
  }, [selectedCategory, coursesInCategory]);

  const getAllSubcategoryIds = (categories: Category[], targetId: string): string[] => {
    const result: string[] = [];

    const findCategory = (categories: Category[], targetId: string): Category | null => {
      for (const category of categories) {
        if (category.id === targetId) return category;
        if (category.items) {
          const found = findCategory(category.items, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategory(categories, targetId);
    if (category?.items) {
      const addSubcategoryIds = (subcategories: Category[]): void => {
        for (const subcat of subcategories) {
          result.push(subcat.id);
          if (subcat.items) {
            addSubcategoryIds(subcat.items);
          }
        }
      };
      addSubcategoryIds(category.items);
    }

    return result;
  };

  const fetchCourses = async (page: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedCategory) {
        const categoryIds = getAllSubcategoryIds(categories, selectedCategory);
        const q = query(
          collection(db, "courses"),
          where("category_id", "in", [selectedCategory, ...categoryIds])
        );

        const snapshot = await getDocs(q);
        const fetchedCourses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        fetchedCourses.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        const startIndex = (page - 1) * PAGE_SIZE;
        const paginatedCourses = fetchedCourses.slice(
          startIndex,
          startIndex + PAGE_SIZE
        );

        setCourses(paginatedCourses);
        setTotalPages(Math.ceil(fetchedCourses.length / PAGE_SIZE));
      } else {
        const q = query(
          collection(db, "courses"),
          orderBy("created_at", "desc"),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(q);
        const fetchedCourses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        setCourses(fetchedCourses);
      }
    } catch (error) {
      console.error("Error fetching paginated courses:", error);
      setError(
        "Wystąpił problem z pobieraniem kursów. Spróbuj ponownie później."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses(currentPage);
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <PageLoader title="Ładowanie kursów..." />;
  }

  return (
    <div>
      <CourseList 
        courses={courses}
        categories={categories}
        selectedCategory={selectedCategory}
        coursesInCategory={coursesInCategory} isLoading={false}      />
      {error && <p className="text-center text-red-500">{error}</p>}
      {!error && courses.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PaginatedCoursesList;