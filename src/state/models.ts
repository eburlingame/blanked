export type QuestionBankType = {
  id: string;
  name: string;
  originUrl: string;
  description: string;
};

export type DetailedQuestionBankType = QuestionBankType & {
  numberOfQuestions: number;
};

export type NewQuestionBankType = Omit<QuestionBankType, "id">;

export type NewQuestionBankWithQuestionsType = NewQuestionBankType & {
  questions: NewQuestionType[];
};

export type QuestionType = {
  id: string;
  questionBankId: string;
  markdown: string;
  parsedMarkdown: string;
  answers: AnswerType[];
};

export type NewQuestionType = Omit<QuestionType, "id" | "questionBankId">;

export type AnswerType = {
  groupId?: string;
  options: string[];
};

export type StudySession = {
  id: string;
  timeStarted: Date;
  timeEnded: Date | null;
};

export type StudyEvent = {
  id: string;
  timeAnswered: Date;
  sessionId: string;
  questionId: string;
  quality: number;
};

export interface BlankedBackend {
  // Questions
  getQuestion(questionId: string): Promise<QuestionType>;
  addQuestion(questionBank: string, question: NewQuestionType): Promise<string>;
  updateQuestion(
    questionId: string,
    updates: Partial<NewQuestionType>
  ): Promise<void>;
  deleteQuestion(questionId: string): Promise<void>;
  listQuestions(limit: number, offset: number): Promise<QuestionType[]>;
  searchQuestions(query: string): Promise<QuestionType[]>;

  // Question Banks
  addQuestionBank(questionBank: NewQuestionBankType): Promise<string>;
  getQuestionBank(questionBankId: string): Promise<DetailedQuestionBankType>;
  listQuestionBanks(): Promise<DetailedQuestionBankType[]>;
  listQuestionsInBank(bankId: string): Promise<QuestionType[]>;
  deleteQuestionBank(questionBankId: string): Promise<void>;

  // Study
  startStudySession(timeStarted: Date): Promise<string>;
  endStudySession(sessionId: string, timeEnded: Date): Promise<void>;
  markQuestion(
    timeAnswered: Date,
    sessionId: string,
    questionId: string,
    quality: number
  ): Promise<void>;
  listStudySessions(): Promise<StudySession[]>;
}
