import { collection, getDocs, addDoc, query } from "firebase/firestore";
import { db } from "./firebase";

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  items?: Category[];
}

// Pobiera wszystkie kategorie jednym zapytaniem
export async function fetchAllCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(collection(db, "categories")));
  const allCategories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];

  // Buduje drzewo kategorii
  const categoryMap = new Map<string | null, Category[]>();
  
  // Grupuje kategorie według parent_id
  allCategories.forEach(category => {
    const parentId = category.parent_id;
    if (!categoryMap.has(parentId)) {
      categoryMap.set(parentId, []);
    }
    categoryMap.get(parentId)!.push(category);
  });

  // Funkcja rekurencyjna do budowania drzewa
  function buildTree(parentId: string | null): Category[] {
    const children = categoryMap.get(parentId) || [];
    return children.map(child => ({
      ...child,
      items: buildTree(child.id)
    }));
  }

  // Zwraca tylko kategorie najwyższego poziomu z ich dziećmi
  return buildTree(null);
}

// Dodaje nową kategorię do kolekcji
export async function addCategory(name: string, parentId?: string | null): Promise<void> {
  await addDoc(collection(db, "categories"), {
    name,
    parent_id: parentId ?? null,
  });
}