// src/pages/questions/routes.tsx
import { RouteObject } from 'react-router-dom';
import QuestionsPage from './QuestionsPage';
import AnswersPage from './AnswersPage';

export const questionsRoutes: RouteObject[] = [
  {
    path: '/questions',
    element: <QuestionsPage />,
  },
  {
    path: '/questions/:questionId/answers',
    element: <AnswersPage />,
  },
];