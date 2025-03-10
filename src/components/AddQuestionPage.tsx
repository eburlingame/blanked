import { NewQuestionType } from "@/state/models";
import { useAddQuestions } from "@/state/mutations";
import { Heading } from "@chakra-ui/react";
import router from "next/router";
import ImportQuestionsForm from "./ImportQuestionsForm";
import Layout from "./Layout";

export type AddQuestionPageProps = { bankId: string };

const AddQuestionPage = ({ bankId }: AddQuestionPageProps) => {
  const { mutateAsync: onAddQuestions } = useAddQuestions();

  const onImport = async (newQuestions: NewQuestionType[]) => {
    await onAddQuestions({
      questionBankId: bankId as string,
      questions: newQuestions,
    });

    router.push(`/banks/${bankId}`);
  };

  return (
    <Layout title="Blanked | Add Questions" maxWidth="1000px">
      <Heading>Add Questions</Heading>
      <ImportQuestionsForm onImport={onImport} />
    </Layout>
  );
};

export default AddQuestionPage;
