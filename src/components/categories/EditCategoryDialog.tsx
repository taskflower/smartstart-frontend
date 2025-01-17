// EditCategoryDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Category } from "@/services/categoryService";

import { Separator } from "@/components/ui/separator";
import { IconSelector } from "../IconSelector";

interface EditCategoryDialogProps {
  category: Category;
  onEdit: (
    categoryId: string,
    newName: string,
    newIcon: string | null
  ) => Promise<void>;
  trigger: React.ReactElement;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  onEdit,
  trigger,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(
    category.icon
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const newName = nameInput.value.trim();

    if (newName) {
      setIsSubmitting(true);
      try {
        await onEdit(category.id, newName, selectedIcon);
        setOpen(false);
      } catch (error) {
        console.error("Failed to edit category:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj kategorię</DialogTitle>
          <DialogDescription>
            Zmień nazwę lub ikonę kategorii &quot;{category.name}&quot;
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nazwa kategorii</Label>
              <Input
                className="mt-2"
                id="name"
                name="name"
                defaultValue={category.name}
                required
              />
            </div>

            <Separator />

            <div>
              <Label>Ikona kategorii (opcjonalnie)</Label>
              <div className="mt-2">
                <IconSelector
                  selectedIcon={selectedIcon}
                  onSelectIcon={setSelectedIcon}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setSelectedIcon(category.icon);
              }}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
