"use client";

import { getRecentQuizzes } from "@/util/storage";
import { Button } from "@chakra-ui/react";
import router from "next/router";
import { useMemo } from "react";
import Quiz from "./Quiz";

export type QuizLoaderProps = {
  quizId: string;
};

const QuizLoader = ({ quizId }: QuizLoaderProps) => {
  const recentQuizzes = useMemo(() => getRecentQuizzes(), []);
  const quiz = recentQuizzes.find((quiz) => quiz.id === quizId);

  return (
    <>
      {quiz && <Quiz quiz={quiz} />}

      {!quiz && (
        <div>
          <h1>Quiz not found</h1>
          <p>
            The quiz you are looking for does not exist. Please check the URL or
            import a new quiz.
          </p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      )}
    </>
  );
};

export default QuizLoader;
