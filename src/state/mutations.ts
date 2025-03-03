import { useBackend } from "@/components/BackendBootstrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateQuestion = (questionId: string) => {
  const backend = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateQuestion", questionId],
    mutationFn: ({ markdown }: { markdown: string }) =>
      backend.updateQuestion(questionId, { markdown }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getQuestion", questionId] });
      queryClient.invalidateQueries({ queryKey: ["listQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questionsSearch"] });
    },
  });
};
