/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/courses/PaginatedCoursesList.tsx
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course } from "@/types/moodle";

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
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obliczanie całkowitej liczby stron
  useEffect(() => {
    const totalCourses = selectedCategory
      ? coursesInCategory[selectedCategory] || 0
      : Object.values(coursesInCategory).reduce((a, b) => a + b, 0);
    setTotalPages(Math.ceil(totalCourses / PAGE_SIZE) || 1);
    setCurrentPage(1);
    setCourses([]);
    setLastVisible(null);
  }, [selectedCategory, coursesInCategory]);

  // Funkcja dzieląca tablicę na mniejsze części
  const chunkArray = (array: string[], size: number): string[][] => {
    const result: string[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Funkcja pobierająca kursy
// W komponencie PaginatedCoursesList.tsx

// W komponencie PaginatedCoursesList.tsx

const fetchCourses = async (page: number) => {
  setIsLoading(true);
  setError(null);
  try {
    let q;
    
    if (selectedCategory) {
      // Pobierz ID wszystkich podkategorii
      const categoryIds = getAllSubcategoryIds(categories, selectedCategory);
      
      // Podstawowe zapytanie
      q = query(
        collection(db, "courses"),
        where("category_id", "in", [selectedCategory, ...categoryIds])
      );
      
      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      // Sortowanie w pamięci
      courses.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      // Paginacja w pamięci
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedCourses = courses.slice(startIndex, startIndex + PAGE_SIZE);

      setCourses(paginatedCourses);
      setTotalPages(Math.ceil(courses.length / PAGE_SIZE));
    } else {
      // Dla wszystkich kursów
      q = query(
        collection(db, "courses"),
        orderBy("created_at", "desc"),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      setCourses(courses);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    setError("Wystąpił problem z pobieraniem kursów. Spróbuj ponownie później.");
  } finally {
    setIsLoading(false);
  }
};

 // Pomocnicza funkcja do pobierania ID wszystkich podkategorii
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
    const addSubcategoryIds = (subcategories: Category[]) => {
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

  // Ładowanie kursów przy zmianie strony lub kategorii
  useEffect(() => {
    fetchCourses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Lista kursów */}
      <div className="grid grid-cols-5 text-sm text-gray-500 border-b pb-2 mb-4 hidden md:block">
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
          {/* Desktop View */}
          <div className="hidden md:block">
            {courses.map(course => (
              <div
                key={course.id}
                className="grid grid-cols-5 items-center py-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="col-span-2">
                  <h2 className="text-base font-medium">{course.name}</h2>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
                <p>{getCategoryName(categories, course.category_id)}</p>
                <p>{course.participants || 0} uczestników</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{course.rating || "Brak ocen"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex flex-col gap-5">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <h2 className="text-lg font-semibold">{course.name}</h2>
                  <p className="text-sm text-gray-500">{getCategoryName(categories, course.category_id)}</p>
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
              ))}
            </div>
          </div>

          {/* Komponent Pagination */}
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

// Pomocnicza funkcja do pobierania nazwy kategorii
const getCategoryName = (categories: Category[], categoryId: string): string => {
  const findCategory = (categories: Category[], targetId: string): string | null => {
    for (const category of categories) {
      if (category.id === targetId) return category.name;
      if (category.items) {
        const found = findCategory(category.items, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  return findCategory(categories, categoryId) || "Brak kategorii";
};

export default PaginatedCoursesList;
