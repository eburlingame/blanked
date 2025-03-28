import { Box, FormatNumber, HStack, Progress } from "@chakra-ui/react";

export type QuizProgressProps = {
  questionsCompleted: number;
  totalQuestions: number;
  numberCorrect: number;
  numberNeedsReview: number;
};

const QuizProgress = ({
  questionsCompleted,
  totalQuestions,
  numberCorrect,
  numberNeedsReview,
}: QuizProgressProps) => {
  return (
    <Box mt="2">
      <Progress.Root
        colorPalette="blue"
        size="sm"
        value={questionsCompleted}
        max={totalQuestions}
      >
        <Progress.Label mb="2">
          Question {questionsCompleted} of {totalQuestions}
        </Progress.Label>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>

        <HStack mt="2" pt="0" justify={"space-between"}>
          <Progress.ValueText />

          <HStack>
            <Progress.ValueText color="green.400">
              <FormatNumber value={numberCorrect} /> correct
            </Progress.ValueText>
            <Progress.ValueText color="blue.400">
              <FormatNumber value={numberNeedsReview} /> need review
            </Progress.ValueText>
          </HStack>
        </HStack>
      </Progress.Root>
    </Box>
  );
};

export default QuizProgress;
