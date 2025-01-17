// AddCategoryDialog.tsx
import { Category } from "@/services/categoryService";
import { BaseCategoryDialog } from "./BaseCategoryDialog";

interface AddCategoryDialogProps {
  parentCategory?: Category;
  onAdd: (name: string, icon: string | null, parentId?: string | null) => Promise<void>;
  trigger: React.ReactElement;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  parentCategory,
  onAdd,
  trigger,
}) => (
  <BaseCategoryDialog
    title={parentCategory?.name ? `Dodaj podkategorię do "${parentCategory.name}"` : 'Dodaj nową kategorię'}
    description="Wypełnij poniższy formularz aby dodać kategorię"
    submitLabel="Dodaj kategorię"
    submittingLabel="Dodawanie..."
    onSubmit={(name, icon) => onAdd(name, icon, parentCategory?.id)}
    trigger={trigger}
  />
);