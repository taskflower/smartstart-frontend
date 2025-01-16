// src/components/courses/Pagination.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Poprzednia
      </Button>
      <span className="text-sm text-gray-700">
        Strona {currentPage} z {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Następna
      </Button>
    </div>
  );
};

export default Pagination;
