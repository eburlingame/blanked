import { AnswerType, QuestionType } from "@/state/models";
import { closest } from "fastest-levenshtein";

export type ScoredAnswer = {
  answer: string;
  isCorrect: boolean;
};

export const scoreQuestion = (
  question: QuestionType,
  answers: string[]
): ScoredAnswer[] => {
  const scoredAnswers: ScoredAnswer[] = [];

  const groupMap = new Map<string, Set<AnswerType>>();
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
      const closestAnswer = answerToShow(userAnswer, answer);

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

          const closestAnswer = answerToShow(userAnswer, matchingAnswer);

          scoredAnswers.push({
            answer: closestAnswer,
            isCorrect: true,
          });
        } else {
          const closestAnswer = answerToShow(userAnswer, answer);

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

const answerToShow = (userAnswer: string, answer: AnswerType): string => {
  if (userAnswer.trim() === "") {
    return answer.options[0];
  } else {
    return closest(userAnswer, answer.options);
  }
};
const answerIsCorrect = (
  userAnswer: string,
  definedAnswer: AnswerType
): boolean =>
  definedAnswer.options.some((option) => {
    return userAnswer.toLowerCase().trim() === option.toLowerCase().trim();
  });
