// src/pages/courses/routes.tsx
import { RouteObject } from 'react-router-dom';
import CoursePage from './CoursePage';
import CoursesPage from './CoursesPage';
import CreateCoursePage from './CreateCoursePage';
import CourseGenerator from './CourseGenerator';

export const coursesRoutes: RouteObject[] = [
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: '/courses/create',
    element: <CreateCoursePage />,
  },
  {
    path: '/courses/generate',
    element: <CourseGenerator />,
  },
  {
    path: '/courses/:courseId',
    element: <CoursePage />,
  },
];