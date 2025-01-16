import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MoveRight, Clock, Book, School, Target, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_RESULT } from '@/constants/mockResult';
import { useCourseGeneratorStore } from '@/stores/useCourseGeneratorStore';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const courseData = useCourseGeneratorStore((state) => state.courseData);
  const reset = useCourseGeneratorStore((state) => state.reset);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleNewGenerate = async () => {
    setIsGenerating(true);
    try {
      reset();
      navigate('/courses/generate/step1');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-semibold">Wygenerowany Kurs</h2>
      </div>
      
     
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{MOCK_RESULT.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{MOCK_RESULT.description}</p>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {MOCK_RESULT.summary.totalDuration}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Course Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Book className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Przedmiot</p>
                  <p className="font-medium">{courseData.subject}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <School className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Informacje ogólne</p>
                  <div className="space-y-1">
                    <p className="text-sm">Typ szkoły: <span className="font-medium">{courseData.school}</span></p>
                    <p className="text-sm">Poziom: <span className="font-medium">{courseData.summary.difficulty}</span></p>
                    <p className="text-sm">Podstawa programowa: <span className="font-medium">{courseData.useBase ? "Tak" : "Nie"}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Requirements & Assessment */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wymagania wstępne</p>
                  <ul className="mt-1 space-y-1">
                    {MOCK_RESULT.summary.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClipboardCheck className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Metody oceny</p>
                  <ul className="mt-1 space-y-1">
                    {MOCK_RESULT.summary.assessment.map((method, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary"></span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="grid gap-4">
            {MOCK_RESULT.topics.map((topic, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-lg">{topic.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {topic.duration}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Cele:</h5>
                    <ul className="grid gap-1">
                      {topic.objectives.map((obj, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="h-1 w-1 rounded-full bg-primary mt-2"></span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
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

          <Button
            className="w-full"
            onClick={handleNewGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generowanie...' : 'Generuj nowy kurs'}
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
     
    </div>
  );
};

export default Result;