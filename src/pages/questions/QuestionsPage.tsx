// src/pages/QuestionsPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Question, Course, Section, CreateQuestionData } from "@/types/moodle";
import AuthLayout from "@/components/AuthLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  fetchQuestions,
  addQuestion,
  deleteQuestionWithAnswers,
} from "@/services/questionService";
import { fetchAllCourses } from "@/services/course/courseQueries";
import { fetchSections } from "@/services/course/sectionQueries";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState<CreateQuestionData>({
    course_id: "",
    section_id: "",
    type: "multiple_choice",
    question_type: "multiple_choice",
    question_text: "",
    default_grade: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [questionsData, coursesData] = await Promise.all([
          fetchQuestions(),
          fetchAllCourses(),
        ]);

        setQuestions(questionsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Wystąpił błąd podczas ładowania danych");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      if (!newQuestion.course_id) return;

      try {
        const sectionsData = await fetchSections(newQuestion.course_id);
        setSections(sectionsData);
      } catch (error) {
        console.error("Error loading sections:", error);
        setError("Wystąpił błąd podczas ładowania sekcji");
      }
    };

    loadSections();
  }, [newQuestion.course_id]);

  const handleAddQuestion = async () => {
    if (
      !newQuestion.course_id ||
      !newQuestion.section_id ||
      !newQuestion.question_text
    ) {
      setError("Wypełnij wszystkie pola");
      return;
    }

    try {
      await addQuestion(newQuestion);
      setIsAdding(false);
      // Odświeżamy listę pytań
      const updatedQuestions = await fetchQuestions();
      setQuestions(updatedQuestions);
      setError(null);
    } catch (error) {
      console.error("Error adding question:", error);
      setError("Wystąpił błąd podczas dodawania pytania");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestionWithAnswers(questionId);
      // Odświeżamy listę pytań po usunięciu
      const updatedQuestions = await fetchQuestions();
      setQuestions(updatedQuestions);
      setError(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("Wystąpił błąd podczas usuwania pytania");
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-8">Ładowanie...</div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Bank pytań</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj pytanie
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="mb-6 p-4 border rounded">
          <div className="space-y-4">
            <Select
              value={newQuestion.course_id}
              onValueChange={(value) =>
                setNewQuestion({ ...newQuestion, course_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz kurs" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={newQuestion.section_id}
              onValueChange={(value) =>
                setNewQuestion({ ...newQuestion, section_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz sekcję" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Treść pytania"
              value={newQuestion.question_text}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question_text: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
              <Button onClick={handleAddQuestion}>Zapisz</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Anuluj
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>{question.question_text}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/questions/${question.id}/answers`)}
              >
                Zarządzaj odpowiedziami
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AuthLayout>
  );
}
