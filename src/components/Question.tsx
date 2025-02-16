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
import { Prose } from "./ui/prose";

export type QuestionProps = {
  question: QuizQuestionType;

  onPrevious: () => void;
  onNext: () => void;
  onAdvance: (correct: boolean) => void;
};

const Question = ({
  question,
  onPrevious,
  onNext,
  onAdvance,
}: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));
  const [firstAnswer, setFirstAnswer] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scoredAnswers, setScoredAnswer] = useState<ScoredAnswer[] | null>(
    null
  );

  useEffect(() => {
    userAnswers.current = question.answers.map(() => "");
    setScoredAnswer(null);
    setIsRevealed(false);
    setFirstAnswer(true);
  }, [question]);

  const setAnswer = (answerIndex: number) => (value: string) => {
    userAnswers.current = userAnswers.current.map((a, i) => {
      if (i === answerIndex) {
        return value;
      }
      return a;
    });
  };

  const scoreQuestions = () => {
    setFirstAnswer(false);
    const scored = scoreQuestion(question, userAnswers.current);
    setScoredAnswer(scored);

    return scored;
  };

  const onReveal = () => {
    scoreQuestions();
    setIsRevealed(true);
  };

  const submitQuestions = () => {
    const scored = scoreQuestions();

    if (scored.every((a) => a.isCorrect)) {
      setTimeout(() => onAdvance(firstAnswer), 450);
    } else {
      if (userAnswers.current.some((v) => v.trim() === "")) {
        onReveal();
      }
    }
  };
  const focusedAnswer =
    scoredAnswers?.findIndex((a) => a.isCorrect === false) || 0;

  return (
    <Box mt="4">
      <Box
        borderColor="blue.600"
        borderRadius="md"
        borderWidth="thin"
        rounded="md"
        p="4"
      >
        <Prose color="white">
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
