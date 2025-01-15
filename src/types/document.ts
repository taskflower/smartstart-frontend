// src/types/document.ts
export interface EducationalDocument {
    id: string;
    language: string;
    schoolType: SchoolType;
    educationLevel: string;
    textbook: string;
    topic: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
  }
  
  export enum SchoolType {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    TECHNICAL = "TECHNICAL",
    VOCATIONAL = "VOCATIONAL"
  }