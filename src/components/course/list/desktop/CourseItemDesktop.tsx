// src/components/course/list/desktop/CourseItem.tsx
import { useNavigate } from "react-router-dom";
import { EDUCATION_ICONS } from "@/components/IconSelector";
import { CourseItemProps } from "../types";

export const CourseItemDesktop: React.FC<CourseItemProps> = ({ course, categoryInfo }) => {
  const navigate = useNavigate();
  const CategoryIcon = categoryInfo.icon ? EDUCATION_ICONS[categoryInfo.icon] : null;

  return (
    <div
      className="grid grid-cols-5 items-center py-4 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="col-span-2">
        <h2 className="text-base font-medium">{course.name}</h2>
        <p className="text-sm text-gray-500">{course.description}</p>
      </div>
      <div className="flex items-center gap-2">
        {CategoryIcon && <CategoryIcon className="w-4 h-4 text-gray-500" />}
        <span>{categoryInfo.name}</span>
      </div>
      <p>{course.participants || 0} uczestników</p>
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span>{course.rating || "Brak ocen"}</span>
      </div>
    </div>
  );
};