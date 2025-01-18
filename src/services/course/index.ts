// src/services/course/index.ts

export * from './courseQueries';
export * from './sectionQueries';
export * from './activityQueries';
export * from './resourceQueries';

// Możemy też dodać komentarz dokumentacyjny wyjaśniający powiązanie
/**
 * Moduł obsługujący wszystkie operacje związane z kursami, w tym:
 * - podstawowe operacje na kursach (courseQueries)
 * - zarządzanie sekcjami w kursie (sectionQueries)
 * - zarządzanie aktywnościami w sekcjach kursu (activityQueries)
 * - zarządzanie zasobami w sekcjach kursu (resourceQueries)
 */