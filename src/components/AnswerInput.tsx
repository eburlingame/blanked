import { AnswerContents } from "@/util/quiz";
import { Input } from "@chakra-ui/react";
import { useState } from "react";

export type AnswerInputProps = {
  contents: AnswerContents;
  initialValue: string;
  onChange: (a: string) => void;
  onSubmit: () => void;
};

const AnswerInput = ({
  contents,
  initialValue,
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
      w={contents.answerLen * 8}
      px="2"
      py="1"
      rounded="lg"
      value={value}
      onChange={onValueChange}
      onKeyUp={(e) => e.key === "Enter" && onSubmit()}
      placeholder=""
    />
  );
};

export default AnswerInput;
