import { useBackend } from "@/components/BackendBootstrapper";
import { useMutation } from "@tanstack/react-query";
import { parseQuestionBank } from "../util/parser";

export type ImportParams = {
  contents: string;
  url: string | null;
};

export const useImportMarkdown = () => {
  const backend = useBackend();

  const importQuestionBank = async ({
    contents,
    url,
  }: ImportParams): Promise<string> => {
    const { questions, ...questionBank } = await parseQuestionBank(
      url,
      contents.trim()
    );

    const bankId = await backend.addQuestionBank(questionBank);
    for (const question of questions) {
      await backend.addQuestion(bankId, question);
    }

    return bankId;
  };

  return useMutation({
    mutationKey: ["importQuestionBank"],
    mutationFn: importQuestionBank,
  });
};
