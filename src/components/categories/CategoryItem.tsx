import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category } from "@/services/categoryService";
import { cn } from "@/services/utils";
import { AddCategoryDialog } from "./AddCategoryDialog";

interface CategoryItemProps {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
  onDelete: (category: Category) => Promise<void>;
  expandedIds: Set<string>;
  handleToggle: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  expanded,
  onToggle,
  onAdd,
  onDelete,
  expandedIds,
  handleToggle,
}) => {
  const hasChildren = (category.items?.length ?? 0) > 0;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setDeleteError("Nie można usunąć kategorii z podkategoriami");
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(category);
    } catch {
      setDeleteError("Nie udało się usunąć kategorii");
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <AddCategoryDialog parentCategory={category} onAdd={onAdd} />
          <Button
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting || hasChildren}
            className={cn(
              "h-8 w-8",
              hasChildren && "cursor-not-allowed opacity-50"
            )}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {deleteError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}
      {expanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {category.items!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              expanded={expandedIds.has(child.id)}
              onToggle={() => handleToggle(child.id)}
              onAdd={onAdd}
              onDelete={onDelete}
              expandedIds={expandedIds}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};