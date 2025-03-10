import { QuestionType } from "@/state/models";
import { useDeleteQuestion, useUpdateQuestion } from "@/state/mutations";
import { Box, HStack, IconButton, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { LuTrash } from "react-icons/lu";

export type EditableQuestionRowProps = {
  q: QuestionType;
};

const EditableQuestionRow = ({ q }: EditableQuestionRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(q.markdown);

  const { mutateAsync: updateQuestion } = useUpdateQuestion(q.id);
  const { mutateAsync: deleteQuestion } = useDeleteQuestion();

  const onUpdate = async () => {
    await updateQuestion({ markdown });
    setIsEditing(false);
  };

  const onDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this question?`
    );

    if (confirm) {
      setIsEditing(false);
      await deleteQuestion({ questionId: q.id });
    }
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

      <IconButton
        aria-label="Delete question"
        onClick={onDelete}
        variant="ghost"
        colorPalette="red"
      >
        <LuTrash />
      </IconButton>
    </HStack>
  );
};

export default EditableQuestionRow;
