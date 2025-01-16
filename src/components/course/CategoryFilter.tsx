// src/components/course/CategoryFilter.tsx
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Category } from '@/services/categoryService';
import { cn } from '@/services/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  coursesInCategory: Record<string, number>;
}

interface CategoryNodeProps {
  category: Category;
  depth: number;
  selectedCategory: string | null;
  onSelect: (categoryId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  coursesCount: number;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  depth,
  selectedCategory,
  onSelect,
  isExpanded,
  onToggle,
  coursesCount
}) => {
  const hasChildren = category.items && category.items.length > 0;
  const isSelected = selectedCategory === category.id;
  
  return (
    <div className="py-1">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
          isSelected ? "bg-primary/10" : "hover:bg-accent",
          "cursor-pointer"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(category.id);
        }}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        {!hasChildren && <div className="w-4" />}
        <span className="flex-1 text-sm">{category.name}</span>
        {coursesCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {coursesCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  coursesInCategory
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategoryTree = (categories: Category[], depth = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <CategoryNode
          category={category}
          depth={depth}
          selectedCategory={selectedCategory}
          onSelect={onSelectCategory}
          isExpanded={expandedCategories.has(category.id)}
          onToggle={() => toggleCategory(category.id)}
          coursesCount={coursesInCategory[category.id] || 0}
        />
        {expandedCategories.has(category.id) && category.items && (
          <div>{renderCategoryTree(category.items, depth + 1)}</div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Kategorie</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
              selectedCategory === null ? "bg-primary/10" : "hover:bg-accent",
              "cursor-pointer"
            )}
            onClick={() => onSelectCategory(null)}
          >
            <div className="w-4" />
            <span className="flex-1 text-sm">Wszystkie</span>
            <Badge variant="secondary" className="text-xs">
              {Object.values(coursesInCategory).reduce((a, b) => a + b, 0)}
            </Badge>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            {renderCategoryTree(categories)}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;
