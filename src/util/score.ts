import { closest } from "fastest-levenshtein";
import { QuizAnswerType, QuizQuestionType } from "./parser";

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
    } else {
      const groupAnswers = groupMap.get(answer.groupId);

      if (groupAnswers) {
        const remainingAnswersList = Array.from(groupAnswers);
        const matchingAnswer = remainingAnswersList.find((a) =>
          answerIsCorrect(userAnswer, a)
        );

        if (matchingAnswer) {
          groupAnswers.delete(matchingAnswer);

          const closestAnswer = closest(userAnswer, matchingAnswer.options);

          scoredAnswers.push({
            answer: closestAnswer,
            isCorrect: true,
          });
        } else {
          const closestAnswer = closest(userAnswer, answer.options);

          scoredAnswers.push({
            answer: closestAnswer,
            isCorrect: false,
          });
        }
      }
    }
  });

  return scoredAnswers;
};

const answerIsCorrect = (
  userAnswer: string,
  definedAnswer: QuizAnswerType
): boolean =>
  definedAnswer.options.some((option) => {
    return userAnswer.toLowerCase().trim() === option.toLowerCase().trim();
  });
