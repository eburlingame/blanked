import { AnswerContents } from "@/util/parser";
import { Box, Input, Span, VStack } from "@chakra-ui/react";
import { useState } from "react";

export type AnswerInputProps = {
  contents: AnswerContents;
  status: AnswerStatus;
  initialValue: string;
  shouldFocus: boolean;
  answer: string;
  onChange: (a: string) => void;
  onSubmit: () => void;
};

export type AnswerStatus = "correct" | "incorrect" | "unanswered" | "revealed";

const backgroundColors: Record<AnswerStatus, string> = {
  correct: "green.500",
  incorrect: "red.500",
  unanswered: "inherit",
  revealed: "inherit",
};

const borderColors: Record<AnswerStatus, string> = {
  correct: "green.800",
  incorrect: "red.800",
  unanswered: "inherit",
  revealed: "inherit",
};

const AnswerInput = ({
  contents,
  status,
  answer,
  initialValue,
  shouldFocus,
  onChange,
  onSubmit,
}: AnswerInputProps) => {
  const [value, setValue] = useState(initialValue);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const showInput =
    status === "unanswered" || status === "incorrect" || status === "revealed";

  const showAnswer = status === "revealed" || status === "correct";

  return (
    <Span display="inline-block" alignItems="center">
      <VStack gap={0}>
        {showAnswer && (
          <Box ml="1" color="green.400">
            {answer}
          </Box>
        )}

        {showInput && (
          <Input
            autoFocus={shouldFocus}
            w={`${contents.answerLen * 14}px`}
            px="2"
            py="0"
            my="1"
            mx="1"
            rounded="xs"
            value={value}
            onChange={onValueChange}
            onKeyUp={(e) => e.key === "Enter" && onSubmit()}
            color="white"
            _placeholder={{ color: "white" }}
            _focus={{ outlineColor: "blue.600" }}
            backgroundColor={backgroundColors[status]}
            borderColor={borderColors[status]}
          />
        )}
      </VStack>
    </Span>
  );
};

export default AnswerInput;
