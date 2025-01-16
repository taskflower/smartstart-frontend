import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { db } from "@/services/firebase";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Pobierz kursy
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        // Pobierz kategorie
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categories = new Map(
          categoriesSnapshot.docs.map((doc) => [
            doc.id,
            doc.data().name as string,
          ])
        );

        // Połącz dane kursów z nazwami kategorii
        const coursesWithCategories = coursesData.map((course) => ({
          ...course,
          categoryName: categories.get(course.category_id) || "Brak kategorii",
        }));

        setCourses(coursesWithCategories);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
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
      <div className="space-y-6">
        <div className="hidden md:block">
          <div className="grid grid-cols-5 text-sm text-gray-500 border-b pb-2 mb-4">
            <span className="col-span-2">Nazwa kursu</span>
            <span>Kategoria</span>
            <span>Uczestnicy</span>
            <span>Ocena</span>
          </div>
          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-5 items-center py-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="col-span-2">
                <h2 className="text-base font-medium ">{course.name}</h2>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
              <p>{course.categoryName}</p>
              <p>{course.participants || 0} uczestników</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span>{course.rating || "Brak ocen"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Widok mobilny (karty) */}
        <div className="block md:hidden">
          <div className="flex flex-col gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <h2 className="text-lg font-semibold ">{course.name}</h2>
                <p className="text-sm text-gray-500">{course.categoryName}</p>
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
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nie znaleziono żadnych kursów</p>
          <Button onClick={() => navigate("/courses/create")}>
            <Plus className="mr-2 h-4 w-4" /> Dodaj pierwszy kurs
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default CoursesPage;
