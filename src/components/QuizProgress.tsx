import { Box, FormatNumber, HStack, Progress } from "@chakra-ui/react";

export type QuizProgressProps = {
  currentQuestionIndex: number;
  totalQuestions: number;
  numberCorrect: number;
};

const QuizProgress = ({
  currentQuestionIndex,
  totalQuestions,
  numberCorrect,
}: QuizProgressProps) => {
  return (
    <Box mt="2">
      <Progress.Root
        colorPalette="blue"
        size="sm"
        value={currentQuestionIndex}
        max={totalQuestions}
      >
        <Progress.Label mb="2">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Progress.Label>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>

        <HStack mt="2" pt="0" justify={"space-between"}>
          <Progress.ValueText />

          <Progress.ValueText color="green.400">
            <FormatNumber value={numberCorrect} /> correct
          </Progress.ValueText>
        </HStack>
      </Progress.Root>
    </Box>
  );
};

export default QuizProgress;
