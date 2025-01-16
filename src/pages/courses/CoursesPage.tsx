// src/pages/courses/CoursesPage.tsx
import  { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

import AuthLayout from "@/components/AuthLayout";
import { db } from "@/services/firebase";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

import { Category, fetchAllCategories } from "@/services/categoryService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryFilter from "@/components/course/CategoryFilter";
import PaginatedCoursesList from "@/components/course/PaginatedCoursesList";


interface Course {
  id: string;
  name: string;
  description: string;
  category_id: string;
  categoryName?: string;
  participants?: number;
  rating?: number;
}

const CoursesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Przechowywanie liczby kursów w każdej kategorii
  const [coursesInCategory, setCoursesInCategory] = useState<Record<string, number>>({});

  // Funkcja do pobierania nazwy kategorii
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

  // Funkcja do obliczania liczby kursów w każdej kategorii
  const countCourses = (categories: Category[], coursesData: Course[]) => {
    const counts: Record<string, number> = {};

    const countRecursive = (category: Category) => {
      let count = coursesData.filter(course => course.category_id === category.id).length;
      if (category.items) {
        category.items.forEach(subcat => {
          count += countRecursive(subcat);
        });
      }
      counts[category.id] = count;
      return count;
    };

    categories.forEach(cat => countRecursive(cat));
    return counts;
  };

  // Parsowanie query string i ustawianie wybranej kategorii
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");
    setSelectedCategory(categoryId ? categoryId : null);
  }, [location.search]);

  // Aktualizacja query string, gdy wybrana kategoria się zmienia
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Pobieranie danych kategorii i kursów
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [treeCategories, coursesSnapshot] = await Promise.all([
          fetchAllCategories(),
          getDocs(collection(db, "courses")),
        ]);

        const coursesData = coursesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            categoryName: data.category_id ? getCategoryName(treeCategories, data.category_id) : "Brak kategorii",
          };
        }) as Course[];

        const courseCounts = countCourses(treeCategories, coursesData);

        setCategories(treeCategories);
        setCoursesInCategory(courseCounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <AuthLayout>
        <PageHeader to="courses" title="Kursy" btn="Dodaj kurs" />
        <PageLoader title="Ładowanie kursów..." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <PageHeader to="courses" title="Kursy" btn="Dodaj kurs" />

      {/* Główny kontener */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabela kursów */}
        <div className="min-w-0 flex-1">
          {/* Przycisk mobilnego filtra */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full"
            >
              Filtruj według kategorii
            </Button>
          </div>

          {/* Komponent PaginatedCoursesList */}
          <PaginatedCoursesList
            categories={categories}
            selectedCategory={selectedCategory}
            coursesInCategory={coursesInCategory}
          />
        </div>

        {/* Filtr kategorii na desktopie */}
        <div className="hidden md:block w-80">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            coursesInCategory={coursesInCategory}
          />
        </div>
      </div>

      {/* Mobilny filtr kategorii */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtruj według kategorii</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(categoryId) => { 
                setSelectedCategory(categoryId);
                setIsMobileFilterOpen(false);
              }}
              coursesInCategory={coursesInCategory}
            />
          </div>
        </SheetContent>
      </Sheet>
    </AuthLayout>
  );
};

export default CoursesPage;
