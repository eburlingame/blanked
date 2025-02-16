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
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <Box>
      <Heading>{quiz.name}</Heading>
      <Question question={question} onAdvance={advanceQuestion} />
    </Box>
  );
};

export default Quiz;
