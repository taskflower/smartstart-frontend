// src/components/course/ContentItem.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Eye, EyeOff, GripVertical, Book, File, MessageSquare, Link2 } from "lucide-react";
import { Activity, Resource } from '@/types/moodle';

interface ContentItemProps {
  id: string;
  name: string;
  type: Activity['type'] | Resource['type'];
  visible: boolean;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
}

const getIcon = (type: Activity['type'] | Resource['type']) => {
  switch (type) {
    case 'quiz': return <Book className="h-4 w-4" />;
    case 'assignment': return <File className="h-4 w-4" />;
    case 'forum': return <MessageSquare className="h-4 w-4" />;
    case 'file': return <File className="h-4 w-4" />;
    case 'url': return <Link2 className="h-4 w-4" />;
    case 'page': return <Book className="h-4 w-4" />;
    default: return <File className="h-4 w-4" />;
  }
};

const ContentItem: React.FC<ContentItemProps> = ({
  name,
  type,
  visible,
  onToggleVisibility,
  onOpenSettings
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <GripVertical className="h-4 w-4 text-gray-400" />
        {getIcon(type)}
        <span>{name}</span>
        <span className="text-xs text-gray-500">({type})</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentItem;