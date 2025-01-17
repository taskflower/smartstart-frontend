import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course } from "@/types/moodle";
import { EDUCATION_ICONS } from "../IconSelector";

interface PaginatedCoursesListProps {
  categories: Category[];
  selectedCategory: string | null;
  coursesInCategory: Record<string, number>;
}

interface CategoryInfo {
  name: string;
  icon: keyof typeof EDUCATION_ICONS | null;
}

const PAGE_SIZE = 20;

const getCategoryInfo = (
  categories: Category[],
  categoryId: string
): CategoryInfo => {
  const findCategory = (
    categories: Category[],
    targetId: string
  ): CategoryInfo | null => {
    for (const category of categories) {
      if (category.id === targetId) {
        return {
          name: category.name,
          icon: category.icon as keyof typeof EDUCATION_ICONS,
        };
      }
      if (category.items) {
        const found = findCategory(category.items, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const result = findCategory(categories, categoryId);
  return result || { name: "Brak kategorii", icon: null };
};

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
  const navigate = useNavigate();

  useEffect(() => {
    const totalCourses = selectedCategory
      ? coursesInCategory[selectedCategory] || 0
      : Object.values(coursesInCategory).reduce((a, b) => a + b, 0);
    setTotalPages(Math.ceil(totalCourses / PAGE_SIZE) || 1);
    setCurrentPage(1);
    setCourses([]);
  }, [selectedCategory, coursesInCategory]);

  const getAllSubcategoryIds = (
    categories: Category[],
    targetId: string
  ): string[] => {
    const result: string[] = [];

    const findCategory = (
      categories: Category[],
      targetId: string
    ): Category | null => {
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

  return (
    <div>
      <div className="grid grid-cols-5 text-sm text-gray-500 border-b pb-2 mb-4 hidden md:grid">
        <span className="col-span-2">Nazwa kursu</span>
        <span>Kategoria</span>
        <span>Uczestnicy</span>
        <span>Ocena</span>
      </div>

      {isLoading && <p className="text-center">Ładowanie kursów...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && courses.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {selectedCategory
              ? "Nie znaleziono żadnych kursów w wybranej kategorii"
              : "Nie znaleziono żadnych kursów"}
          </p>
          <Button onClick={() => navigate("/courses/create")}>
            <Plus className="mr-2 h-4 w-4" /> Dodaj pierwszy kurs
          </Button>
        </div>
      )}

      {!isLoading && courses.length > 0 && (
        <>
          <div className="hidden md:block">
            {courses.map((course) => {
              const categoryInfo = getCategoryInfo(
                categories,
                course.category_id || ""
              );
              const CategoryIcon = categoryInfo.icon
                ? EDUCATION_ICONS[categoryInfo.icon]
                : null;

              return (
                <div
                  key={course.id}
                  className="grid grid-cols-5 items-center py-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <div className="col-span-2">
                    <h2 className="text-base font-medium">{course.name}</h2>
                    <p className="text-sm text-gray-500">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {CategoryIcon && (
                      <CategoryIcon className="w-4 h-4 text-gray-500" />
                    )}
                    <span>{categoryInfo.name}</span>
                  </div>
                  <p>{course.participants || 0} uczestników</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{course.rating || "Brak ocen"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:hidden">
            <div className="flex flex-col gap-5">
              {courses.map((course) => {
                const categoryInfo = getCategoryInfo(
                  categories,
                  course.category_id || ""
                );
                const CategoryIcon = categoryInfo.icon
                  ? EDUCATION_ICONS[categoryInfo.icon]
                  : null;

                return (
                  <div
                    key={course.id}
                    className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <h2 className="text-lg font-semibold">{course.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                      <span>{categoryInfo.name}</span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                      <span>{course.participants || 0} uczestników</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{course.rating || "Brak ocen"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PaginatedCoursesList;
