import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CourseHeaderProps {
  courseName: string;
  courseDescription: string;
  error: string | null;
  onAddSection: (data: { name: string }) => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  courseName,
  courseDescription,
  error,
  onAddSection
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{courseName}</h1>
          <p className="text-gray-600">{courseDescription}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Dodaj sekcję
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nową sekcję</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                onAddSection({
                  name: formData.get('name') as string,
                });
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Nazwa sekcji" required />
              <Button type="submit">Dodaj sekcję</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CourseHeader;