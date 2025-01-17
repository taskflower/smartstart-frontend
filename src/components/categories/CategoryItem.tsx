import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader2, Trash2, Pencil, LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category } from "@/services/categoryService";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { EDUCATION_ICONS } from "../IconSelector";

interface CategoryItemProps {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (name: string, icon: string | null, parentId?: string | null) => Promise<void>;
  onDelete: (category: Category) => Promise<void>;
  onEdit: (categoryId: string, newName: string, newIcon: string | null) => Promise<void>;
  expandedIds: Set<string>;
  handleToggle: (id: string) => void;
}

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  onClick, 
  disabled = false, 
  loading = false, 
  label 
}) => (
  <Button
    variant="ghost"
    size="icon"
    className="h-8 w-8"
    onClick={(e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(e);
    }}
    disabled={disabled || loading}
    aria-label={label}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
  </Button>
);

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const hasChildren = Boolean(category.items?.length);
  const Icon = category.icon ? EDUCATION_ICONS[category.icon] : null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setError("Nie można usunąć kategorii z podkategoriami");
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(category);
    } catch {
      setError("Nie udało się usunąć kategorii");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pl-4 select-none">
      <div className="flex items-center justify-between p-2 border hover:bg-gray-50 rounded">
        <div className="flex items-center cursor-pointer group" onClick={onToggle}>
          <div className="w-6 h-6 flex items-center justify-center rounded-full border hover:bg-gray-200 transition">
            {hasChildren && (expanded ? <Minus className="h-4 w-4 text-gray-500" /> : <Plus className="h-4 w-4 text-gray-500" />)}
          </div>
          <div className="flex items-center ml-2">
            {Icon && <Icon className="w-5 h-5 mr-2 text-gray-600" />}
            <span className="group-hover:text-gray-700">{category.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <EditCategoryDialog
            category={category}
            onEdit={onEdit}
            trigger={<ActionButton icon={Pencil} onClick={() => {}} label={`Edytuj kategorię ${category.name}`} />}
          />

          <AddCategoryDialog
            parentCategory={category}
            onAdd={onAdd}
            trigger={<ActionButton icon={Plus} onClick={() => {}} label={`Dodaj podkategorię do ${category.name}`} />}
          />

          <ActionButton
            icon={Trash2}
            onClick={handleDelete}
            disabled={hasChildren}
            loading={isDeleting}
            label={`Usuń kategorię ${category.name}`}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {expanded && hasChildren && category.items && (
        <div className="mt-2 space-y-2">
          {category.items.map((child) => (
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