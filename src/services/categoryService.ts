import { collection, getDocs, addDoc, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  items?: Category[];
}

export async function fetchAllCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(collection(db, "categories")));
  const allCategories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];

  const categoryMap = new Map<string | null, Category[]>();
  
  allCategories.forEach(category => {
    const parentId = category.parent_id;
    if (!categoryMap.has(parentId)) {
      categoryMap.set(parentId, []);
    }
    categoryMap.get(parentId)!.push(category);
  });

  function buildTree(parentId: string | null): Category[] {
    const children = categoryMap.get(parentId) || [];
    return children.map(child => ({
      ...child,
      items: buildTree(child.id)
    }));
  }

  return buildTree(null);
}

export async function addCategory(name: string, parentId?: string | null): Promise<void> {
  await addDoc(collection(db, "categories"), {
    name,
    parent_id: parentId ?? null,
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const categoriesRef = collection(db, "categories");
  const childrenQuery = query(categoriesRef, where("parent_id", "==", categoryId));
  const childrenSnapshot = await getDocs(childrenQuery);
  
  if (!childrenSnapshot.empty) {
    throw new Error("Cannot delete category with subcategories");
  }
  
  await deleteDoc(doc(db, "categories", categoryId));
}