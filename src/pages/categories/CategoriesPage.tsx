import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  fetchAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  Category,
} from "@/services/categoryService";
import { CategoryItem } from "@/components/categories/CategoryItem";
import { AddCategoryDialog } from "@/components/categories/dialogs/AddCategoryDialog";


const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch {
      setError("Nie udało się załadować kategorii. Odśwież stronę.");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddCategory = async (
    name: string,
    icon: string | null,
    parentId?: string | null
  ) => {
    await addCategory(name, icon, parentId);
    await loadCategories();
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      await loadCategories();
    } catch {
      setError("Nie można usunąć kategorii, która ma podkategorie");
    }
  };

  const handleEditCategory = async (
    categoryId: string,
    newName: string,
    newIcon: string | null
  ) => {
    await updateCategory(categoryId, newName, newIcon);
    await loadCategories();
  };

  return (
    <AuthLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kategorie</h1>
        <AddCategoryDialog
          onAdd={handleAddCategory}
          trigger={<Button>Dodaj kategorię</Button>}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              expanded={expandedIds.has(category.id)}
              onToggle={() => handleToggle(category.id)}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
              onEdit={handleEditCategory}
              expandedIds={expandedIds}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </AuthLayout>
  );
};

export default CategoriesPage;
