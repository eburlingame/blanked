"use client";

import { QuestionBankType } from "@/state/models";
import { useListQuestionBanks } from "@/state/queries";
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
import { useState } from "react";

const BankLink = () => {
  const router = useRouter();

  const [isReloading, setIsReloading] = useState(false);
  const { data: banks, isLoading } = useListQuestionBanks();

  const onDelete = (bankId: string) => {
    removeQuiz(bankId);
  };

  const onReload = async (bank: QuestionBankType) => {
    setIsReloading(true);
    setIsReloading(false);
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
                onClick={() => router.push(`/quiz/${bank.id}`)}
              >
                Take
              </Button>

              <VStack alignItems="flex-start" gap="0" ml="1">
                <Box>{bank.name}</Box>
                <Box fontSize="xs">
                  {new URL(bank.originUrl).host} - {bank.questions.length}{" "}
                  questions
                </Box>
              </VStack>
            </HStack>

            <ButtonGroup attached>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => onReload(bank)}
                loading={isReloading}
              >
                Reload
              </Button>

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
