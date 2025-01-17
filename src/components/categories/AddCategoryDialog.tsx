// AddCategoryDialog.tsx
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

interface AddCategoryDialogProps {
  parentCategory?: Category;
  onAdd: (name: string, icon: string | null, parentId?: string | null) => Promise<void>;
  trigger: React.ReactElement;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  parentCategory,
  onAdd,
  trigger,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput.value.trim();
    
    if (name) {
      setIsSubmitting(true);
      try {
        await onAdd(name, selectedIcon, parentCategory?.id);
        setOpen(false);
        form.reset();
        setSelectedIcon(null);
      } catch (error) {
        console.error('Failed to add category:', error);
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
          <DialogTitle>
            Dodaj {parentCategory?.name ? `podkategorię do "${parentCategory.name}"` : 'nową kategorię'}
          </DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz aby dodać kategorię
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
                placeholder="Wpisz nazwę kategorii"
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
                setSelectedIcon(null);
              }}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Dodawanie..." : "Dodaj kategorię"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};