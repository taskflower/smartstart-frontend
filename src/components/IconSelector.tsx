import React from 'react';
import { cn } from "@/services/utils";
import {
  Book,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  School,
  NotebookPen,
  PenTool,
  Pencil,
  Calculator,
  BrainCircuit,
  Atom,
  Binary,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Globe2,
  LanguagesIcon,
  Library,
  Lightbulb,
  Microscope,
  Music2,
  Palette,
  Pi,
  Puzzle,
  ScrollText,
  Speech,
  Trophy,
  Upload,
  Users,
  Video,
  type LucideIcon
} from 'lucide-react';

export const EDUCATION_ICONS: { [key: string]: LucideIcon } = {
  Book,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  School,
  NotebookPen,
  PenTool,
  Pencil,
  Calculator,
  BrainCircuit,
  Atom,
  Binary,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Globe2,
  Languages: LanguagesIcon,
  Library,
  Lightbulb,
  Microscope,
  Music2,
  Palette,
  Pi,
  Puzzle,
  ScrollText,
  Speech,
  Trophy,
  Upload,
  Users,
  Video
};

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (iconName: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto p-2">
      {Object.entries(EDUCATION_ICONS).map(([name, Icon]) => {
        const isSelected = selectedIcon === name;
        return (
          <button
            key={name}
            onClick={() => onSelectIcon(name)}
            className={cn(
              "p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 transition-colors",
              isSelected && "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-500"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs text-gray-600">{name}</span>
          </button>
        );
      })}
    </div>
  );
};