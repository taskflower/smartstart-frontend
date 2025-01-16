import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthLayout from "@/components/AuthLayout";
import {
  fetchAllCategories,
  addCategory,
  Category,
} from "@/services/categoryService";
import PageLoader from "@/components/PageLoader";
import PageHeader from "@/components/PageHeader";

interface AddCategoryDialogProps {
  parentCategory?: Category;
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  parentCategory,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onAdd(name, parentCategory?.id);
      setName("");
      setIsOpen(false);
    } catch {
      setError("Nie udało się dodać kategorii. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={parentCategory ? "ghost" : "default"}>
          <Plus className="mr-2 h-4 w-4" />
          {parentCategory ? "Dodaj podkategorię" : "Dodaj kategorię"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {parentCategory
              ? `Dodaj podkategorię do "${parentCategory.name}"`
              : "Dodaj nową kategorię"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nazwa kategorii"
            required
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Dodaj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface CategoryItemProps {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  expanded,
  onToggle,
  onAdd,
}) => {
  const hasChildren = (category.items?.length ?? 0) > 0;

  return (
    <div className="pl-4">
      <div className="flex items-center justify-between p-2 border hover:bg-gray-50 rounded">
        <div
          className="flex items-center cursor-pointer group"
          onClick={onToggle}
        >
          <div className="w-4">
            {hasChildren &&
              (expanded ? (
                <Minus className="h-4 w-4 text-gray-500" />
              ) : (
                <Plus className="h-4 w-4 text-gray-500" />
              ))}
          </div>
          <span className="ml-2 group-hover:text-gray-700">
            {category.name}
          </span>
        </div>
        <AddCategoryDialog parentCategory={category} onAdd={onAdd} />
      </div>

      {expanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {category.items!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              expanded={false}
              onToggle={() => {}}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
    await loadCategories(); // Odśwież drzewo
  };

  if (isLoading) {
    return (
    
      <AuthLayout>
     
        <PageHeader
          to="categories"
          title="Kategorie"
          btn="Dodaj kategorię"
        />
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
              />
            ))}
          </div>
        )}
      
    </AuthLayout>
  );
};

export default CategoriesTree;
