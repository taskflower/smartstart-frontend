import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResourceDialogProps } from "@/types/moodle";

const ResourceSettingsDialog: React.FC<ResourceDialogProps> = ({
  open,
  onClose,
  resource,
}) => {
  if (!resource) return null;

  // Możemy wyświetlić różne pola w zależności od typu zasobu
  const renderResourceSpecificSettings = () => {
    switch (resource.type) {
      case "file":
        return (
          <div className="space-y-4">
            <div>
              <strong>Typ pliku:</strong>{" "}
              {/* Tu możesz dodać logikę wykrywania typu pliku */}
            </div>
            <div>
              <strong>Rozmiar:</strong>{" "}
              {/* Tu możesz dodać logikę rozmiaru pliku */}
            </div>
          </div>
        );
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <strong>URL:</strong> {resource.content}
            </div>
            <div>
              <strong>Otwórz w:</strong> nowej karcie
            </div>
          </div>
        );
      case "page":
        return (
          <div className="space-y-4">
            <div>
              <strong>Treść strony:</strong>
              <div className="mt-2 p-4 bg-gray-50 rounded">
                {resource.content}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ustawienia: {resource.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">{renderResourceSpecificSettings()}</div>

        <div className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceSettingsDialog;
