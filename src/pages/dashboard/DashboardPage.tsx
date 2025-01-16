import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthLayout from "@/components/AuthLayout";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

interface Course {
  id: string;
  name: string;
  description: string;
  category_id: string;
  created_at: Date;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(coursesQuery);
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate(),
        })) as Course[];

        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Nie udało się załadować kursów");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten kurs?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "courses", courseId));
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Nie udało się usunąć kursu");
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <PageHeader to="courses" title="Twoje kursy" btn="Dodaj kurs" />
        <PageLoader title="Ładowanie kursów..." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <PageHeader to="courses" title="Twoje kursy" btn="Dodaj kurs" />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    Otwórz
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>
                  Utworzono: {course.created_at?.toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Brak kursów</h3>
          <p className="mt-2 text-gray-500">
            Rozpocznij od dodania swojego pierwszego kursu.
          </p>
          <Button onClick={() => navigate("/courses/create")} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Dodaj kurs
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default Dashboard;
