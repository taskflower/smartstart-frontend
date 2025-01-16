import { Outlet } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCourseGeneratorStore } from "@/stores/useCourseGeneratorStore";
import AuthLayout from "@/components/AuthLayout";
import PageHeader from "@/components/PageHeader";
import { Sparkles } from "lucide-react";

const CourseGenerator = () => {
  const currentStep = useCourseGeneratorStore((state) => state.currentStep);

  return (
    <AuthLayout>
      <PageHeader to="courses" title="Kursy" btn="Dodaj kurs" />

      <div className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Generator Kursu z AI
          </CardTitle>
          <CardDescription>
            Stwórz spersonalizowany kurs na podstawie podstawy programowej
          </CardDescription>
        </CardHeader>
        <Card mobile>
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 m-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === currentStep
                  ? "bg-primary"
                  : step < currentStep
                  ? "bg-primary/40"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </AuthLayout>
  );
};

export default CourseGenerator;
