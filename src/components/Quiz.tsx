import { QuestionType } from "@/state/models";
import { Box, FormatNumber, Heading, HStack, Progress } from "@chakra-ui/react";
import { useState } from "react";
import Question from "./Question";

export type QuizProps = {
  name: string;
  questions: QuestionType[];
};

export type QuestionStatus = "correct" | "incorrect" | "unanswered";

const Quiz = ({ name, questions }: QuizProps) => {
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

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((i) => i + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion <= 0) {
      return;
    }
    setCurrentQuestion((i) => i - 1);
  };

  const onReset = () => {
    setIsComplete(false);
    setCurrentQuestion(0);
    setQStatuses(questions.map(() => "unanswered"));
  };

  const numberCorrect = qStatuses.filter(
    (status) => status === "correct"
  ).length;
  const numberAnswered = qStatuses.filter(
    (status) => status !== "unanswered"
  ).length;

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

  const renderSummary = () => {
    return <Box>Questions complete!</Box>;
    // return <QuizSummary quiz={quiz} qStatuses={qStatuses} onReset={onReset} />;
  };

  return (
    <Box>
      <Heading>{name}</Heading>
      {isComplete ? renderSummary() : renderQuestion()}
    </Box>
  );
};

export default Quiz;
