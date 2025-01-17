// src/components/course/list/mobile/CourseListMobile.tsx
import { Course } from "@/types/moodle";
import { CourseItemMobile } from "./CourseItemMobile";

interface CourseListMobileProps {
  courses: Course[];
  getCategoryInfo: (categoryId: string) => { name: string; icon: string | null };
}

export const CourseListMobileComponent: React.FC<CourseListMobileProps> = ({ 
  courses,
  getCategoryInfo
}) => (
  <div className="md:hidden">
    <div className="flex flex-col gap-5">
      {courses.map((course) => (
        <CourseItemMobile
          key={course.id}
          course={course}
          categoryInfo={getCategoryInfo(course.category_id)}
        />
      ))}
    </div>
  </div>
);

export default CourseListMobileComponent;