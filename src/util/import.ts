import { parseQuiz, QuizType } from "./parser";
import { addOrUpdateQuiz } from "./storage";

export const importQuiz = async (importUrl: string): Promise<QuizType> => {
  const response = await fetch(importUrl);
  const text = await response.text();
  const quiz = await parseQuiz(importUrl, text.trim());

  addOrUpdateQuiz(quiz);

  return quiz;
};
