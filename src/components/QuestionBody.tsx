import { QuestionType } from "@/state/models";
import { AnswerContents, decodeAnswerContents } from "@/util/parser";
import { ScoredAnswer } from "@/util/score";
import { Box, Button, HStack } from "@chakra-ui/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnswerInput from "./AnswerInput";
import { QuestionStatus } from "./Question";
import { Prose } from "./ui/prose";

export type QuestionBodyProps = {
  question: QuestionType;
  status: QuestionStatus;
  userAnswers: string[];
  focusedAnswerIndex: number;
  scoredAnswers: ScoredAnswer[] | null;
  onSubmit: () => void;
  onSubmitAndMarkCorrect: () => void;
  onReveal: () => void;
  onSetAnswer: (answerIndex: number, value: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNodeContents = (node: any): AnswerContents | null => {
  const contents = node?.children[0]?.value || null;
  if (!contents) return null;

  return decodeAnswerContents(contents);
};

const QuestionBody = ({
  question,
  status,
  userAnswers,
  focusedAnswerIndex,
  scoredAnswers,
  onReveal,
  onSubmit,
  onSubmitAndMarkCorrect,
  onSetAnswer,
}: QuestionBodyProps) => {
  const answerStatus = (index: number) => {
    const scoredAnswer = scoredAnswers?.[index];

    if (scoredAnswer && scoredAnswer.isCorrect) {
      return "correct";
    }

    if (status === "revealed") {
      return "revealed";
    }

    if (scoredAnswer && !scoredAnswer.isCorrect) {
      return "incorrect";
    }

    return "unanswered";
  };

  return (
    <Box mt="4">
      <Box
        borderColor="gray.400"
        borderRadius="md"
        borderWidth="thin"
        rounded="md"
        p="4"
      >
        <Prose color="white" fontSize="md" lineHeight="1.5em">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              em: ({ node }) => {
                const contents = getNodeContents(node);
                if (!contents) return null;

                const { answerIndex } = contents;

                return (
                  <AnswerInput
                    key={answerIndex.toString()}
                    status={answerStatus(answerIndex)}
                    shouldFocus={answerIndex === focusedAnswerIndex}
                    contents={contents}
                    initialValue={userAnswers[answerIndex]}
                    onSubmit={onSubmit}
                    onChange={(value) => onSetAnswer(answerIndex, value)}
                    answer={question.answers[answerIndex].options[0]}
                  />
                );
              },
            }}
          >
            {question.parsedMarkdown}
          </Markdown>
        </Prose>
      </Box>

      <HStack mt="2" justifyContent="center">
        <Button colorPalette="blue" onClick={onReveal}>
          Reveal
        </Button>

        <Button colorPalette="green" onClick={onSubmit}>
          Submit
        </Button>

        <Button colorPalette="green" onClick={onSubmitAndMarkCorrect}>
          Submit and Mark Correct
        </Button>
      </HStack>
    </Box>
  );
};

export default QuestionBody;
