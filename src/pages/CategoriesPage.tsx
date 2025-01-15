import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthLayout from "@/components/AuthLayout";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  items?: Category[];
}

const CategoriesTree = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(
          query(collection(db, "categories"), where("parent_id", "==", null))
        );
        const topLevel = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        // Fetch children for each top-level category
        const withChildren = await Promise.all(
          topLevel.map(async (cat) => ({
            ...cat,
            items: await fetchChildren(cat.id),
          }))
        );

        setCategories(withChildren);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch children for a category
  const fetchChildren = async (parentId: string) => {
    const snapshot = await getDocs(
      query(collection(db, "categories"), where("parent_id", "==", parentId))
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  };

  // Toggle category expansion
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Add new category and maintain expanded state
  const addCategory = async (name: string, parentId: string | null = null) => {
    try {
      await addDoc(collection(db, "categories"), {
        name,
        parent_id: parentId,
      });

      // Fetch and update while preserving expanded state
      const snapshot = await getDocs(
        query(collection(db, "categories"), where("parent_id", "==", null))
      );
      const topLevel = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      const withChildren = await Promise.all(
        topLevel.map(async (cat) => ({
          ...cat,
          items: await fetchChildren(cat.id),
        }))
      );

      setCategories(withChildren);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Render single category with children
  const renderCategory = (category: Category) => (
    <div key={category.id} className="pl-4">
      <div className="flex items-center justify-between p-2 border hover:bg-gray-50 rounded">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleExpand(category.id)}
        >
          {(category.items?.length ?? 0) > 0 ? (
            expandedIds.has(category.id) ? (
              <Minus size={16} />
            ) : (
              <Plus size={16} />
            )
          ) : (
            <div className="w-4" />
          )}
          <span className="ml-2">{category.name}</span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Dodaj podkategorię
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj do "{category.name}"</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value;
                if (name) addCategory(name, category.id);
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Nazwa podkategorii" required />
              <Button type="submit">Dodaj</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {expandedIds.has(category.id) &&
        category.items &&
        category.items.length > 0 && (
          <div className="mt-2">{category.items.map(renderCategory)}</div>
        )}
    </div>
  );

  if (isLoading)
    return (
      <AuthLayout>
        <div className="p-8">Ładowanie kategorii...</div>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kategorie</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" /> Dodaj kategorię
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nową kategorię</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (
                    form.elements.namedItem("name") as HTMLInputElement
                  ).value;
                  if (name) addCategory(name);
                }}
                className="space-y-4"
              >
                <Input name="name" placeholder="Nazwa kategorii" required />
                <Button type="submit">Dodaj</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">{categories.map(renderCategory)}</div>
      </div>
    </AuthLayout>
  );
};

export default CategoriesTree;
