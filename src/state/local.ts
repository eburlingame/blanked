import Dexie, { EntityTable } from "dexie";
import { generate as shortUuid } from "short-uuid";
import {
  BlankedBackend,
  NewQuestionBankType,
  NewQuestionType,
  QuestionBankType,
  QuestionType,
  StudyEvent,
  StudySession,
} from "./models";

export type AppDB = Dexie & {
  questions: EntityTable<QuestionType, "id">;
  questionBanks: EntityTable<QuestionBankType, "id">;
  studySessions: EntityTable<StudySession, "id">;
  studyEvents: EntityTable<StudyEvent, "id">;
};

export class LocalBackend implements BlankedBackend {
  db: AppDB;

  constructor() {
    this.db = new Dexie("blanked") as AppDB;

    this.db.version(1).stores({
      questions: "id",
      questionBanks: "id",
      studySessions: "id",
      studyEvents: "id",
    });
  }

  async getQuestion(questionId: string): Promise<QuestionType> {
    const q = await this.db.questions.get(questionId);
    if (!q) {
      throw new Error("Question not found");
    }
    return q;
  }

  async addQuestion(
    questionBankId: string,
    question: NewQuestionType
  ): Promise<string> {
    const questionId = shortUuid();
    return this.db.questions.add({
      ...question,
      id: questionId,
      questionBankId,
    });
  }

  async updateQuestion(
    questionId: string,
    updates: Partial<NewQuestionType>
  ): Promise<void> {
    await this.db.questions.update(questionId, updates);
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await this.db.questions.delete(questionId);
  }

  async listQuestions(): Promise<QuestionType[]> {
    return this.db.questions.toArray();
  }

  async addQuestionBank(questionBank: NewQuestionBankType): Promise<string> {
    return this.db.questionBanks.add({
      ...questionBank,
      id: shortUuid(),
    });
  }

  async getQuestionBank(questionBankId: string): Promise<QuestionBankType> {
    const qb = await this.db.questionBanks.get(questionBankId);
    if (!qb) {
      throw new Error("Question bank not found");
    }
    return qb;
  }

  async listQuestionsInBank(bankId: string): Promise<QuestionType[]> {
    return this.db.questions
      .filter((q) => q.questionBankId === bankId)
      .toArray();
  }

  async listQuestionBanks(): Promise<QuestionBankType[]> {
    return this.db.questionBanks.toArray();
  }

  async deleteQuestionBank(questionBankId: string): Promise<void> {
    await this.db.questionBanks.delete(questionBankId);
  }

  async startStudySession(timeStarted: Date): Promise<string> {
    return this.db.studySessions.add({
      id: shortUuid(),
      timeStarted,
      timeEnded: null,
    });
  }

  async endStudySession(sessionId: string, timeEnded: Date): Promise<void> {
    const session = await this.db.studySessions.get(sessionId);
    if (!session) {
      throw new Error("Study session not found");
    }

    await this.db.studySessions.update(sessionId, { timeEnded: timeEnded });
  }

  async listStudySessions(): Promise<StudySession[]> {
    return this.db.studySessions.toArray();
  }

  async markQuestion(
    timeAnswered: Date,
    sessionId: string,
    questionId: string,
    quality: number
  ): Promise<void> {
    await this.db.studyEvents.add({
      id: shortUuid(),
      timeAnswered,
      sessionId,
      questionId,
      quality,
    });
  }
}
