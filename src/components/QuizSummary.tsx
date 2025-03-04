import { QuestionBankType } from "@/util/parser";
import {
  Box,
  Button,
  FormatNumber,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { QuestionStatus } from "./QuizOld";

export type QuizSummaryProps = {
  quiz: QuestionBankType;
  qStatuses: QuestionStatus[];
  onReset: () => void;
};

const QuizSummary = ({ quiz, qStatuses, onReset }: QuizSummaryProps) => {
  const router = useRouter();

  const correctQuestions = qStatuses.filter(
    (status) => status === "correct"
  ).length;

  const skipped = qStatuses.filter((status) => status === "unanswered").length;

  return (
    <VStack alignItems="center">
      <Heading mb={2}>Results</Heading>
      <VStack spaceX={2} mb={4} justifyContent="center">
        <Box>
          <FormatNumber value={correctQuestions} /> / {quiz.questions.length}{" "}
          correct
        </Box>
        <Box>
          <FormatNumber value={skipped} /> skipped
        </Box>
      </VStack>

      <HStack>
        <Button onClick={() => router.push("/")} mr={2}>
          Go Home
        </Button>
        <Button onClick={onReset}>Restart</Button>
      </HStack>
    </VStack>
  );
};

export default QuizSummary;
