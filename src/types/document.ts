// Typy dla dokumentów edukacyjnych

export interface EducationalDocument {
    id: string; // Unikalne ID dokumentu
    topic: string; // Temat dokumentu
    textbook: string; // Powiązany podręcznik
    educationLevel: string; // Poziom edukacji (np. Klasa 7)
    language: string; // Język dokumentu
    schoolType: SchoolType; // Typ szkoły (np. podstawowa, technikum)
    content: string; // Treść dokumentu
    createdAt: Date; // Data utworzenia
    updatedAt: Date; // Data ostatniej aktualizacji
    authorId: string; // ID autora dokumentu
  }
  
  // Typy szkół dla dokumentów edukacyjnych
  export enum SchoolType {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    TECHNICAL = "TECHNICAL",
    VOCATIONAL = "VOCATIONAL",
  }
  
  // Typy danych dla formularza tworzenia dokumentu
  export interface CreateDocumentFormData {
    topic: string; // Temat dokumentu
    textbook: string; // Powiązany podręcznik
    educationLevel: string; // Poziom edukacji
    language: string; // Język dokumentu
    schoolType: string; // Typ szkoły
    content: string; // Treść dokumentu
  }
  