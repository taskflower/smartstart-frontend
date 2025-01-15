import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthLayout from "@/components/AuthLayout";

type Step = {
  id: number;
  title: string;
  completed: boolean;
};

type CourseSuggestion = {
  id: string;
  name: string;
  match: number; // w %
  description: string;
};

export default function CareerPathPage() {
  const [goal, setGoal] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Uzupełnij profil zawodowy", completed: false },
    { id: 2, title: "Przejdź kurs Programowania w JS", completed: false },
    { id: 3, title: "Zbuduj portfolio projektów", completed: false },
  ]);

  const [courses] = useState<CourseSuggestion[]>([
    {
      id: "1",
      name: "Zaawansowany JavaScript",
      match: 87,
      description: "Poznaj głębokie tajniki JS i Node.",
    },
    {
      id: "2",
      name: "Nowoczesny React",
      match: 73,
      description: "Praktyczne podejście do React i TypeScript.",
    },
    {
      id: "3",
      name: "Algorytmy i struktury danych",
      match: 60,
      description: "Solidne podstawy inżynierii oprogramowania.",
    },
  ]);

  // Obliczamy % postępu ścieżki w oparciu o zrobione kroki
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  const toggleStep = (id: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  return (
    <AuthLayout>
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Moja Podróż do Celu</h1>

      {/* KARTA: Cel i deklaracja */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Określ swój cel</CardTitle>
          <CardDescription>
            Powiedz nam, kim chcesz zostać i pozwól AI przygotować plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="goal">Twój główny cel</Label>
          <Textarea
            id="goal"
            placeholder="Np. Chcę zostać Full-stack Developerem w Google..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert(`Zapisano cel: ${goal}`)}>
            Zapisz cel
          </Button>
        </CardFooter>
      </Card>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* KARTA: Rekomendacje AI */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Rekomendacje AI</CardTitle>
            <CardDescription>
              Dopasowane do Twojego celu w {goal ? `„${goal}”` : "…"}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-64 px-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="py-4 border-b last:border-none flex items-start justify-between"
                >
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                  <Badge variant="outline">{course.match}%</Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Zobacz więcej propozycji
            </Button>
          </CardFooter>
        </Card>

        {/* KARTA: Plan działania */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Plan działania</CardTitle>
            <CardDescription>Kroki do realizacji Twojego celu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Postęp: {progress}%
              </p>
              <Progress value={progress} className="w-full" />
            </div>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 border rounded-md flex items-center justify-between"
                >
                  <div
                    className={`${
                      step.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {step.title}
                  </div>
                  <Button
                    variant={step.completed ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleStep(step.id)}
                  >
                    {step.completed ? (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        Gotowe
                      </>
                    ) : (
                      "Oznacz"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onClick={() => alert("Dodaj nowy krok...")}>
              Dodaj krok
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
     </AuthLayout>
  );
}
