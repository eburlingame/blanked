"use client";

import { useQuestionBank, useQuestionBankWithQuestions } from "@/state/queries";
import Loadable from "./Loadable";
import Quiz from "./Quiz";

export type BankLoaderProps = {
  bankId: string;
};

const BankLoader = ({ bankId }: BankLoaderProps) => {
  const questionBankQuery = useQuestionBank(bankId);
  const questionsQuery = useQuestionBankWithQuestions(bankId);

  return (
    <Loadable query={questionBankQuery}>
      {(bank) => (
        <Loadable query={questionsQuery}>
          {(questions) => <Quiz name={bank.name} questions={questions} />}
        </Loadable>
      )}
    </Loadable>
  );
};

export default BankLoader;
