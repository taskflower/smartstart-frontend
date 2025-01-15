import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Eye, EyeOff, GripVertical, Book, File, MessageSquare, Link2 } from "lucide-react";
import type { Activity, Resource } from './types/course';

interface ContentItemBaseProps {
  name: string;
  visible: boolean;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
}

export const ActivityItem: React.FC<ContentItemBaseProps & { type: Activity['type'] }> = ({
  name,
  type,
  visible,
  onToggleVisibility,
  onOpenSettings
}) => {
  const getIcon = () => {
    switch (type) {
      case 'quiz': return <Book className="h-4 w-4" />;
      case 'assignment': return <File className="h-4 w-4" />;
      case 'forum': return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <GripVertical className="h-4 w-4 text-gray-400" />
        {getIcon()}
        <span>{name}</span>
        <span className="text-xs text-gray-500">({type})</span>
      </div>
      <ContentItemActions 
        visible={visible}
        onToggleVisibility={onToggleVisibility}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
};

export const ResourceItem: React.FC<ContentItemBaseProps & { type: Resource['type'] }> = ({
  name,
  type,
  visible,
  onToggleVisibility,
  onOpenSettings
}) => {
  const getIcon = () => {
    switch (type) {
      case 'file': return <File className="h-4 w-4" />;
      case 'url': return <Link2 className="h-4 w-4" />;
      case 'page': return <Book className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <GripVertical className="h-4 w-4 text-gray-400" />
        {getIcon()}
        <span>{name}</span>
        <span className="text-xs text-gray-500">({type})</span>
      </div>
      <ContentItemActions 
        visible={visible}
        onToggleVisibility={onToggleVisibility}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
};

interface ContentItemActionsProps {
  visible: boolean;
  onToggleVisibility: () => void;
  onOpenSettings: () => void;
}

const ContentItemActions: React.FC<ContentItemActionsProps> = ({
  visible,
  onToggleVisibility,
  onOpenSettings
}) => {
  return (
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
  );
};