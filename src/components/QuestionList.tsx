import { QuestionType } from "@/state/models";
import { useListAllQuestions, useQuestionSearch } from "@/state/queries";
import { Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import EditableQuestionRow from "./EditableQuestionRow";
import Loadable from "./Loadable";

const QuestionList = () => {
  const listQuery = useListAllQuestions(50, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const searchQuestions = useQuestionSearch(searchQuery);

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
      <Input
        placeholder="Filter questions"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && (
        <Loadable query={searchQuestions}>
          {(questions) => renderQuestions(questions)}
        </Loadable>
      )}

      {searchQuery.trim().length === 0 && (
        <Loadable query={listQuery}>
          {(questions) => renderQuestions(questions)}
        </Loadable>
      )}
    </VStack>
  );
};

export default QuestionList;
