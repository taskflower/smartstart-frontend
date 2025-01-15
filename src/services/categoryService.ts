import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  items?: Category[];
}

// Pobiera kategorie z rodzicem = null
export async function fetchTopLevelCategories(): Promise<Category[]> {
  const snapshot = await getDocs(
    query(collection(db, "categories"), where("parent_id", "==", null))
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

// Pobiera dzieci wybranej kategorii
export async function fetchChildren(parentId: string): Promise<Category[]> {
  const snapshot = await getDocs(
    query(collection(db, "categories"), where("parent_id", "==", parentId))
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

// Dodaje nową kategorię do kolekcji
export async function addCategory(name: string, parentId?: string | null): Promise<void> {
  await addDoc(collection(db, "categories"), {
    name,
    parent_id: parentId ?? null,
  });
}
