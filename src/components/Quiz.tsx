import { QuizType } from "@/util/parser";
import { Box, FormatNumber, Heading, HStack, Progress } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import Question from "./Question";
import QuizSummary from "./QuizSummary";

export type QuizProps = {
  quiz: QuizType;
};

export type QuestionStatus = "correct" | "incorrect" | "unanswered";

const Quiz = ({ quiz }: QuizProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = quiz.questions[currentQuestion];

  const [qStatuses, setQStatuses] = useState<QuestionStatus[]>(
    quiz.questions.map(() => "unanswered")
  );

  const setQuestionStatus = (index: number, status: QuestionStatus) => {
    setQStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[index] = status;
      return newStatuses;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
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
    setQStatuses(quiz.questions.map(() => "unanswered"));
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
            max={quiz.questions.length}
          >
            <Progress.Label mb="2">
              Question {currentQuestion + 1} of {quiz.questions.length}
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
    return <QuizSummary quiz={quiz} qStatuses={qStatuses} onReset={onReset} />;
  };

  return (
    <Box>
      <Link href="/" style={{ textDecoration: "none" }}>
        Home
      </Link>

      <Heading>{quiz.name}</Heading>
      {isComplete ? renderSummary() : renderQuestion()}
    </Box>
  );
};

export default Quiz;
