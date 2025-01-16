// src/services/questionService.ts
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { Question, Answer } from "@/types/moodle";

// Pobierz wszystkie pytania
export const fetchQuestions = async (): Promise<Question[]> => {
  const questionsSnapshot = await getDocs(collection(db, "questions"));
  return questionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Question[];
};

// Pobierz pojedyncze pytanie
export const fetchQuestion = async (
  questionId: string
): Promise<Question | null> => {
  const docRef = doc(db, "questions", questionId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Question;
  }
  return null;
};

// Pobierz odpowiedzi dla pytania
export const fetchAnswers = async (questionId: string): Promise<Answer[]> => {
  const answersQuery = query(
    collection(db, "answers"),
    where("question_id", "==", questionId)
  );
  const answersSnapshot = await getDocs(answersQuery);
  return answersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Answer[];
};

// Dodaj nowe pytanie
export const addQuestion = async (
  questionData: Omit<Question, "id" | "created_at" | "updated_at">
): Promise<Question> => {
  const newQuestion = {
    ...questionData,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const docRef = await addDoc(collection(db, "questions"), newQuestion);
  return { ...newQuestion, id: docRef.id };
};

// Dodaj odpowiedź do pytania
export const addAnswer = async (
  questionId: string,
  answerData: Omit<Answer, "id" | "question_id">
): Promise<Answer> => {
  const newAnswer = {
    ...answerData,
    question_id: questionId,
  };

  const docRef = await addDoc(collection(db, "answers"), newAnswer);
  return { id: docRef.id, ...newAnswer };
};

// Aktualizuj pytanie
export const updateQuestion = async (
  questionId: string,
  questionData: Partial<Question>
): Promise<void> => {
  const questionRef = doc(db, "questions", questionId);
  await updateDoc(questionRef, {
    ...questionData,
    updated_at: new Date(),
  });
};

// Aktualizuj odpowiedź
export const updateAnswer = async (
  answerId: string,
  answerData: Partial<Answer>
): Promise<void> => {
  const answerRef = doc(db, "answers", answerId);
  await updateDoc(answerRef, answerData);
};

// Usuń pytanie wraz z jego odpowiedziami w transakcji
export const deleteQuestionWithAnswers = async (questionId: string): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      // Pobierz wszystkie odpowiedzi dla pytania
      const answersQuery = query(
        collection(db, "answers"),
        where("question_id", "==", questionId)
      );
      const answersSnapshot = await getDocs(answersQuery);
      
      // Usuń wszystkie odpowiedzi
      answersSnapshot.docs.forEach((answerDoc) => {
        transaction.delete(doc(db, "answers", answerDoc.id));
      });
      
      // Usuń pytanie
      const questionRef = doc(db, "questions", questionId);
      transaction.delete(questionRef);
    });
  } catch (error) {
    console.error("Error deleting question with answers:", error);
    throw error;
  }
};
