// src/pages/career/routes.tsx
import { RouteObject } from 'react-router-dom';
import CareerPathPage from './CareerPathPage';
import InterdisciplinaryPage from './InterdisciplinaryPage';

export const careerRoutes: RouteObject[] = [
  {
    path: '/path',
    element: <CareerPathPage />,
  },
  {
    path: '/inter',
    element: <InterdisciplinaryPage />,
  },
];