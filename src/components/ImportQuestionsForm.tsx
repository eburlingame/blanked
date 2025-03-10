import { NewQuestionType } from "@/state/models";
import { parseQuestion } from "@/util/parser";
import { Button, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";

export type ImportQuestionsFormProps = {
  onImport: (newQuestions: NewQuestionType[]) => void;
};

const ImportQuestionsForm = ({ onImport }: ImportQuestionsFormProps) => {
  const [contents, setContents] = useState("");

  const doImport = async () => {
    const parsedQuestions = await Promise.all(
      contents.split("---\n").map((text) => parseQuestion(text))
    );

    onImport(parsedQuestions);
  };

  return (
    <VStack>
      <Textarea
        placeholder="Paste your markdown here"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        rows={10}
        width="100%"
      />

      <Button onClick={doImport}>Add Questions</Button>
    </VStack>
  );
};

export default ImportQuestionsForm;
