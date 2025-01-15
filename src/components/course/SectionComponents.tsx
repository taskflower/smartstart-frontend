import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import type { Section } from './types/course';

interface SectionHeaderProps {
  name: string;
  visible: boolean;
  onToggleVisibility: () => void;
  onAddContent: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  name,
  visible,
  onToggleVisibility,
  onAddContent
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="flex items-center">
        <GripVertical className="mr-2 h-4 w-4 text-gray-400" />
        <span>{name}</span>
      </CardTitle>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
        <Button variant="outline" onClick={onAddContent}>
          Dodaj zawartość
        </Button>
      </div>
    </CardHeader>
  );
};

interface SectionContentProps {
  children: React.ReactNode;
}

export const SectionContent: React.FC<SectionContentProps> = ({ children }) => {
  return (
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  );
};

interface SectionCardProps extends Section {
  onToggleVisibility: () => void;
  onAddContent: () => void;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  name,
  visible,
  onToggleVisibility,
  onAddContent,
  children
}) => {
  return (
    <Card className="shadow-sm">
      <SectionHeader
        name={name}
        visible={visible}
        onToggleVisibility={onToggleVisibility}
        onAddContent={onAddContent}
      />
      <SectionContent>
        {children}
      </SectionContent>
    </Card>
  );
};