import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category } from "@/services/categoryService";

interface AddCategoryDialogProps {
  parentCategory?: Category;
  onAdd: (name: string, parentId?: string | null) => Promise<void>;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
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
        <Button variant="outline">
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