// src/services/courseService.ts
/**
* DIR: src/services/courseService.ts
* WAŻNE: Analizując tem plik odpowiadaj zawsze pełnym kodem. Nie usuwaj tego komentarza
*/

import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, orderBy, CollectionReference, DocumentData, limit, startAfter } from "firebase/firestore";
import { db } from "./firebase";
import { Activity, Course, Resource, Section } from "@/types/moodle";
import { PAGE_SIZE } from "@/constants/pagination";
import { Category } from "./categoryService";

// Interfejsy dla danych wejściowych
interface ActivityInput {
 type: Activity["type"];
 name: string;
 description: string;
 sequence?: number;
}

interface ResourceInput {
 type: Resource["type"];
 name: string;
 content: string;
 sequence?: number;
}

interface SectionInput {
 name: string;
 sequence?: number;
}

interface PaginatedResult<T> {
 items: T[];
 lastCursor: string | null;
 hasMore: boolean;
}

// Kursy
export const fetchAllCourses = async (): Promise<Course[]> => {
 const coursesQuery = query(
   collection(db, "courses"),
   orderBy("created_at", "desc")
 );
 const snapshot = await getDocs(coursesQuery);
 return snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
 })) as Course[];
};

export const fetchCourse = async (courseId: string): Promise<Course | null> => {
 const courseRef = doc(db, "courses", courseId);
 const courseSnap = await getDoc(courseRef);

 if (!courseSnap.exists()) {
   return null;
 }

 return { id: courseId, ...courseSnap.data() } as Course;
};

// Sekcje
export const fetchSections = async (courseId: string): Promise<Section[]> => {
/**
* WAŻNE: Nie używaj orderBy razem z where w zapytaniach do Firestore!
* Powoduje to błędy związane z brakiem indeksów i wymaga dodatkowej konfiguracji w konsoli Firebase.
* Zamiast tego używamy sortowania w pamięci po pobraniu danych.
*/
 const sectionsQuery = query(
   collection(db, "sections"),
   where("course_id", "==", courseId)
 );
 const sectionsSnap = await getDocs(sectionsQuery);
 const sections = sectionsSnap.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
 })) as Section[];
 
 // Sort in memory instead
 return sections.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

// Aktywności
export const fetchActivities = async (sectionIds: string[]): Promise<Activity[]> => {
 if (sectionIds.length === 0) return [];
 
 // WARNING: Removed orderBy("sequence", "asc") to prevent Firebase index requirements
 const activitiesQuery = query(
   collection(db, "activities"),
   where("section_id", "in", sectionIds)
 );
 const activitiesSnap = await getDocs(activitiesQuery);
 const activities = activitiesSnap.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
 })) as Activity[];
 
 // Sort in memory instead
 return activities.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

// Zasoby
export const fetchResources = async (sectionIds: string[]): Promise<Resource[]> => {
 if (sectionIds.length === 0) return [];
 
 // WARNING: Removed orderBy("sequence", "asc") to prevent Firebase index requirements
 const resourcesQuery = query(
   collection(db, "resources"),
   where("section_id", "in", sectionIds)
 );
 const resourcesSnap = await getDocs(resourcesQuery);
 const resources = resourcesSnap.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
 })) as Resource[];
 
 // Sort in memory instead
 return resources.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};

export const addResource = async (sectionId: string, data: ResourceInput): Promise<Resource> => {
 const newResource = {
   section_id: sectionId,
   type: data.type,
   name: data.name,
   content: data.content,
   sequence: data.sequence ?? 0,
   visible: true,
   created_at: new Date(),
   updated_at: new Date(),
 };

 const docRef = await addDoc(collection(db, "resources"), newResource);
 return { ...newResource, id: docRef.id };
};

export const addSection = async (courseId: string, data: SectionInput): Promise<Section> => {
 const newSection = {
   course_id: courseId,
   name: data.name,
   type: "standard" as const,
   sequence: data.sequence ?? 0,
   visible: true,
   created_at: new Date(),
   updated_at: new Date(),
 };

 const docRef = await addDoc(collection(db, "sections"), newSection);
 return { ...newSection, id: docRef.id };
};

