/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/course/ActivitySettingsDialog.tsx
import React, { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types/moodle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";

interface ActivitySettingsDialogProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
}

const ActivitySettingsDialog: React.FC<ActivitySettingsDialogProps> = ({
  open,
  onClose,
  activity
}) => {
  // Stan dla prostego formularza dodawania pytania
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  if (!activity) return null;

  // Funkcja obsługująca zapis nowego pytania
  const handleAddQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!activity.id || !questionText) return;

    try {
      await addDoc(collection(db, "questions"), {
        activity_id: activity.id,
        question_text: questionText,
        question_type: "multiple_choice",
        default_grade: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Przykładowo możesz też dodać od razu odpowiedź w innej kolekcji „answers”
      if (answerText.trim().length > 0) {
        // Tu ewentualne zapisy do kolekcji "answers"
      }

      // Wyczyść formularz
      setQuestionText("");
      setAnswerText("");
    } catch (err) {
      console.error("Błąd dodawania pytania:", err);
    }
  };

  const isQuiz = activity.type === "quiz";
  // Możesz wyświetlać wartości z activity.settings, jeśli to quiz
  const quizSettings = isQuiz
    ? (activity.settings as any) // Rzutowanie dowolne, bo w typach możesz mieć inne pola
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ustawienia: {activity.name}</DialogTitle>
        </DialogHeader>

        {/* Sekcja wyświetlania ustawień quizu */}
        {isQuiz ? (
          <div className="space-y-4">
            <div>
              <strong>Czas na rozwiązanie (minuty):</strong> {quizSettings.timeLimit || 60}
            </div>
            <div>
              <strong>Liczba podejść:</strong> {quizSettings.attemptsAllowed || 1}
            </div>
            <div>
              <strong>Próg zaliczenia (%):</strong> {quizSettings.passingGrade || 50}
            </div>
            <div>
              <strong>Tasowanie pytań:</strong>{" "}
              {quizSettings.shuffleQuestions ? "Tak" : "Nie"}
            </div>

            {/* Sekcja dodawania nowych pytań do quizu */}
            <hr className="my-4" />
            <form onSubmit={handleAddQuestion} className="space-y-2">
              <label className="block text-sm font-medium">
                Treść pytania:
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Opcjonalna odpowiedź:
                <Input
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                />
              </label>
              <Button type="submit">Dodaj pytanie</Button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Ta aktywność nie jest quizem, więc nie ma dodatkowych ustawień pytań.
          </p>
        )}

        <div className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivitySettingsDialog;
