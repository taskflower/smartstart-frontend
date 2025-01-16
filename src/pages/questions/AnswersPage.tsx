// src/pages/AnswersPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from '@/components/AuthLayout';
import { 
  fetchQuestion, 
  fetchAnswers, 
  addAnswer 
} from '@/services/questionService';
import { Question, Answer } from '@/types/moodle';

export default function AnswersPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const initialAnswerState = {
    answer_text: '',
    fraction: 0,
    feedback: '',
    created_at: new Date(),
    updated_at: new Date()
  };
  
  const [newAnswer, setNewAnswer] = useState(initialAnswerState);

  useEffect(() => {
    const loadData = async () => {
      if (!questionId) return;

      try {
        setIsLoading(true);
        const [questionData, answersData] = await Promise.all([
          fetchQuestion(questionId),
          fetchAnswers(questionId)
        ]);

        if (questionData) {
          setQuestion(questionData);
          setAnswers(answersData);
        } else {
          setError("Nie znaleziono pytania");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Wystąpił błąd podczas ładowania danych");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [questionId]);

  const handleAddAnswer = async () => {
    if (!questionId || !newAnswer.answer_text) {
      setError("Wypełnij treść odpowiedzi");
      return;
    }

    try {
      const response = await addAnswer(questionId, newAnswer);
      setAnswers(prev => [...prev, response]);
      setNewAnswer(initialAnswerState);
      setError(null);
    } catch (error) {
      console.error("Error adding answer:", error);
      setError("Wystąpił błąd podczas dodawania odpowiedzi");
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-8">Ładowanie...</div>
      </AuthLayout>
    );
  }

  if (!question) {
    return (
      <AuthLayout>
        <div className="p-8">
          {error || "Nie znaleziono pytania"}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
     
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Odpowiedzi</h1>
          <p className="text-gray-600 mt-2">{question.question_text}</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-4">
          <Input
            placeholder="Treść odpowiedzi"
            value={newAnswer.answer_text}
            onChange={(e) => setNewAnswer({...newAnswer, answer_text: e.target.value})}
          />
          <Input
            type="number"
            placeholder="Procent poprawności (0-100)"
            value={newAnswer.fraction}
            onChange={(e) => setNewAnswer({...newAnswer, fraction: Number(e.target.value)})}
          />
          <Input
            placeholder="Feedback (opcjonalnie)"
            value={newAnswer.feedback}
            onChange={(e) => setNewAnswer({...newAnswer, feedback: e.target.value})}
          />
          <Button onClick={handleAddAnswer}>Dodaj odpowiedź</Button>
        </div>

        <div className="grid gap-4">
          {answers.map((answer) => (
            <div key={answer.id} className="p-4 border rounded">
              <div>{answer.answer_text}</div>
              <div className="text-sm text-gray-500">
                Poprawność: {answer.fraction}%
                {answer.feedback && (
                  <div>Feedback: {answer.feedback}</div>
                )}
              </div>
            </div>
          ))}
        </div>
     
    </AuthLayout>
  );
}