import { useBackend } from "@/components/BackendBootstrapper";
import { useQuery } from "@tanstack/react-query";

export const useListQuestionBanks = () => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBanks"],
    queryFn: () => backend.listQuestionBanks(),
  });
};

export const useListAllQuestions = (limit: number, offset: number) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["listQuestions"],
    queryFn: () => backend.listQuestions(limit, offset),
  });
};

export const useQuestionSearch = (query: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionsSearch", query],
    queryFn: () => backend.searchQuestions(query),
  });
};

export const useQuestionBank = (bankId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBank", bankId],
    queryFn: () => backend.getQuestionBank(bankId),
  });
};

export const useQuestion = (questionId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => backend.getQuestion(questionId),
  });
};

export const useQuestionBankWithQuestions = (bankId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["questionBankWithQuestions", bankId],
    queryFn: () => backend.listQuestionsInBank(bankId),
  });
};

export const useStudySession = (sessionId: string) => {
  const backend = useBackend();

  return useQuery({
    queryKey: ["studySession", sessionId],
    queryFn: async () => {
      const session = await backend.getStudySession(sessionId);
      const events = await backend.getStudyEventsInSession(sessionId);
      return { ...session, events };
    },
  });
};
