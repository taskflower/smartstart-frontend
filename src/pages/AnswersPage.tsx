import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Question, Answer } from '../types/moodle';

export default function AnswersPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState({
    answer_text: '',
    fraction: 0,
    feedback: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      // Pobierz pytanie
      const q = query(collection(db, "questions"), where("id", "==", questionId));
      const questionSnapshot = await getDocs(q);
      if (!questionSnapshot.empty) {
        setQuestion({ id: questionSnapshot.docs[0].id, ...questionSnapshot.docs[0].data() } as Question);
      }

      // Pobierz odpowiedzi
      const answersQuery = query(collection(db, "answers"), where("question_id", "==", questionId));
      const answersSnapshot = await getDocs(answersQuery);
      const answersData = answersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Answer[];
      setAnswers(answersData);
    };

    if (questionId) {
      fetchData();
    }
  }, [questionId]);

  const handleAddAnswer = async () => {
    if (!questionId || !newAnswer.answer_text) return;

    // Dodaj odpowiedź do bazy danych
    const docRef = await addDoc(collection(db, "answers"), {
      ...newAnswer,
      question_id: questionId
    });

    // Dodaj nową odpowiedź do stanu
    setAnswers(prevAnswers => [
      ...prevAnswers,
      { id: docRef.id, ...newAnswer } as Answer
    ]);

    // Wyczyść formularz
    setNewAnswer({
      answer_text: '',
      fraction: 0,
      feedback: ''
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Odpowiedzi</h1>
        {question && (
          <p className="text-gray-600 mt-2">{question.question_text}</p>
        )}
      </div>

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
    </div>
  );
}
