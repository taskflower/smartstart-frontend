import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Resource } from "@/types/moodle";

interface AddContentFormData {
  type: "quiz" | "assignment" | "forum" | "file" | "url" | "page";
  name: string;
  description?: string;
  content?: string;
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
  onAddResource,
}) => {
  const [activityData, setActivityData] = useState<AddContentFormData>({
    type: "quiz",
    name: "",
    description: "",
  });
  const [resourceData, setResourceData] = useState<AddContentFormData>({
    type: "file",
    name: "",
    content: "",
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    onAddActivity(activityData);
    setActivityData({ type: "quiz", name: "", description: "" });
    onOpenChange(false);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource(resourceData);
    setResourceData({ type: "file", name: "", content: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj zawartość do sekcji</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Wybierz, co chcesz dodać do tej sekcji: interaktywną aktywność lub zasób do pobrania lub przeglądania.
          </p>

          {/* Formularz dodawania aktywności */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Dodaj Interaktywną Aktywność
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj Interaktywną Aktywność</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Nazwa aktywności"
                  required
                  value={activityData.name}
                  onChange={(e) =>
                    setActivityData({ ...activityData, name: e.target.value })
                  }
                />
                <Select
                  value={activityData.type}
                  onValueChange={(value) =>
                    setActivityData({ ...activityData, type: value as Activity["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ aktywności" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Zadanie</SelectItem>
                    <SelectItem value="forum">Forum</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="description"
                  placeholder="Opis aktywności"
                  required
                  value={activityData.description}
                  onChange={(e) =>
                    setActivityData({
                      ...activityData,
                      description: e.target.value,
                    })
                  }
                />
                <Button type="submit">Dodaj interaktywną aktywność</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Formularz dodawania zasobu */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Dodaj Zasób
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj Zasób</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddResource} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Nazwa zasobu"
                  required
                  value={resourceData.name}
                  onChange={(e) =>
                    setResourceData({ ...resourceData, name: e.target.value })
                  }
                />
                <Select
                  value={resourceData.type}
                  onValueChange={(value) =>
                    setResourceData({ ...resourceData, type: value as Resource["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ zasobu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">Plik</SelectItem>
                    <SelectItem value="url">Link</SelectItem>
                    <SelectItem value="page">Strona</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  name="content"
                  placeholder="Treść lub URL zasobu"
                  required
                  value={resourceData.content}
                  onChange={(e) =>
                    setResourceData({
                      ...resourceData,
                      content: e.target.value,
                    })
                  }
                />
                <Button type="submit">Dodaj zasób</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};
