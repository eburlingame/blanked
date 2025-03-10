import { QuestionType } from "@/state/models";
import { useQuestionBankWithQuestions } from "@/state/queries";
import { Button, HStack, Input, VStack } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import EditableQuestionRow from "./EditableQuestionRow";
import Loadable from "./Loadable";
import { useRouter } from "next/router";

export type BankQuestionListProps = {
  bankId: string;
};

const BankQuestionList = ({ bankId }: BankQuestionListProps) => {
  const router = useRouter();

  const listQuery = useQuestionBankWithQuestions(bankId);

  const [searchQuery, setSearchQuery] = useState("");

  const searchQuestions = useMemo(() => {
    const fuse = new Fuse(listQuery.data || [], {
      keys: ["markdown"],
    });

    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, listQuery.data]);

  const renderQuestions = (questions: QuestionType[]) => {
    return (
      <>
        {questions.map((q) => (
          <EditableQuestionRow key={q.id} q={q} />
        ))}
      </>
    );
  };

  return (
    <VStack alignItems="stretch">
      <HStack>
        <Input
          placeholder="Filter questions"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          colorPalette="green"
          onClick={() => router.push(`/banks/${bankId}/add`)}
        >
          Add Questions
        </Button>
      </HStack>

      {searchQuery.trim().length > 0 && renderQuestions(searchQuestions)}

      {searchQuery.trim().length === 0 && (
        <Loadable query={listQuery}>
          {(questions) => renderQuestions(questions)}
        </Loadable>
      )}
    </VStack>
  );
};

export default BankQuestionList;
