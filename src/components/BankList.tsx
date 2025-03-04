"use client";

import { useListQuestionBanks } from "@/state/queries";
import { useStartBankStudySession } from "@/state/session";
import { removeQuiz } from "@/util/storage";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const BankLink = () => {
  const router = useRouter();

  const { data: banks, isLoading } = useListQuestionBanks();

  const onDelete = (bankId: string) => {
    removeQuiz(bankId);
  };

  const { onReview } = useStartBankStudySession();
  const startReview = async (bankId: string) => {
    const sessionId = await onReview(bankId);
    router.push(`/quiz/session/${sessionId}`);
  };

  if (isLoading || !banks) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HStack justifyContent="space-between">
        <Heading>Question Banks</Heading>

        <Button size="xs" onClick={() => router.push("/import")}>
          Import Questions
        </Button>
      </HStack>

      <VStack mt="4">
        {banks.map((bank) => (
          <HStack
            key={bank.id}
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
                onClick={() => startReview(bank.id)}
              >
                Review
              </Button>

              <VStack alignItems="flex-start" gap="0" ml="1">
                <Box>{bank.name}</Box>
                <Box fontSize="xs">
                  {new URL(bank.originUrl).host} - {bank.numberOfQuestions}{" "}
                  questions
                </Box>
              </VStack>
            </HStack>

            <ButtonGroup attached>
              <Button
                size="xs"
                colorPalette="red"
                onClick={() => onDelete(bank.id)}
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

export default BankLink;
