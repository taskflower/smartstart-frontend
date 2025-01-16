import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  title: string;
}

const PageLoader: React.FC<LoaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Loader2 className="h-4 w-4  animate-spin" />
      <div className="text-sm">{title}</div>
    </div>
  );
};

export default PageLoader;
