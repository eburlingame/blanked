"use client";

import { getRecentQuizzes } from "@/util/storage";
import { Button, HStack, Heading, List } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export type QuizListProps = {};

const QuizList = ({}: QuizListProps) => {
  const router = useRouter();
  const recentQuizzes = useMemo(() => getRecentQuizzes(), []);

  return (
    <>
      <HStack justifyContent="space-between">
        <Heading>Recent Quizzes</Heading>
        <Button size="sm" onClick={() => router.push("/import")}>
          Import a Quiz
        </Button>
      </HStack>

      <List.Root>
        {recentQuizzes.map((quiz) => (
          <List.Item key={quiz.id}>
            <Link href={`/quiz/${quiz.id}`}>{quiz.name}</Link>
          </List.Item>
        ))}
      </List.Root>
    </>
  );
};

export default QuizList;
