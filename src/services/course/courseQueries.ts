import { collection, doc, getDoc, getDocs, query, where, CollectionReference, DocumentData, limit, startAfter, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Course } from "@/types/moodle";
import { PAGE_SIZE } from "@/constants/pagination";
import { Category } from "../categoryService";
import { findCategoryAndCollectIds } from "../utils";

interface PaginatedResult<T> {
  items: T[];
  lastCursor: string | null;
  hasMore: boolean;
}

// Podstawowe operacje na kursach
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