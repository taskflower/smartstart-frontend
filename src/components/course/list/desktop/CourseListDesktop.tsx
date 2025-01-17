// src/components/course/list/desktop/CourseListDesktop.tsx
import { Course } from "@/types/moodle";
import { CourseItemDesktop } from "./CourseItemDesktop";

interface CourseListDesktopProps {
  courses: Course[];
  getCategoryInfo: (categoryId: string) => { name: string; icon: string | null };
}

export const CourseListDesktopComponent: React.FC<CourseListDesktopProps> = ({ 
  courses,
  getCategoryInfo
}) => (
  <div className="hidden md:block">
    <div className="grid grid-cols-5 text-sm text-gray-500 border-b pb-2 mb-4">
      <span className="col-span-2">Nazwa kursu</span>
      <span>Kategoria</span>
      <span>Uczestnicy</span>
      <span>Ocena</span>
    </div>
    {courses.map((course) => (
      <CourseItemDesktop
        key={course.id}
        course={course}
        categoryInfo={getCategoryInfo(course.category_id)}
      />
    ))}
  </div>
);

export default CourseListDesktopComponent;