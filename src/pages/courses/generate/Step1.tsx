import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Brain, Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SCHOOL_SUBJECTS } from "@/constants/schoolSubjects";
import { useCourseGeneratorStore } from "@/stores/useCourseGeneratorStore";
import { useNavigate } from "react-router-dom";

const Step1 = () => {
  const navigate = useNavigate();
  const setCurrentStep = useCourseGeneratorStore(
    (state) => state.setCurrentStep
  );
  const courseData = useCourseGeneratorStore((state) => state.courseData);
  const setCourseData = useCourseGeneratorStore((state) => state.setCourseData);

  const handleNext = () => {
    setCurrentStep(2);
    navigate("/courses/generate/step2");
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigate("/courses/generate/step1");
  };

  const handleSchoolChange = (value: string) => {
    setCourseData({
      school: value,
      subject: "",
    });
  };

  const handleSubjectChange = (value: string) => {
    setCourseData({
      subject: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Typ szkoły */}
      <div className="grid gap-4">
        <Label className="text-base">Typ szkoły</Label>
        <RadioGroup
          value={courseData.school}
          onValueChange={handleSchoolChange}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              value: "primary-early",
              icon: BookOpen,
              label: "Szkoła podstawowa I–III",
            },
            {
              value: "primary-late",
              icon: Brain,
              label: "Szkoła podstawowa IV-VIII",
            },
            {
              value: "secondary",
              icon: Rocket,
              label: "Liceum ogólnokształcące i technikum",
            },
          ].map(({ value, icon: Icon, label }) => (
            <Label
              key={value}
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                courseData.school === value
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

      {/* Przedmiot */}
      {courseData.school && (
        <div className="grid gap-4">
          <Label className="text-base">Przedmiot</Label>
          <RadioGroup
            value={courseData.subject}
            onValueChange={handleSubjectChange}
            className="grid grid-cols-3 gap-4"
          >
            {SCHOOL_SUBJECTS[
              courseData.school as keyof typeof SCHOOL_SUBJECTS
            ].map((subject) => (
              <Label
                key={subject}
                className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${
                  courseData.subject === subject
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-transparent"
                }`}
              >
                <RadioGroupItem value={subject} className="sr-only" />
                <span className="text-center">{subject}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      <Separator className="my-6" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Wstecz
        </Button>
        <Button
          onClick={handleNext}
          disabled={!courseData.school || !courseData.subject}
        >
          Dalej
        </Button>
      </div>
    </div>
  );
};

export default Step1;
