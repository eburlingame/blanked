import { AnswerQuality, StudyEvent, StudySession } from "@/state/models";
import { useQuestion } from "@/state/queries";
import { VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Question from "./Question";
import QuizProgress from "./QuizProgress";
import { useAddStudyEvent } from "@/state/mutations";

export type QuizSequencerProps = {
  session: StudySession & { events: StudyEvent[] };
};

const pickRandomQuestion = (questionIds: string[]) => {
  const nextInt = Math.floor(Math.random() * questionIds.length);
  return questionIds[nextInt];
};

const QuizSequencer = ({ session }: QuizSequencerProps) => {
  const [currentQuestionId, setCurrentQuestionId] = useState(
    pickRandomQuestion(session.questionIds)
  );

  const [timeDisplayed, setTimeDisplayed] = useState(new Date());
  const [timeStarted, setTimeStarted] = useState(new Date());

  const correctQuestions = useMemo(
    () =>
      new Set(
        session.events
          .filter((e) => e.answerQuality >= AnswerQuality.AllCorrectOnSecondTry)
          .map((e) => e.questionId)
      ),
    [session.events]
  );

  const needsReviewQuestions = useMemo(
    () =>
      new Set(session.events.map((e) => e.questionId)).difference(
        correctQuestions
      ),
    [session.events, correctQuestions]
  );

  const questionsToStudy = useMemo(
    () => new Set(session.questionIds).difference(correctQuestions),
    [session.questionIds, correctQuestions]
  );

  const { data: question } = useQuestion(currentQuestionId);

  const advanceQuestion = () => {
    setCurrentQuestionId(pickRandomQuestion(Array.from(questionsToStudy)));
    setTimeDisplayed(new Date());
  };

  const { mutateAsync: addStudyEvent } = useAddStudyEvent();

  const onSubmit = async (quality: AnswerQuality, incorrectIndex: number[]) => {
    console.log("Submitting", quality, incorrectIndex);

    await addStudyEvent({
      sessionId: session.id,
      incorrectAnswerIndexes: incorrectIndex,
      timeDisplayed: timeDisplayed,
      timeStarted: timeStarted,
      timeCompleted: new Date(),
      questionId: currentQuestionId,
      answerQuality: quality,
    });

    setTimeout(advanceQuestion, 750);
  };

  const onStart = () => {
    setTimeStarted(new Date());
  };

  return (
    <VStack align="stretch">
      <QuizProgress
        questionsCompleted={session.events.length}
        totalQuestions={session.events.length + questionsToStudy.size}
        numberCorrect={correctQuestions.size}
        numberNeedsReview={needsReviewQuestions.size}
      />

      {question && (
        <Question question={question} onSubmit={onSubmit} onStart={onStart} />
      )}
    </VStack>
  );
};

export default QuizSequencer;
