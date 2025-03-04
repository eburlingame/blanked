import { useBackend } from "@/components/BackendBootstrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewStudyEvent, NewStudySession } from "./models";

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
