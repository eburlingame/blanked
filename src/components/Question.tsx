import { AnswerQuality, QuestionType } from "@/state/models";
import { ScoredAnswer, scoreQuestion } from "@/util/score";
import { useEffect, useRef, useState } from "react";
import QuestionBody from "./QuestionBody";

export type QuestionProps = {
  totalQuestions: number;
  question: QuestionType;
  onSubmit: (quality: AnswerQuality, incorrectIndex: number[]) => void;
  onStart: () => void;
};

export type QuestionStatus = "start" | "submitted" | "revealed" | "correct";

const Question = ({
  question,
  onSubmit,
  onStart,
  totalQuestions,
}: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));

  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState<QuestionStatus>("start");
  const [attempts, setAttempts] = useState(0);

  const [scoredAnswers, setScoredAnswer] = useState<ScoredAnswer[] | null>(
    null
  );

  const [firstIncorrectIndexes, setFirstIncorrectIndexes] = useState<number[]>(
    []
  );

  const setAnswer = (answerIndex: number, value: string) => {
    if (!isStarted) {
      setIsStarted(true);
      onStart();
    }

    userAnswers.current = userAnswers.current.map((a, i) => {
      if (i === answerIndex) {
        return value;
      }
      return a;
    });
  };

  const scoreResponses = () => {
    const scored = scoreQuestion(question, userAnswers.current);
    setScoredAnswer(scored);
    return scored;
  };

  const onReveal = () => {
    setStatus("revealed");
  };

  const reset = () => {
    setStatus("start");
    setAttempts(0);
    setScoredAnswer(null);
    setFirstIncorrectIndexes([]);
    userAnswers.current = question.answers.map(() => "");
  };

  useEffect(() => {
    reset();
  }, [question.id, totalQuestions]);

  const onQuestionSubmit = (markCorrect: boolean) => {
    const scored = scoreResponses();
    const allCorrect = scored.every((a) => a.isCorrect);
    const allBlank = userAnswers.current.every((a) => a.trim() === "");

    if (markCorrect) {
      setStatus("correct");
      onSubmit(AnswerQuality.AllCorrectOnFirstTry, []);
      return;
    }

    if (allBlank) {
      onReveal();
    } else if (allCorrect) {
      setStatus("correct");

      if (status === "start") {
        onSubmit(AnswerQuality.AllCorrectOnFirstTry, firstIncorrectIndexes);
      } else {
        if (attempts === 1) {
          onSubmit(AnswerQuality.AllCorrectOnSecondTry, firstIncorrectIndexes);
        } else {
          onSubmit(AnswerQuality.ThreeOrMoreAttempts, firstIncorrectIndexes);
        }
      }
    } else {
      setFirstIncorrectIndexes(
        scored
          .map((a, i) => (a.isCorrect ? null : i))
          .filter((i) => i !== null) as number[]
      );

      if (status === "start") {
        setAttempts(1);
        setStatus("submitted");
      } else {
        setAttempts((a) => a + 1);
        onReveal();
      }
    }
  };

  const focusedAnswerIndex =
    scoredAnswers?.findIndex((a) => a.isCorrect === false) || 0;

  return (
    <QuestionBody
      question={question}
      status={status}
      userAnswers={userAnswers.current}
      onSetAnswer={setAnswer}
      focusedAnswerIndex={focusedAnswerIndex}
      scoredAnswers={scoredAnswers}
      onSubmit={() => onQuestionSubmit(false)}
      onSubmitAndMarkCorrect={() => onQuestionSubmit(true)}
      onReveal={onReveal}
    />
  );
};

export default Question;
