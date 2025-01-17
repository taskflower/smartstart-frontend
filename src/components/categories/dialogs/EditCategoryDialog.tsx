import { Category } from "@/services/categoryService";
import { BaseCategoryDialog } from "./BaseCategoryDialog";

// EditCategoryDialog.tsx
interface EditCategoryDialogProps {
  category: Category;
  onEdit: (categoryId: string, newName: string, newIcon: string | null) => Promise<void>;
  trigger: React.ReactElement;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  onEdit,
  trigger,
}) => (
  <BaseCategoryDialog
    title="Edytuj kategorię"
    description={`Zmień nazwę lub ikonę kategorii "${category.name}"`}
    initialName={category.name}
    initialIcon={category.icon}
    submitLabel="Zapisz zmiany"
    submittingLabel="Zapisywanie..."
    onSubmit={(name, icon) => onEdit(category.id, name, icon)}
    trigger={trigger}
  />
);