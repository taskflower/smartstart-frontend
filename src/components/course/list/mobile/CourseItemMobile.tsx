// src/components/course/list/mobile/CourseItem.tsx
import { useNavigate } from "react-router-dom";
import { EDUCATION_ICONS } from "@/components/IconSelector";
import { CourseItemProps } from "../types";

export const CourseItemMobile: React.FC<CourseItemProps> = ({ course, categoryInfo }) => {
  const navigate = useNavigate();
  const CategoryIcon = categoryInfo.icon ? EDUCATION_ICONS[categoryInfo.icon] : null;

  return (
    <div
      className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <h2 className="text-lg font-semibold">{course.name}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
        <span>{categoryInfo.name}</span>
      </div>
      <p className="text-gray-700 text-sm line-clamp-3 mb-4">{course.description}</p>
      <div className="flex items-center justify-between text-gray-600 text-sm">
        <span>{course.participants || 0} uczestników</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>{course.rating || "Brak ocen"}</span>
        </div>
      </div>
    </div>
  );
};