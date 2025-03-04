import { AnswerQuality, StudyEvent, StudySession } from "@/state/models";
import { useQuestion } from "@/state/queries";
import { VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Question from "./Question";
import QuizProgress from "./QuizProgress";

export type QuizSequencerProps = {
  session: StudySession & { events: StudyEvent[] };
};

const QuizSequencer = ({ session }: QuizSequencerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const completedQuestions = useMemo(
    () => new Set(session.events.map((e) => e.questionId)),
    [session.events]
  );

  const currentQuestionId = session.questionIds[currentQuestionIndex];

  const { data: question } = useQuestion(currentQuestionId);

  const advanceQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const onSubmit = async (quality: AnswerQuality, values: string[]) => {
    advanceQuestion();
  };

  return (
    <VStack align="stretch">
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={session.questionIds.length}
        numberCorrect={0}
      />

      {question && <Question question={question} onSubmit={onSubmit} />}
    </VStack>
  );
};

export default QuizSequencer;
