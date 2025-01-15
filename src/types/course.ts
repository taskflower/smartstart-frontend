/* eslint-disable @typescript-eslint/no-explicit-any */
// types/course.ts

export interface Course {
    id: string;
    name: string;
    description: string;
    category_id: string;
  }
  
  export interface Section {
    id: string;
    name: string;
    course_id: string;
    type: 'topic' | 'weekly';
    sequence: number;
    visible: boolean;
  }
  
  export interface Activity {
    id: string;
    type: 'quiz' | 'assignment' | 'forum';
    name: string;
    description: string;
    settings: any;
    section_id: string;
    visible: boolean;
    sequence: number;
  }
  
  export interface Resource {
    id: string;
    type: 'file' | 'url' | 'page';
    name: string;
    content: string;
    section_id: string;
    visible: boolean;
    sequence: number;
  }