// src/pages/courses/routes.tsx
import { RouteObject } from 'react-router-dom';
import CoursePage from './CoursePage';
import CoursesPage from './CoursesPage';
import CreateCoursePage from './CreateCoursePage';

import Result from './generate/Result';
import Step1 from './generate/Step1';
import Step2 from './generate/Step2';
import Step3 from './generate/Step3';
import CourseGenerator from './generate/CourseGenerator';
import StepRagMaterials from './generate/StepRagMaterials';

export const coursesRoutes: RouteObject[] = [
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: '/courses/create',
    element: <CreateCoursePage />,
  },
  // {
  //   path: '/courses/generate',
  //   element: <CourseGenerator />,
  // },
  {
    path: '/courses/generate',
    element: <CourseGenerator />,
    children: [
      { path: 'step1', element: <Step1 /> },
      { path: 'step2', element: <Step2 /> },
      {
        path: "rag-materials", // nowy route
        element: <StepRagMaterials />
      },
      { path: 'step3', element: <Step3 /> },
      { path: 'result', element: <Result /> },
      { index: true, element: <Step1 /> }, // Default to Step1
    ],
  },
  {
    path: '/courses/:courseId',
    element: <CoursePage />,
  },
];