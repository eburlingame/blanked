import Dexie, { EntityTable } from "dexie";
import Fuse from "fuse.js";
import { generate as shortUuid } from "short-uuid";
import {
  BlankedBackend,
  DetailedQuestionBankType,
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

  async listQuestions(limit: number, offset: number): Promise<QuestionType[]> {
    return this.db.questions.offset(offset).limit(limit).toArray();
  }

  async searchQuestions(query: string): Promise<QuestionType[]> {
    const allQuestions = await this.db.questions.toArray();
    const fuse = new Fuse<QuestionType>(allQuestions, {
      keys: ["markdown"],
    });

    return fuse.search(query).map((r) => r.item);
  }

  async addQuestionBank(questionBank: NewQuestionBankType): Promise<string> {
    return this.db.questionBanks.add({
      ...questionBank,
      id: shortUuid(),
    });
  }

  async getQuestionBank(
    questionBankId: string
  ): Promise<DetailedQuestionBankType> {
    const qb = await this.db.questionBanks.get(questionBankId);
    if (!qb) {
      throw new Error("Question bank not found");
    }

    const questions = await this.listQuestionsInBank(qb.id).then(
      (qs) => qs.length
    );

    return { ...qb, numberOfQuestions: questions };
  }

  async listQuestionsInBank(bankId: string): Promise<QuestionType[]> {
    return this.db.questions
      .filter((q) => q.questionBankId === bankId)
      .toArray();
  }

  async listQuestionBanks(): Promise<DetailedQuestionBankType[]> {
    const qbs = await this.db.questionBanks.toArray();
    const allQuestions = await this.db.questions.toArray();

    return qbs.map((qb) => {
      const questions = allQuestions.filter((q) => q.questionBankId === qb.id);
      return { ...qb, numberOfQuestions: questions.length };
    });
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
