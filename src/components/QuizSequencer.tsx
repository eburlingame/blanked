import {
  AnswerQuality,
  QuestionType,
  StudySessionWithEvents,
} from "@/state/models";
import { useAddStudyEvent } from "@/state/mutations";
import { useMultipleQuestions } from "@/state/queries";
import { useQuizSequence } from "@/state/sequence";
import { Box, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loadable from "./Loadable";
import Question from "./Question";
import QuizProgress from "./QuizProgress";
import QuizSummary from "./QuizSummary";

export type QuizSequencerProps = {
  session: StudySessionWithEvents;
};

const QuizSequencer = ({ session }: QuizSequencerProps) => {
  const multipleQuestionsQuery = useMultipleQuestions(session.questionIds);

  const {
    currentQuestionId,
    onAdvance,
    totalQuestions,
    correctQuestions,
    needsReviewQuestions,
  } = useQuizSequence(session);

  const { mutateAsync: addStudyEvent } = useAddStudyEvent();

  const [timeDisplayed, setTimeDisplayed] = useState(new Date());
  const [timeStarted, setTimeStarted] = useState(new Date());

  const advanceQuestion = () => {
    onAdvance();
    setTimeDisplayed(new Date());
  };

  const queryClient = useQueryClient();

  const onSubmit = async (quality: AnswerQuality, incorrectIndex: number[]) => {
    console.log("Submitting", quality, incorrectIndex);

    if (currentQuestionId) {
      await addStudyEvent({
        sessionId: session.id,
        incorrectAnswerIndexes: incorrectIndex,
        timeDisplayed: timeDisplayed,
        timeStarted: timeStarted,
        timeCompleted: new Date(),
        questionId: currentQuestionId,
        answerQuality: quality,
      });

      await queryClient.invalidateQueries({
        queryKey: ["studySession"],
      });

      advanceQuestion();
    }
  };

  const onStart = () => {
    setTimeStarted(new Date());
  };

  if (currentQuestionId === null) {
    return <QuizSummary session={session} />;
  }

  return (
    <Loadable query={multipleQuestionsQuery}>
      {(questions: Record<string, QuestionType>) => {
        const question = questions[currentQuestionId];
        if (!question) {
          return <Box>Question not found.</Box>;
        }

        return (
          <VStack align="stretch">
            <QuizProgress
              questionsCompleted={session.events.length}
              totalQuestions={totalQuestions}
              numberCorrect={correctQuestions.size}
              numberNeedsReview={needsReviewQuestions.size}
            />

            <Question
              totalQuestions={totalQuestions}
              question={question}
              onSubmit={onSubmit}
              onStart={onStart}
            />
          </VStack>
        );
      }}
    </Loadable>
  );
};

export default QuizSequencer;
