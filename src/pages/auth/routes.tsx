// src/pages/auth/routes.tsx
import { RouteObject } from 'react-router-dom';
import LoginPage from './LoginPage';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
];