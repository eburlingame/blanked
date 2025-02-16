"use client";

import { QuizStorage } from "./models";
import { QuizType } from "./parser";

const BLANKER_QUIZ_LOCALSTORAGE_KEY = "blanker_quiz_dev";

export const getRecentQuizzes = (): QuizType[] => {
  const items = window.localStorage.getItem(BLANKER_QUIZ_LOCALSTORAGE_KEY);
  if (items) {
    const parsedItems = JSON.parse(items);
    return (parsedItems as QuizStorage).quizzes;
  }

  return [];
};

export const updateRecentQuizzes = (quizzes: QuizType[]) => {
  window.localStorage.setItem(
    BLANKER_QUIZ_LOCALSTORAGE_KEY,
    JSON.stringify({ quizzes } as QuizStorage)
  );
};

export const addNewQuiz = (quiz: QuizType) => {
  const quizzes = getRecentQuizzes();
  const newQuizzes = [...quizzes, quiz];

  updateRecentQuizzes(newQuizzes);
};
