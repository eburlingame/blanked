import { useBackend } from "@/components/BackendBootstrapper";
import { useMutation } from "@tanstack/react-query";
import { parseQuestionBank } from "../util/parser";

export const useImportMarkdown = () => {
  const backend = useBackend();

  const importQuestionBank = async (importUrl: string): Promise<string> => {
    const response = await fetch(importUrl);
    const text = await response.text();
    const questionBank = await parseQuestionBank(importUrl, text.trim());

    const bankId = await backend.addQuestionBank(questionBank);
    for (const question of questionBank.questions) {
      await backend.addQuestion(bankId, question);
    }

    return bankId;
  };

  return useMutation({
    mutationKey: ["importQuestionBank"],
    mutationFn: importQuestionBank,
  });
};
