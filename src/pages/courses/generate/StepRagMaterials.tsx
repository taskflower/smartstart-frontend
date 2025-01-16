// src/pages/courses/generate/StepRagMaterials.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useCourseGeneratorStore } from "@/stores/useCourseGeneratorStore";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const MOCK_MATERIALS = [
  {
    id: 'pp1',
    title: 'Podstawa programowa - Matematyka (Szkoła średnia)',
    type: 'podstawa',
    isRequired: true,
    isSelected: true
  },
  {
    id: 'met1',
    title: 'Metody nauczania algebry w szkole średniej',
    type: 'metodyka',
    isRequired: false,
    isSelected: false
  },
  {
    id: 'zad1',
    title: 'Zbiór zadań - Układy równań',
    type: 'zadania',
    isRequired: false,
    isSelected: false
  },
];

const StepRagMaterials = () => {
  const navigate = useNavigate();
  const setCurrentStep = useCourseGeneratorStore((state) => state.setCurrentStep);
  const [materials, setMaterials] = React.useState(MOCK_MATERIALS);

  const handleMaterialToggle = (id: string) => {
    setMaterials(materials.map(material => 
      material.id === id && !material.isRequired 
        ? { ...material, isSelected: !material.isSelected }
        : material
    ));
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/courses/generate/step3');
  };

  const handleBack = () => {
    setCurrentStep(2);
    navigate('/courses/generate/step2');
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Wybierz materiały do generowania kursu</Label>
        <p className="text-sm text-muted-foreground">
          Zaznacz materiały, które mają być użyte jako kontekst do generowania kursu
        </p>
      </div>

      <div className="space-y-4">
        {materials.map((material) => (
          <Card 
            key={material.id}
            className={`transition-colors ${material.isSelected ? 'border-primary' : ''}`}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <Checkbox 
                checked={material.isSelected} 
                disabled={material.isRequired}
                onCheckedChange={() => handleMaterialToggle(material.id)}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{material.title}</span>
                  {material.isRequired && (
                    <Badge variant="outline">Wymagane</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground capitalize">
                  {material.type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Wstecz
        </Button>
        <Button onClick={handleNext}>
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default StepRagMaterials;