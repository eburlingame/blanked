import Layout from "@/components/Layout";
import { NewQuestionType } from "@/state/models";
import { useAddQuestions } from "@/state/mutations";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ImportQuestionsForm = dynamic(
  () => import("@/components/ImportQuestionsForm"),
  {
    ssr: false,
  }
);

export default function AddQuestionPage() {
  const router = useRouter();
  const { bankId } = router.query;

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
}
