import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  to: string;
  title: string;
  btn: string;
  ai?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ to, title, btn, ai=true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center gap-2">
      <h1 className="text-2xl font-bold flex-1">{title}</h1>
      <Button onClick={() => navigate(`/${to}/create`)}>
        <Plus className="mr-2 h-4 w-4" /> {btn}
      </Button>
      {ai && <Button variant={"outline"} onClick={() => navigate(`/${to}/generate`)}>
        <Sparkles className="mr-2 h-4 w-4" /> Generuj
      </Button>}
    </div>
  );
};

export default PageHeader;
