import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Rocket, Sparkles, CheckCircle2, MoveRight } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import PageHeader from "@/components/PageHeader";

// Stałe
const MOCK_RESULT = {
  title: "Kurs matematyki - Algebra liniowa",
  description:
    "Kurs przygotowany zgodnie z podstawą programową dla szkół ponadpodstawowych",
  topics: [
    {
      title: "Wprowadzenie do układów równań",
      duration: "2 godziny",
      materials: ["Prezentacja", "Ćwiczenia", "Quiz"],
      objectives: [
        "Zrozumienie podstaw algebry liniowej",
        "Umiejętność rozwiązywania prostych układów równań",
      ],
    },
    {
      title: "Metoda eliminacji Gaussa",
      duration: "3 godziny",
      materials: ["Wykład", "Zadania praktyczne", "Test"],
      objectives: [
        "Poznanie metody eliminacji Gaussa",
        "Rozwiązywanie złożonych układów równań",
      ],
    },
    {
      title: "Wyznaczniki macierzy",
      duration: "2.5 godziny",
      materials: ["Materiały teoretyczne", "Przykłady", "Sprawdzian"],
      objectives: [
        "Obliczanie wyznaczników",
        "Zastosowanie wyznaczników w praktyce",
      ],
    },
  ],
  summary: {
    totalDuration: "7.5 godziny",
    difficulty: "Średniozaawansowany",
    requirements: ["Podstawy algebry", "Znajomość funkcji liniowych"],
    assessment: [
      "Quizy po każdym module",
      "Test końcowy",
      "Projekt praktyczny",
    ],
  },
};

const SCHOOL_SUBJECTS = {
  "primary-early": [
    "Edukacja wczesnoszkolna",
    "Język obcy",
    "Wychowanie fizyczne",
  ],
  "primary-late": [
    "Język polski",
    "Matematyka",
    "Historia",
    "Przyroda",
    "Geografia",
    "Biologia",
    "Chemia",
    "Fizyka",
    "Informatyka",
  ],
  secondary: [
    "Język polski",
    "Matematyka",
    "Historia",
    "Wiedza o społeczeństwie",
    "Geografia",
    "Biologia",
    "Chemia",
    "Fizyka",
    "Informatyka",
  ],
};

const CourseGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [useBase, setUseBase] = useState(true);
  const [level, setLevel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    try {
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(i);
      }
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showResult) {
    return (
      <AuthLayout>
        <PageHeader to="courses" title="Kursy" btn="Dodaj kurs" />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Wygenerowany Kurs
            </CardTitle>
            <CardDescription>{MOCK_RESULT.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{MOCK_RESULT.title}</h3>

              <div className="grid gap-4">
                {MOCK_RESULT.topics.map((topic, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-lg">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Czas trwania: {topic.duration}
                      </p>

                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Cele:</h5>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                          {topic.objectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {topic.materials.map((material, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-secondary px-2 py-1 rounded"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Podsumowanie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label>Całkowity czas trwania</Label>
                      <p className="text-sm">
                        {MOCK_RESULT.summary.totalDuration}
                      </p>
                    </div>
                    <div>
                      <Label>Poziom trudności</Label>
                      <p className="text-sm">
                        {MOCK_RESULT.summary.difficulty}
                      </p>
                    </div>
                    <div>
                      <Label>Wymagania wstępne</Label>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        {MOCK_RESULT.summary.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label>Metody oceny</Label>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        {MOCK_RESULT.summary.assessment.map((method, idx) => (
                          <li key={idx}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setShowResult(false);
                setCurrentStep(1);
                setSchool("");
                setSubject("");
                setLevel("");
              }}
            >
              Generuj nowy kurs
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <PageHeader to="courses" title="Kursy" btn="Dodaj kurs" />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Generator Kursu z AI
          </CardTitle>
          <CardDescription>
            Stwórz spersonalizowany kurs na podstawie podstawy programowej
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={`step${currentStep}`} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="step1"
                onClick={() => setCurrentStep(1)}
                disabled={isGenerating}
              >
                Podstawowe
              </TabsTrigger>
              <TabsTrigger
                value="step2"
                onClick={() => setCurrentStep(2)}
                disabled={isGenerating || !level}
              >
                Zawartość
              </TabsTrigger>
              <TabsTrigger
                value="step3"
                onClick={() => setCurrentStep(3)}
                disabled={isGenerating || !school || !subject}
              >
                Podsumowanie
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Poziom nauczania</Label>
                  <RadioGroup
                    value={level}
                    onValueChange={setLevel}
                    className="grid grid-cols-3 gap-4"
                  >
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="primary" className="sr-only" />
                      <BookOpen className="mb-2 h-6 w-6" />
                      Podstawowy
                    </Label>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="middle" className="sr-only" />
                      <Brain className="mb-2 h-6 w-6" />
                      Średni
                    </Label>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="advanced" className="sr-only" />
                      <Rocket className="mb-2 h-6 w-6" />
                      Zaawansowany
                    </Label>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Podstawa programowa</Label>
                    <CardDescription>
                      Użyj oficjalnej podstawy programowej jako źródła wiedzy
                    </CardDescription>
                  </div>
                  <Switch checked={useBase} onCheckedChange={setUseBase} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step2">
              <div className="space-y-6">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Wybór zakresu materiału</AlertTitle>
                  <AlertDescription>Wybierz etap edukacyjny.</AlertDescription>
                </Alert>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label>Typ szkoły</Label>
                    <RadioGroup
                      value={school}
                      onValueChange={(val) => {
                        setSchool(val);
                        setSubject("");
                      }}
                      className="grid grid-cols-3 gap-4"
                    >
                      <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem
                          value="primary-early"
                          className="sr-only"
                        />
                        <BookOpen className="mb-2 h-6 w-6" />
                        <span className="text-center">
                          Szkoła podstawowa I–III
                        </span>
                      </Label>
                      <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem
                          value="primary-late"
                          className="sr-only"
                        />
                        <Brain className="mb-2 h-6 w-6" />
                        <span className="text-center">
                          Szkoła podstawowa IV-VIII
                        </span>
                      </Label>
                      <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem value="secondary" className="sr-only" />
                        <Rocket className="mb-2 h-6 w-6" />
                        <span className="text-center">
                          Liceum ogólnokształcące i technikum
                        </span>
                      </Label>
                    </RadioGroup>
                  </div>

                  {school && (
                    <div className="grid gap-2">
                      <Label>Przedmiot</Label>
                      <RadioGroup
                        value={subject}
                        onValueChange={setSubject}
                        className="grid grid-cols-3 gap-4"
                      >
                       {SCHOOL_SUBJECTS[school as keyof typeof SCHOOL_SUBJECTS].map((subj) => (
                          <Label
                            key={subj}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <RadioGroupItem value={subj} className="sr-only" />
                            {subj}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step3">
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Gotowy do generowania</AlertTitle>
                  <AlertDescription>
                    Sprawdź wybrane opcje i rozpocznij generowanie kursu.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Poziom:
                    </span>
                    <span className="text-sm font-medium">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Szkoła:
                    </span>
                    <span className="text-sm font-medium">{school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Przedmiot:
                    </span>
                    <span className="text-sm font-medium">{subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Podstawa programowa:
                    </span>
                    <span className="text-sm font-medium">
                      {useBase ? "Tak" : "Nie"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-6">
            {!isGenerating && (
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step === currentStep
                        ? "bg-primary"
                        : step < currentStep
                        ? "bg-primary/40"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}

            {isGenerating ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  Generowanie kursu... {progress}%
                </p>
              </div>
            ) : (
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex-1"
                  >
                    Wstecz
                  </Button>
                )}
                <Button
                  className="flex-1"
                  size={"lg"}
                  onClick={() => {
                    if (currentStep === 3) {
                      handleGenerate();
                    } else {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                  disabled={
                    (currentStep === 1 && !level) ||
                    (currentStep === 2 && (!school || !subject)) ||
                    isGenerating
                  }
                >
                  {currentStep === 3 ? "Generuj" : "Dalej"}
                  <MoveRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default CourseGenerator;
