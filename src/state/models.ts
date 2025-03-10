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
  questionIds: string[];
  timeStarted: Date;
  timeEnded: Date | null;
};

export type NewStudySession = Omit<StudySession, "id">;

export type StudyEvent = {
  id: string;
  sessionId: string;
  incorrectAnswerIndexes: number[];
  timeDisplayed: Date;
  timeStarted: Date;
  timeCompleted: Date;
  questionId: string;
  answerQuality: number;
};

export type NewStudyEvent = Omit<StudyEvent, "id">;

export type StudySessionWithEvents = StudySession & { events: StudyEvent[] };

/*
Answer qualities:
0: reveal with no attempts
1: 3 or more attempts
2: 
3: all correct on second try
4: 
5: all correct on first try
*/

export enum AnswerQuality {
  RevealWithNoAttempts = 0,
  ThreeOrMoreAttempts = 1,
  AllCorrectOnSecondTry = 3,
  AllCorrectOnFirstTry = 5,
}

export interface BlankedBackend {
  // Questions
  getQuestion(questionId: string): Promise<QuestionType>;
  getMultipleQuestions(
    questionIds: string[]
  ): Promise<Record<string, QuestionType>>;
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
  getStudySession(sessionId: string): Promise<StudySession>;
  getStudySessionWithEvents(sessionId: string): Promise<StudySessionWithEvents>;
  startStudySession(timeStarted: NewStudySession): Promise<string>;
  endStudySession(sessionId: string, timeEnded: Date): Promise<void>;
  addStudyEvent(event: NewStudyEvent): Promise<void>;
  listStudySessions(): Promise<StudySession[]>;

  // Review
  getQuestionsForReview(): Promise<string[]>;
}
