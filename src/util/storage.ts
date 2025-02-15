import { QuizType, QuizStorage } from "./models";

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

export const importQuiz = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch quiz");
  }

  const data = await response.json();
  if (!data) {
    throw new Error("Invalid quiz data");
  }
};
