import { useBackend } from "@/components/BackendBootstrapper";
import { useStartStudySession } from "./mutations";

export const useStartBankStudySession = () => {
  const backend = useBackend();

  const { mutateAsync: startSession } = useStartStudySession();

  const onReview = async (bankId: string) => {
    const questions = await backend.listQuestionsInBank(bankId);
    const sessionId = await startSession(questions.map((q) => q.id));

    return sessionId;
  };

  return {
    onReview,
  };
};
