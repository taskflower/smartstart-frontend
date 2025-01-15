// src/pages/categories/routes.tsx
import { RouteObject } from 'react-router-dom';
import CategoriesPage from './CategoriesPage';

export const categoriesRoutes: RouteObject[] = [
  {
    path: '/categories',
    element: <CategoriesPage />,
  }
];