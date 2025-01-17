// src/components/course/list/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">Nie znaleziono żadnych kursów</p>
      <Button onClick={() => navigate("/courses/create")}>
        <Plus className="mr-2 h-4 w-4" /> Dodaj pierwszy kurs
      </Button>
    </div>
  );
};