import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthLayout from "@/components/AuthLayout";
import {
  fetchTopLevelCategories,
  fetchChildren,
  addCategory,
  Category,
} from "@/services/categoryService";

const CategoriesTree = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const topLevel = await fetchTopLevelCategories();

        // Fetch children for each top-level category
        const withChildren = await Promise.all(
          topLevel.map(async (cat) => ({
            ...cat,
            items: await fetchChildren(cat.id),
          }))
        );

        setCategories(withChildren);
      } catch (error) {
        console.error("Błąd pobierania kategorii:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev); // Properly initialized
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddCategory = async (name: string, parentId?: string | null) => {
    try {
      await addCategory(name, parentId);
      // Refresh categories after adding
      const topLevel = await fetchTopLevelCategories();
      const withChildren = await Promise.all(
        topLevel.map(async (cat) => ({
          ...cat,
          items: await fetchChildren(cat.id),
        }))
      );
      setCategories(withChildren);
    } catch (error) {
      console.error("Błąd dodawania kategorii:", error);
    }
  };

  const renderCategory = (category: Category) => (
    <div key={category.id} className="pl-4">
      <div className="flex items-center justify-between p-2 border hover:bg-gray-50 rounded">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleToggle(category.id)}
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
                if (name) handleAddCategory(name, category.id);
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
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  if (name) handleAddCategory(name);
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
