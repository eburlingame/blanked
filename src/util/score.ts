import { closest } from "fastest-levenshtein";
import { QuizAnswerType, QuizQuestionType } from "./quiz";

export type ScoredAnswer = {
  answer: string;
  isCorrect: boolean;
};

export const scoreQuestion = (
  question: QuizQuestionType,
  answers: string[]
): ScoredAnswer[] => {
  const scoredAnswers: ScoredAnswer[] = [];

  const groupMap = new Map<string, Set<QuizAnswerType>>();
  question.answers.forEach((a) => {
    if (a.groupId !== undefined) {
      if (groupMap.has(a.groupId)) {
        groupMap.get(a.groupId)?.add(a);
      } else {
        groupMap.set(a.groupId, new Set([a]));
      }
    }
  });

  question.answers.forEach((answer, index) => {
    const userAnswer = answers[index];

    if (answer.groupId === undefined) {
      const isCorrect = answerIsCorrect(userAnswer, answer);
      const closestAnswer = closest(userAnswer, answer.options);
      scoredAnswers.push({ answer: closestAnswer, isCorrect });
    }
  });

  return scoredAnswers;
};

const answerIsCorrect = (
  userAnswer: string,
  definedAnswer: QuizAnswerType
): boolean => {
  return definedAnswer.options.some((option) => {
    return userAnswer.toLowerCase() === option.toLowerCase();
  });
};
