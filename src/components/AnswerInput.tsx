import { AnswerContents } from "@/util/parser";
import { ScoredAnswer } from "@/util/score";
import { Input } from "@chakra-ui/react";
import { useState } from "react";

export type AnswerInputProps = {
  contents: AnswerContents;
  initialValue: string;
  shouldFocus: boolean;
  isRevealed: boolean;
  scoredAnswer: ScoredAnswer | null;
  onChange: (a: string) => void;
  onSubmit: () => void;
};

const AnswerInput = ({
  contents,
  initialValue,
  shouldFocus,
  isRevealed,
  scoredAnswer,
  onChange,
  onSubmit,
}: AnswerInputProps) => {
  const [value, setValue] = useState(initialValue);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      autoFocus={shouldFocus}
      w={`${contents.answerLen * 14}px`}
      px="2"
      py="1"
      rounded="lg"
      value={value}
      onChange={onValueChange}
      onKeyUp={(e) => e.key === "Enter" && onSubmit()}
      placeholder={isRevealed && scoredAnswer ? scoredAnswer.answer : ""}
      color="white"
      _placeholder={{ color: "white" }}
      backgroundColor={
        scoredAnswer
          ? scoredAnswer.isCorrect
            ? "green.600"
            : "red.600"
          : "inherit"
      }
      borderColor={
        scoredAnswer
          ? scoredAnswer.isCorrect
            ? "green.800"
            : "red.800"
          : "inherit"
      }
    />
  );
};

export default AnswerInput;
