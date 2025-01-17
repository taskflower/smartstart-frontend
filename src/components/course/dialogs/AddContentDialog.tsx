import React, { useState } from "react";
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
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddActivityData, AddResourceData, Activity, Resource } from "@/types/moodle";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddActivity: (data: AddActivityData) => void;
  onAddResource: (data: AddResourceData) => void;
}

export const AddContentDialog: React.FC<AddContentDialogProps> = ({
  open,
  onOpenChange,
  onAddActivity,
  onAddResource,
}) => {
  // Osobne stany dla aktywności i zasobów
  const [showingForm, setShowingForm] = useState<'none' | 'activity' | 'resource'>('none');
  
  const [activityData, setActivityData] = useState<AddActivityData>({
    type: "quiz",
    name: "",
    description: "",
  });

  const [resourceData, setResourceData] = useState<AddResourceData>({
    type: "file",
    name: "",
    content: "",
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    onAddActivity(activityData);
    resetForms();
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource(resourceData);
    resetForms();
  };

  const resetForms = () => {
    setShowingForm('none');
    setActivityData({ type: "quiz", name: "", description: "" });
    setResourceData({ type: "file", name: "", content: "" });
    onOpenChange(false);
  };

  const renderActivityForm = () => (
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
        onValueChange={(value: Activity["type"]) =>
          setActivityData({ ...activityData, type: value })
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
      <div className="flex space-x-2">
        <Button type="submit">Dodaj</Button>
        <Button type="button" variant="outline" onClick={() => setShowingForm('none')}>
          Anuluj
        </Button>
      </div>
    </form>
  );

  const renderResourceForm = () => (
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
        onValueChange={(value: Resource["type"]) =>
          setResourceData({ ...resourceData, type: value })
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
      <div className="flex space-x-2">
        <Button type="submit">Dodaj</Button>
        <Button type="button" variant="outline" onClick={() => setShowingForm('none')}>
          Anuluj
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj zawartość do sekcji</DialogTitle>
        </DialogHeader>
        
        {showingForm === 'none' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Wybierz, co chcesz dodać do tej sekcji:
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowingForm('activity')}
              >
                <Plus className="mr-2 h-4 w-4" /> Dodaj Interaktywną Aktywność
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowingForm('resource')}
              >
                <Plus className="mr-2 h-4 w-4" /> Dodaj Zasób
              </Button>
            </div>
          </div>
        ) : showingForm === 'activity' ? (
          renderActivityForm()
        ) : (
          renderResourceForm()
        )}
      </DialogContent>
    </Dialog>
  );
};