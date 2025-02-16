import { QuizType } from "@/util/quiz";
import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";
import Question from "./Question";

export type QuizProps = {
  quiz: QuizType;
};

const Quiz = ({ quiz }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = quiz.questions[currentQuestion];

  const advanceQuestion = () => {
    if (currentQuestion >= quiz.questions.length - 1) {
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const prevQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }
    setCurrentQuestion((prev) => prev - 1);
  };

  return (
    <Box>
      <Heading>{quiz.name}</Heading>
      <Question
        question={question}
        onAdvance={advanceQuestion}
        onNext={advanceQuestion}
        onPrevious={prevQuestion}
      />
    </Box>
  );
};

export default Quiz;
