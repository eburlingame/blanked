import {
  AnswerContents,
  decodeAnswerContents,
  QuizQuestionType,
} from "@/util/parser";
import { ScoredAnswer, scoreQuestion } from "@/util/score";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnswerInput from "./AnswerInput";
import { QuestionStatus } from "./Quiz";
import { Prose } from "./ui/prose";

export type QuestionProps = {
  question: QuizQuestionType;
  status: QuestionStatus;
  onStatusChange: (status: QuestionStatus) => void;

  onPrevious: () => void;
  onNext: () => void;
};

const Question = ({
  question,
  status,
  onStatusChange,
  onPrevious,
  onNext,
}: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));
  const [firstAnswer, setFirstAnswer] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scoredAnswers, setScoredAnswer] = useState<ScoredAnswer[] | null>(
    null
  );

  const setAnswer = (answerIndex: number) => (value: string) => {
    userAnswers.current = userAnswers.current.map((a, i) => {
      if (i === answerIndex) {
        return value;
      }
      return a;
    });
  };

  const scoreResponses = () => {
    setFirstAnswer(false);
    const scored = scoreQuestion(question, userAnswers.current);
    console.log(scored);
    setScoredAnswer(scored);

    return scored;
  };

  const onReveal = () => {
    scoreResponses();
    setIsRevealed(true);
  };

  const submitQuestions = () => {
    const scored = scoreResponses();
    const questionCorrect = scored.every((a) => a.isCorrect);

    if (firstAnswer && questionCorrect) {
      onStatusChange("correct");
    } else {
      onStatusChange("incorrect");
      if (userAnswers.current.some((v) => v.trim() === "")) {
        onReveal();
      }
    }

    if (questionCorrect) {
      setTimeout(() => onNext(), 450);
    }
  };

  useEffect(() => {
    userAnswers.current = question.answers.map(() => "");
    setScoredAnswer(null);
    setFirstAnswer(status === "unanswered");

    const isRevealed = status === "correct" || status === "incorrect";
    if (isRevealed) {
      console.log("revealing")
      onReveal();
    }
  }, [question]);

  const focusedAnswer =
    scoredAnswers?.findIndex((a) => a.isCorrect === false) || 0;

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
                    shouldFocus={answerIndex === focusedAnswer}
                    contents={contents}
                    initialValue={userAnswers.current[answerIndex]}
                    onSubmit={submitQuestions}
                    onChange={setAnswer(answerIndex)}
                    scoredAnswer={scoredAnswers?.[answerIndex] || null}
                    isRevealed={isRevealed}
                  />
                );
              },
            }}
          >
            {question.markdown}
          </Markdown>
        </Prose>
      </Box>

      <HStack mt="2" justifyContent="center">
        <Button colorPalette="gray" onClick={onPrevious}>
          Previous
        </Button>

        <Button colorPalette="blue" onClick={onReveal}>
          Reveal
        </Button>

        <Button colorPalette="green" onClick={submitQuestions}>
          Submit
        </Button>

        <Button colorPalette="gray" onClick={onNext}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default Question;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNodeContents = (node: any): AnswerContents | null => {
  const contents = node?.children[0]?.value || null;
  if (!contents) return null;

  return decodeAnswerContents(contents);
};
