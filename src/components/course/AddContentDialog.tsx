import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Activity, Resource } from './types/course';

interface AddContentFormData {
  name: string;
  description?: string;
  content?: string;
  type: string;
}

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddActivity: (data: AddContentFormData) => void;
  onAddResource: (data: AddContentFormData) => void;
}

export const AddContentDialog: React.FC<AddContentDialogProps> = ({
  open,
  onOpenChange,
  onAddActivity,
  onAddResource
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj zawartość do sekcji</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Aktywność
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj aktywność</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  onAddActivity({
                    name: formData.get('name') as string,
                    type: formData.get('type') as Activity['type'],
                    description: formData.get('description') as string
                  });
                }}
                className="space-y-4"
              >
                <Input name="name" placeholder="Nazwa aktywności" required />
                <Select name="type" defaultValue="quiz">
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ aktywności" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Zadanie</SelectItem>
                    <SelectItem value="forum">Forum</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea name="description" placeholder="Opis" required />
                <Button type="submit">Dodaj aktywność</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Zasób
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj zasób</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  onAddResource({
                    name: formData.get('name') as string,
                    type: formData.get('type') as Resource['type'],
                    content: formData.get('content') as string
                  });
                }}
                className="space-y-4"
              >
                <Input name="name" placeholder="Nazwa zasobu" required />
                <Select name="type" defaultValue="page">
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ zasobu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">Plik</SelectItem>
                    <SelectItem value="url">Link</SelectItem>
                    <SelectItem value="page">Strona</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea name="content" placeholder="Zawartość lub URL" required />
                <Button type="submit">Dodaj zasób</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};