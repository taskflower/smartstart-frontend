// CategoryItem.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader2, Trash2, Pencil } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category } from "@/services/categoryService";
import { cn } from "@/services/utils";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { EDUCATION_ICONS } from "../IconSelector";


interface CategoryItemProps {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (name: string, icon: string | null, parentId?: string | null) => Promise<void>;
  onDelete: (category: Category) => Promise<void>;
  onEdit: (categoryId: string, newName: string, newIcon: string | null) => Promise<void>; // zaktualizowana sygnatura
  expandedIds: Set<string>;
  handleToggle: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  expanded,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  expandedIds,
  handleToggle,
}) => {
  const hasChildren = (category.items?.length ?? 0) > 0;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const CategoryIcon = category.icon ? EDUCATION_ICONS[category.icon] : null;

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
    <div className="pl-4 select-none">
      <div className="flex items-center justify-between p-2 border hover:bg-gray-50 rounded">
        {/* Obszar Toggle */}
        <div className="flex items-center cursor-pointer group" onClick={onToggle}>
          <div className="w-6 h-6 flex items-center justify-center rounded-full border hover:bg-gray-200 transition">
            {hasChildren &&
              (expanded ? (
                <Minus className="h-4 w-4 text-gray-500" />
              ) : (
                <Plus className="h-4 w-4 text-gray-500" />
              ))}
          </div>
          <div className="flex items-center ml-2">
            {CategoryIcon && <CategoryIcon className="w-5 h-5 mr-2 text-gray-600" />}
            <span className="group-hover:text-gray-700">{category.name}</span>
          </div>
        </div>
        
        {/* Akcje */}
        <div className="flex items-center gap-2">
          {/* Przycisk Edytuj */}
          <EditCategoryDialog
            category={category}
            onEdit={onEdit}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Edytuj kategorię ${category.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />

          {/* Przycisk Dodaj */}
          <AddCategoryDialog
            parentCategory={category}
            onAdd={onAdd}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Dodaj podkategorię do ${category.name}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            }
          />

          {/* Przycisk Usuń */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
            disabled={isDeleting || hasChildren}
            className={cn(
              "h-8 w-8",
              hasChildren && "cursor-not-allowed opacity-50"
            )}
            aria-label={`Usuń kategorię ${category.name}`}
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
              onEdit={onEdit}
              expandedIds={expandedIds}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};