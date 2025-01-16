import React, { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchAllCategories,
  addCategory,
  deleteCategory,
  Category,
} from "@/services/categoryService";
import PageLoader from "@/components/PageLoader";
import PageHeader from "@/components/PageHeader";
import { CategoryItem } from "@/components/categories/CategoryItem";
import { AddCategoryDialog } from "@/components/categories/AddCategoryDialog";

const CategoriesTree: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allCategories = await fetchAllCategories();
      setCategories(allCategories);
    } catch {
      setError("Nie udało się załadować kategorii. Odśwież stronę.");
    } finally {
      setIsLoading(false);
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

  const handleAddCategory = async (name: string, parentId?: string | null) => {
    await addCategory(name, parentId);
    await loadCategories();
  };

  const handleDeleteCategory = async (category: Category) => {
    await deleteCategory(category.id);
    await loadCategories();
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <PageHeader to="categories" title="Kategorie" btn="Dodaj kategorię" />
        <PageLoader title="Ładowanie kategorii..." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kategorie</h1>
        <AddCategoryDialog onAdd={handleAddCategory} />
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
              expandedIds={expandedIds}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </AuthLayout>
  );
};

export default CategoriesTree;