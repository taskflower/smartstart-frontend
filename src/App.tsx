import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateDocumentPage from "./pages/CreateDocumentPage";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/CategoriesPage";
import QuestionsPage from "./pages/QuestionsPage";
import { useAuthState } from "./hooks/useAuthState";
import AnswersPage from "./pages/AnswersPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import CoursePage from "./pages/CoursePage"; // Dodaj ten import
import CoursesPage from "./pages/CoursesPage";
import CareerPathPage from "./pages/CareerPathPage";
import InterdisciplinaryPage from "./pages/InterdisciplinaryPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Trwa ładowanie...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Trwa ładowanie...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateDocumentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <QuestionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions/:questionId/answers"
          element={
            <PrivateRoute>
              <AnswersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CoursesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/path"
          element={
            <PrivateRoute>
              <CareerPathPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inter"
          element={
            <PrivateRoute>
              <InterdisciplinaryPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/create"
          element={
            <PrivateRoute>
              <CreateCoursePage />
            </PrivateRoute>
          }
        />
        {/* Dodaj nową trasę dla szczegółów kursu */}
        <Route
          path="/courses/:courseId"
          element={
            <PrivateRoute>
              <CoursePage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
