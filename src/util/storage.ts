"use client";

import { QuestionBankType } from "@/state/models";
import { useEffect, useState } from "react";

const BLANKER_QUIZ_LOCALSTORAGE_KEY = "blanker_quiz_dev";

export type QuizStorage = {
  quizzes: QuestionBankType[];
};

export const getRecentQuizzes = (): QuestionBankType[] => {
  const items = window.localStorage.getItem(BLANKER_QUIZ_LOCALSTORAGE_KEY);
  if (items) {
    const parsedItems = JSON.parse(items);
    return (parsedItems as QuizStorage).quizzes;
  }

  return [];
};

export const updateRecentQuizzes = (quizzes: QuestionBankType[]) => {
  window.localStorage.setItem(
    BLANKER_QUIZ_LOCALSTORAGE_KEY,
    JSON.stringify({ quizzes } as QuizStorage)
  );
};

export const addOrUpdateQuiz = (quiz: QuestionBankType) => {
  const quizzes = getRecentQuizzes();

  const existingQuizIndex = quizzes.findIndex((q) => q.id === quiz.id);
  if (existingQuizIndex !== -1) {
    quizzes[existingQuizIndex] = quiz;
  } else {
    quizzes.push(quiz);
  }

  updateRecentQuizzes(quizzes);
};

export const removeQuiz = (quizId: string) => {
  const quizzes = getRecentQuizzes();
  const newQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);

  updateRecentQuizzes(newQuizzes);
};

export const useRecentQuizzes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<QuestionBankType[]>([]);

  const refetchQuizzes = async () => {
    setIsLoading(true);
    const quizzes = getRecentQuizzes();
    setQuizzes(quizzes);
    setIsLoading(false);
  };

  useEffect(() => {
    refetchQuizzes();
  }, []);

  return {
    quizzes,
    isLoading,
    refetchQuizzes,
  };
};
