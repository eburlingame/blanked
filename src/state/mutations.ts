import { useBackend } from "@/components/BackendBootstrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewQuestionType, NewStudyEvent, NewStudySession } from "./models";

export const useUpdateQuestion = (questionId: string) => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateQuestion", questionId],
    mutationFn: ({ markdown }: { markdown: string }) =>
      backend.updateQuestion(questionId, markdown),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getQuestion", questionId] });
      queryClient.invalidateQueries({ queryKey: ["listQuestions"] });
      queryClient.invalidateQueries({
        queryKey: ["questionBankWithQuestions"],
      });
      queryClient.invalidateQueries({ queryKey: ["questionsSearch"] });
    },
  });
};

export const useDeleteQuestion = () => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteQuestion"],
    mutationFn: ({ questionId }: { questionId: string }) =>
      backend.deleteQuestion(questionId),
    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: ["getQuestion", questionId] });
      queryClient.invalidateQueries({ queryKey: ["listQuestions"] });
      queryClient.invalidateQueries({
        queryKey: ["questionBankWithQuestions"],
      });
      queryClient.invalidateQueries({ queryKey: ["questionsSearch"] });
    },
  });
};

export type AddQuestionParams = {
  questionBankId: string;
  questions: NewQuestionType[];
};

export const useAddQuestions = () => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addQuestions"],
    mutationFn: ({ questionBankId, questions }: AddQuestionParams) => {
      return Promise.all(
        questions.map((q) => backend.addQuestion(questionBankId, q))
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getQuestion"] });
      queryClient.invalidateQueries({ queryKey: ["listQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questionsSearch"] });
      queryClient.invalidateQueries({ queryKey: ["listQuestionBanks"] });
    },
  });
};

export const useDeleteQuestionBank = () => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteQuestionBank"],
    mutationFn: ({ questionBankId }: { questionBankId: string }) =>
      backend.deleteQuestionBank(questionBankId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getQuestion"] });
      queryClient.invalidateQueries({ queryKey: ["listQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questionsSearch"] });
      queryClient.invalidateQueries({ queryKey: ["listQuestionBanks"] });
    },
  });
};

export const useStartStudySession = () => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  const startStudySession = async (questionIds: string[]) => {
    const session: NewStudySession = {
      questionIds,
      timeStarted: new Date(),
      timeEnded: null,
    };

    return backend.startStudySession(session);
  };

  return useMutation({
    mutationKey: ["startStudySession"],
    mutationFn: startStudySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "studySessions" });
    },
  });
};

export const useAddStudyEvent = () => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addStudyEvent"],
    mutationFn: (event: NewStudyEvent) => backend.addStudyEvent(event),
    onSuccess: (_, event) => {
      queryClient.invalidateQueries({
        queryKey: ["studySession", event.sessionId],
      });
    },
  });
};
