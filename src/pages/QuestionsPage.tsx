import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Question, QuestionType, Course, Section } from "../types/moodle";
import AuthLayout from "../components/AuthLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    course_id: "",
    section_id: "",
    category_id: "",
    type: "multiple_choice" as QuestionType,
    question_text: "",
    default_grade: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsSnapshot, coursesSnapshot, sectionsSnapshot] = await Promise.all([
          getDocs(collection(db, "questions")),
          getDocs(collection(db, "courses")),
          getDocs(collection(db, "sections")),
        ]);

        const questionsData = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setQuestions(questionsData);

        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);

        const sectionsData = sectionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Section[];
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to add proper error handling here
      }
    };

    fetchData();
  }, []);

  const handleAddQuestion = async () => {
    if (
      !newQuestion.course_id ||
      !newQuestion.section_id ||
      !newQuestion.question_text
    ) {
      alert("Wypełnij wszystkie pola");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        ...newQuestion,
        created_at: new Date(),
        updated_at: new Date(),
      });

      setIsAdding(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Wystąpił błąd podczas dodawania pytania");
    }
  };

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Bank pytań</h1>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Dodaj pytanie
          </Button>
        </div>

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
                  setNewQuestion({ ...newQuestion, question_text: e.target.value })
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
              <Button
                variant="outline"
                onClick={() => navigate(`/questions/${question.id}/answers`)}
              >
                Zarządzaj odpowiedziami
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}