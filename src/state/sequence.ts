import { useBackend } from "@/components/BackendBootstrapper";
import { useMemo, useState } from "react";
import { AnswerQuality, StudyEvent, StudySessionWithEvents } from "./models";

const getQuestionsByStatus = (
  questionIds: string[],
  events: StudyEvent[]
): (AnswerQuality | undefined)[] => {
  const questionIdToStatus = events.reduce(
    (acc: Record<string, AnswerQuality>, event: StudyEvent) => {
      if (acc[event.questionId] === undefined) {
        acc[event.questionId] = event.answerQuality;
      } else if (event.answerQuality > acc[event.questionId]) {
        acc[event.questionId] = event.answerQuality;
      }
      return acc;
    },
    {}
  );

  return questionIds.map((id) => questionIdToStatus[id]);
};

const getNextQuestionId = (session: StudySessionWithEvents) => {
  const questionIdToStatus = getQuestionsByStatus(
    session.questionIds,
    session.events
  );

  // First look for a question that has not been answered yet
  let nextQuestionIndex = questionIdToStatus.findIndex(
    (status) => status === undefined
  );
  if (nextQuestionIndex !== -1) {
    return session.questionIds[nextQuestionIndex];
  }

  // Then look for a question that needs review
  nextQuestionIndex = questionIdToStatus.findIndex(
    (status) => status !== AnswerQuality.AllCorrectOnFirstTry
  );
  if (nextQuestionIndex !== -1) {
    return session.questionIds[nextQuestionIndex];
  }

  return null;
};

export const useQuizSequence = (session: StudySessionWithEvents) => {
  const backend = useBackend();

  const [currentQuestionId, setCurrentQuestionId] = useState(() =>
    getNextQuestionId(session)
  );

  const allQuestions = useMemo(
    () => new Set(session.events.map((e) => e.questionId)),
    [session.events]
  );

  const correctQuestions = useMemo(
    () =>
      new Set(
        session.events
          .filter((e) => e.answerQuality >= AnswerQuality.AllCorrectOnFirstTry)
          .map((e) => e.questionId)
      ),
    [session.events]
  );

  const needsReviewQuestions = useMemo(
    () => allQuestions.difference(correctQuestions),
    [allQuestions, correctQuestions]
  );

  const questionsToStudy = useMemo(
    () => new Set(session.questionIds).difference(correctQuestions),
    [session.questionIds, correctQuestions]
  );

  const advanceQuestion = async () => {
    const latestSession = await backend.getStudySessionWithEvents(session.id);
    const nextQuestionId = getNextQuestionId(latestSession);

    if (nextQuestionId === null) {
      return backend.endStudySession(session.id, new Date());
    }

    setCurrentQuestionId(nextQuestionId);
  };

  const totalQuestions = session.events.length + questionsToStudy.size;

  return {
    onAdvance: advanceQuestion,
    currentQuestionId,

    correctQuestions,
    needsReviewQuestions,
    questionsToStudy,
    totalQuestions,
  };
};
