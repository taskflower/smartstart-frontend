// src/routes/index.tsx
import { RouteObject, Navigate } from 'react-router-dom';
import { withPrivateRoute, withPublicRoute } from './guards';
import { authRoutes } from '../pages/auth/routes';
import { coursesRoutes } from '../pages/courses/routes';
import { questionsRoutes } from '../pages/questions/routes';
import { careerRoutes } from '../pages/career/routes';
import DashboardPage from '../pages/dashboard/DashboardPage';
import { categoriesRoutes } from '@/pages/categories/routes';

// Aplikujemy HOC do tras
const protectedCoursesRoutes = coursesRoutes.map(route => ({
  ...route,
  element: withPrivateRoute(route.element)
}));

const publicAuthRoutes = authRoutes.map(route => ({
  ...route,
  element: withPublicRoute(route.element)
}));

export const routes: RouteObject[] = [
  // Auth routes
  ...publicAuthRoutes,
  
  // Protected routes
  {
    path: '/dashboard',
    element: withPrivateRoute(<DashboardPage />)
  },
  ...protectedCoursesRoutes,
  ...questionsRoutes.map(route => ({
    ...route,
    element: withPrivateRoute(route.element)
  })),
  ...careerRoutes.map(route => ({
    ...route,
    element: withPrivateRoute(route.element)
  })),
  ...categoriesRoutes.map(route => ({
    ...route,
    element: withPrivateRoute(route.element)
  })),
  
  // Default redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  }
];