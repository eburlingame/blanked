import { QuestionType } from "@/state/models";
import { useUpdateQuestion } from "@/state/mutations";
import { Box, HStack, Textarea } from "@chakra-ui/react";
import { useState } from "react";

export type EditableQuestionRowProps = {
  q: QuestionType;
};

const EditableQuestionRow = ({ q }: EditableQuestionRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(q.markdown);

  const { mutateAsync: updateQuestion } = useUpdateQuestion(q.id);

  const onUpdate = async () => {
    await updateQuestion({ markdown });
    setIsEditing(false);
  };

  return (
    <HStack
      key={q.id}
      justifyContent="space-between"
      _hover={{ bg: "gray.700" }}
      p={2}
    >
      <Box mr="4" minWidth={"200px"}>
        {q.id}
      </Box>

      {!isEditing ? (
        <pre
          style={{ flex: 1, whiteSpace: "pre-line" }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {q.markdown}
        </pre>
      ) : (
        <Textarea
          autoFocus
          flex="1"
          fontSize="16px"
          fontFamily="monospace"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onBlur={onUpdate}
          minHeight="200px"
        />
      )}
    </HStack>
  );
};

export default EditableQuestionRow;
