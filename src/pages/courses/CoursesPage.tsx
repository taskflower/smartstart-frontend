import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { db } from "@/services/firebase";

interface Course {
  id: string;
  name: string;
  description: string;
  category_id: string;
  categoryName?: string;
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
        <div className="p-8">
          <div>Ładowanie kursów...</div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kursy</h1>
          <Button onClick={() => navigate("/courses/create")}>
            <Plus className="mr-2 h-4 w-4" /> Dodaj kurs
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border flex justify-between rounded-lg p-6 space-y-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="text-sm text-gray-500">{course.categoryName}</p>
              </div>
              <p className="text-gray-600 line-clamp-3">{course.description}</p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses/${course.id}`);
                  }}
                >
                  Zobacz szczegóły
                </Button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nie znaleziono żadnych kursów</p>
            <Button onClick={() => navigate("/courses/create")}>
              <Plus className="mr-2 h-4 w-4" /> Dodaj pierwszy kurs
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default CoursesPage;