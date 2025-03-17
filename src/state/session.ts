import { useBackend } from "@/components/BackendBootstrapper";
import shuffle from "knuth-shuffle-seeded";
import { useStartStudySession } from "./mutations";

export const useStartBankStudySession = () => {
  const backend = useBackend();

  const { mutateAsync: startSession } = useStartStudySession();

  const onReview = async (bankId: string) => {
    const questions = await backend.listQuestionsInBank(bankId);
    const questionIds = shuffle(questions.map((q) => q.id));
    const sessionId = await startSession(questionIds);

    return sessionId;
  };

  return {
    onReview,
  };
};
