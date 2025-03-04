import { QuestionType } from "@/state/models";
import { Box, FormatNumber, Heading, HStack, Progress } from "@chakra-ui/react";
import { useState } from "react";
import Question from "./Question";
import QuizSequencer from "./QuizSequencer";

export type QuizProps = {
  sessionId: string;
};

export type QuestionStatus = "correct" | "incorrect" | "unanswered";

const Quiz = ({ sessionId }: QuizProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = questions[currentQuestion];

  const [qStatuses, setQStatuses] = useState<QuestionStatus[]>(
    questions.map(() => "unanswered")
  );

  const setQuestionStatus = (index: number, status: QuestionStatus) => {
    setQStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[index] = status;
      return newStatuses;
    });
  };

  const nextQuestion = () => {};

  const prevQuestion = () => {};

  const onReset = () => {};

  const renderQuestion = () => {
    return (
      <>
        <Box mt="2">
          <Progress.Root
            colorPalette="blue"
            size="sm"
            value={currentQuestion}
            max={questions.length}
          >
            <Progress.Label mb="2">
              Question {currentQuestion + 1} of {questions.length}
            </Progress.Label>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>

            <HStack mt="2" pt="0" justify={"space-between"}>
              <Progress.ValueText />

              <Progress.ValueText color="green.400">
                <FormatNumber value={numberCorrect} /> of{" "}
                <FormatNumber value={numberAnswered} /> correct
              </Progress.ValueText>
            </HStack>
          </Progress.Root>
        </Box>

        <Question
          status={qStatuses[currentQuestion]}
          onStatusChange={(s) => setQuestionStatus(currentQuestion, s)}
          question={question}
          onNext={nextQuestion}
          onPrevious={prevQuestion}
        />
      </>
    );
  };

  return (
    <Box>
      <QuizSequencer />
    </Box>
  );
};

export default Quiz;
