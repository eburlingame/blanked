import {
  AnswerContents,
  decodeAnswerContents,
  QuizQuestionType,
} from "@/util/quiz";
import { ScoredAnswer, scoreQuestion } from "@/util/score";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import AnswerInput from "./AnswerInput";

export type QuestionProps = {
  question: QuizQuestionType;

  onPrevious: () => void;
  onNext: () => void;
  onAdvance: () => void;
};

const Question = ({
  question,
  onPrevious,
  onNext,
  onAdvance,
}: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));

  const [isRevealed, setIsRevealed] = useState(false);
  const [scoredAnswers, setScoredAnswer] = useState<ScoredAnswer[] | null>(
    null
  );

  useEffect(() => {
    userAnswers.current = question.answers.map(() => "");
    setScoredAnswer(null);
  }, [question]);

  const setAnswer = (answerIndex: number) => (value: string) => {
    userAnswers.current = userAnswers.current.map((a, i) => {
      if (i === answerIndex) {
        return value;
      }
      return a;
    });
  };

  const advanceQuestion = () => {
    onAdvance();
  };

  const scoreQuestions = () => {
    const scored = scoreQuestion(question, userAnswers.current);

    console.log(scored);
    setScoredAnswer(scored);

    return scored;
  };

  const submitQuestions = () => {
    const scored = scoreQuestions();

    if (scored.every((a) => a.isCorrect)) {
      setTimeout(() => advanceQuestion(), 450);
    }
  };

  const onReveal = () => {
    scoreQuestions();
    setIsRevealed(true);
  };

  return (
    <Box mt="4">
      <Box
        borderColor="blue.600"
        borderRadius="md"
        borderWidth="thin"
        rounded="md"
        p="4"
      >
        <Markdown
          components={{
            em: ({ node }) => {
              const contents = getNodeContents(node);
              if (!contents) return null;

              const { answerIndex } = contents;

              return (
                <AnswerInput
                  key={answerIndex.toString()}
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
