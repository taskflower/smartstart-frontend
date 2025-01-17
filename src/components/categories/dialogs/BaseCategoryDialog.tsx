  import React, { useState } from "react";
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
  import { Separator } from "@/components/ui/separator";
  import { IconSelector } from "../../IconSelector";

  interface BaseCategoryDialogProps {
    title: string;
    description: string;
    initialName?: string;
    initialIcon?: string | null;
    submitLabel: string;
    submittingLabel: string;
    onSubmit: (name: string, icon: string | null) => Promise<void>;
    trigger: React.ReactElement;
  }

  export const BaseCategoryDialog: React.FC<BaseCategoryDialogProps> = ({
    title,
    description,
    initialName = "",
    initialIcon = null,
    submitLabel,
    submittingLabel,
    onSubmit,
    trigger,
  }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(initialIcon);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value.trim();
      
      if (name) {
        setIsSubmitting(true);
        try {
          await onSubmit(name, selectedIcon);
          setOpen(false);
          if (!initialName) {
            e.currentTarget.reset();
            setSelectedIcon(null);
          }
        } catch (error) {
          console.error('Failed to submit:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const handleCancel = () => {
      setOpen(false);
      setSelectedIcon(initialIcon);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nazwa kategorii</Label>
                <Input
                  className="mt-2"
                  id="name"
                  name="name"
                  defaultValue={initialName}
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
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };