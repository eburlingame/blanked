import { AnswerQuality, QuestionType } from "@/state/models";
import { ScoredAnswer, scoreQuestion } from "@/util/score";
import { useRef, useState } from "react";
import QuestionBody from "./QuestionBody";

export type QuestionProps = {
  question: QuestionType;
  onSubmit: (quality: AnswerQuality, responses: string[]) => void;
};

export type QuestionStatus = "start" | "submitted" | "revealed" | "correct";

const Question = ({ question, onSubmit }: QuestionProps) => {
  const userAnswers = useRef<string[]>(question.answers.map(() => ""));

  const [status, setStatus] = useState<QuestionStatus>("start");
  const [attempts, setAttempts] = useState(0);

  const [scoredAnswers, setScoredAnswer] = useState<ScoredAnswer[] | null>(
    null
  );

  const setAnswer = (answerIndex: number, value: string) => {
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

  console.log(status, attempts);

  const onQuestionSubmit = () => {
    const scored = scoreResponses();
    const allCorrect = scored.every((a) => a.isCorrect);
    const allBlank = userAnswers.current.every((a) => a.trim() === "");

    if (allBlank) {
      onReveal();
    } else if (allCorrect) {
      setStatus("correct");

      if (status === "start") {
        onSubmit(AnswerQuality.AllCorrectOnFirstTry, userAnswers.current);
      } else {
        if (attempts === 1) {
          onSubmit(AnswerQuality.AllCorrectOnSecondTry, userAnswers.current);
        } else {
          onSubmit(AnswerQuality.ThreeOrMoreAttempts, userAnswers.current);
        }
      }
    } else {
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
      onSubmit={onQuestionSubmit}
      onReveal={onReveal}
    />
  );
};

export default Question;
