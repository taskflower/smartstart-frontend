import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useCourseGeneratorStore } from "@/stores/useCourseGeneratorStore";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Step2 = () => {
  const navigate = useNavigate();
  const setCurrentStep = useCourseGeneratorStore(
    (state) => state.setCurrentStep
  );
  const courseData = useCourseGeneratorStore((state) => state.courseData);
  const setCourseData = useCourseGeneratorStore((state) => state.setCourseData);

  const handleNext = () => {
    setCurrentStep(3);
    navigate("/courses/generate/rag-materials");
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigate("/courses/generate/step1");
  };

  const handleDifficultyChange = (value: string) => {
    setCourseData({
      summary: {
        ...courseData.summary,
        difficulty: value,
      },
    });
  };

  const handleUseBaseChange = (checked: boolean) => {
    setCourseData({
      useBase: checked,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Label className="text-base">Poziom nauczania</Label>
        <RadioGroup
          value={courseData.summary.difficulty}
          onValueChange={handleDifficultyChange}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              value: "primary",
              icon: BookOpen,
              label: "Podstawowy",
            },
            {
              value: "middle",
              icon: Brain,
              label: "Średni",
            },
            {
              value: "advanced",
              icon: Rocket,
              label: "Zaawansowany",
            },
          ].map(({ value, icon: Icon, label }) => (
            <Label
              key={value}
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                courseData.summary.difficulty === value
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-transparent"
              }`}
            >
              <RadioGroupItem value={value} className="sr-only" />
              <Icon className="mb-2 h-6 w-6" />
              <span className="text-center">{label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label className="text-base">Podstawa programowa</Label>
          <p className="text-sm text-muted-foreground">
            Użyj oficjalnej podstawy programowej jako źródła wiedzy
          </p>
        </div>
        <Switch
          checked={courseData.useBase}
          onCheckedChange={handleUseBaseChange}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Wstecz
        </Button>
        <Button onClick={handleNext} disabled={!courseData.summary.difficulty}>
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default Step2;