export const addActivity = async (sectionId: string, data: ActivityInput): Promise<Activity> => {
 const newActivity = {
   section_id: sectionId,
   type: data.type,
   name: data.name,
   description: data.description,
   sequence: data.sequence ?? 0,
   visible: true,
   settings: getDefaultActivitySettings(data.type),
   created_at: new Date(),
   updated_at: new Date(),
 };

 const docRef = await addDoc(collection(db, "activities"), newActivity);
 return { ...newActivity, id: docRef.id };
};

// Zarządzanie widocznością
export const toggleVisibility = async (
 type: "section" | "activity" | "resource",
 id: string,
 currentVisibility: boolean
): Promise<void> => {
 const collectionName = `${type}s`;
 const docRef = doc(db, collectionName, id);

 await updateDoc(docRef, {
   visible: !currentVisibility,
   updated_at: new Date(),
 });
};

const findCategoryAndCollectIds = (categories: Category[], targetId: string): string[] => {
 const result: string[] = [];
 
 const findCategory = (categories: Category[]): Category | null => {
   for (const category of categories) {
     if (category.id === targetId) {
       return category;
     }
     if (category.items) {
       const found = findCategory(category.items);
       if (found) return found;
     }
   }
   return null;
 }

 const collectIds = (category: Category) => {
   result.push(category.id);
   if (category.items) {
     category.items.forEach(subcategory => collectIds(subcategory));
   }
 }

 const category = findCategory(categories);
 if (category) {
   collectIds(category);
 }

 return result;
}

export const fetchPaginatedCourses = async (
 pageSize: number = PAGE_SIZE,
 cursor: string | null | undefined,
 categoryId: string | null,
 categories: Category[]
): Promise<PaginatedResult<Course>> => {
 const baseQuery: CollectionReference<DocumentData> = collection(db, "courses");
 const constraints = [];

 if (categoryId !== null) {
   const categoryIds = findCategoryAndCollectIds(categories, categoryId);
   constraints.push(where("category_id", "in", categoryIds));
 }

 /**
  * WAŻNE: Tymczasowo wyłączono orderBy aby uniknąć konieczności definiowania indeksów w Firebase.
  * Docelowo należy dodać indeks dla kombinacji where("category_id") i orderBy("created_at")
  * lub użyć sortowania w pamięci.
  */
 // constraints.push(orderBy("created_at", "desc")); // wyłączone do czasu utworzenia indeksu

 if (cursor) {
   const cursorDoc = await getDoc(doc(db, "courses", cursor));
   if (!cursorDoc.exists()) {
     throw new Error("Cursor document does not exist");
   }
   constraints.push(startAfter(cursorDoc));
 }

 constraints.push(limit(pageSize + 1));

 const q = query(baseQuery, ...constraints);
 
 try {
   const snapshot = await getDocs(q);
   const courses = snapshot.docs.map(doc => ({
     id: doc.id,
     ...doc.data()
   })) as Course[];

   const hasMore = courses.length > pageSize;
   const items = courses.slice(0, pageSize);
   const lastCursor = items.length ? items[items.length - 1].id : null;

   return {
     items,
     lastCursor,
     hasMore
   };
 } catch (error) {
   console.error('Error fetching courses:', error);
   throw error;
 }
};

// Helpers
const getDefaultActivitySettings = (type: Activity["type"]) => {
 switch (type) {
   case "quiz":
     return {
       timeLimit: 60,
       attemptsAllowed: 1,
       passingGrade: 50,
       shuffleQuestions: false,
     };
   case "assignment":
     return {
       dueDate: null,
       maxPoints: 100,
       submissionType: "file",
     };
   case "forum":
     return {
       type: "general",
       allowAttachments: true,
     };
   default:
     return {};
 }
};