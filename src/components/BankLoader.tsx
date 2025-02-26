"use client";

import { useQuestionBank, useQuestionBankWithQuestions } from "@/state/queries";
import Quiz from "./Quiz";

export type BankLoaderProps = {
  bankId: string;
};

const BankLoader = ({ bankId }: BankLoaderProps) => {
  const { data: bank, isLoading: isBankLoading } = useQuestionBank(bankId);
  const { data: questions, isLoading: isQuestionsLoading } =
    useQuestionBankWithQuestions(bankId);

  if (isQuestionsLoading || isBankLoading || !questions || !bank) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Quiz name={bank.name} questions={questions} />
    </>
  );
};

export default BankLoader;
