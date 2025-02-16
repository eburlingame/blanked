import {
  AnswerContents,
  decodeAnswerContents,
  QuizQuestionType,
} from "@/util/quiz";
import { ScoredAnswer, scoreQuestion } from "@/util/score";
import { Box, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import AnswerInput from "./AnswerInput";

export type QuestionProps = {
  question: QuizQuestionType;
  onAdvance: () => void;
};

const Question = ({ question, onAdvance }: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));

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

  const submitQuestions = () => {
    const scored = scoreQuestion(question, userAnswers.current);
    console.log(scored);
    setScoredAnswer(scored);

    if (scored.every((a) => a.isCorrect)) {
      advanceQuestion();
    }
  };

  return (
    <Box mt="4">
      <Box>
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
                  onChange={setAnswer(answerIndex)}
                  onSubmit={submitQuestions}
                />
              );
            },
          }}
        >
          {question.markdown}
        </Markdown>
      </Box>

      <Box mt="2">
        <Button colorScheme="green" onClick={submitQuestions}>
          Submit
        </Button>
      </Box>
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
