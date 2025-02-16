"use client";

import { importQuiz } from "@/util/import";
import { QuizType } from "@/util/parser";
import { removeQuiz, useRecentQuizzes } from "@/util/storage";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const QuizList = () => {
  const router = useRouter();

  const [isReloading, setIsReloading] = useState(false);
  const { quizzes, refetchQuizzes } = useRecentQuizzes();

  const onDelete = (quizId: string) => {
    removeQuiz(quizId);
    refetchQuizzes();
  };

  const onReload = async (quiz: QuizType) => {
    setIsReloading(true);
    await importQuiz(quiz.url);
    refetchQuizzes();
    setIsReloading(false);
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <Heading>Your Quizzes</Heading>
        <Button size="xs" onClick={() => router.push("/import")}>
          Import a Quiz
        </Button>
      </HStack>

      <VStack mt="4">
        {quizzes.map((quiz) => (
          <HStack
            key={quiz.id}
            justifyContent="space-between"
            width="100%"
            p="2"
            rounded="md"
            _hover={{
              backgroundColor: "gray.600",
            }}
          >
            <HStack>
              <Button
                size="xs"
                colorPalette="green"
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                Take
              </Button>

              <VStack alignItems="flex-start" gap="0" ml="1">
                <Box>{quiz.name}</Box>
                <Box fontSize="xs">{new URL(quiz.url).host}</Box>
              </VStack>
            </HStack>

            <ButtonGroup attached>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => onReload(quiz)}
                loading={isReloading}
              >
                Reload
              </Button>

              <Button
                size="xs"
                colorPalette="red"
                onClick={() => onDelete(quiz.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </HStack>
        ))}
      </VStack>
    </>
  );
};

export default QuizList;
