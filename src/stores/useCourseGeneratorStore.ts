// src/stores/useCourseGeneratorStore.ts

import create from 'zustand';

interface Topic {
  title: string;
  duration: string;
  materials: string[];
  objectives: string[];
}

interface Summary {
  totalDuration: string;
  difficulty: string;
  requirements: string[];
  assessment: string[];
}

interface CourseData {
  title: string;
  description: string;
  topics: Topic[]; // Ensure Topic is used here
  summary: Summary;
  school: string;
  subject: string;
  useBase: boolean;
}

interface CourseGeneratorState {
  currentStep: number;
  courseData: CourseData;
  setCurrentStep: (step: number) => void;
  setCourseData: (data: Partial<CourseData>) => void;
  reset: () => void;
}

export const useCourseGeneratorStore = create<CourseGeneratorState>((set) => ({
  currentStep: 1,
  courseData: {
    title: '',
    description: '',
    topics: [],
    summary: {
      totalDuration: '',
      difficulty: '',
      requirements: [],
      assessment: [],
    },
    school: '',
    subject: '',
    useBase: true,
  },
  setCurrentStep: (step) => set({ currentStep: step }),
  setCourseData: (data) =>
    set((state) => ({
      courseData: { ...state.courseData, ...data },
    })),
  reset: () =>
    set({
      currentStep: 1,
      courseData: {
        title: '',
        description: '',
        topics: [],
        summary: {
          totalDuration: '',
          difficulty: '',
          requirements: [],
          assessment: [],
        },
        school: '',
        subject: '',
        useBase: true,
      },
    }),
}));
