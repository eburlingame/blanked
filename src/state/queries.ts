import { useBackend } from "@/components/BackendBootstrapper";
import { useQuery } from "@tanstack/react-query";

export const useListQuestionBanks = () => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBanks"],
    queryFn: () => backend.listQuestionBanks(),
  });
};

export const useQuestionBank = (bankId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBank", bankId],
    queryFn: () => backend.getQuestionBank(bankId),
  });
};

export const useQuestionBankWithQuestions = (bankId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBankWithQuestions", bankId],
    queryFn: () => backend.listQuestionsInBank(bankId),
  });
};
