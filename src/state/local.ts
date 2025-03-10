import { parseQuestion } from "@/util/parser";
import { getNextStudyDate } from "@/util/review";
import { isBefore, isEqual, parse } from "date-fns";
import Dexie, { EntityTable } from "dexie";
import Fuse from "fuse.js";
import { generate as shortUuid } from "short-uuid";
import {
  BlankedBackend,
  DetailedQuestionBankType,
  NewQuestionBankType,
  NewQuestionType,
  NewStudyEvent,
  NewStudySession,
  QuestionBankType,
  QuestionType,
  StudyEvent,
  StudySession,
  StudySessionWithEvents,
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
      studyEvents: "id,questionId",
    });
  }
  async getQuestion(questionId: string): Promise<QuestionType> {
    const q = await this.db.questions.get(questionId);
    if (!q) {
      throw new Error("Question not found");
    }
    return q;
  }

  async getMultipleQuestions(
    questionIds: string[]
  ): Promise<Record<string, QuestionType>> {
    const questions = await this.db.questions.bulkGet(questionIds);

    return questions
      .filter((q) => q !== undefined)
      .reduce((acc, q) => {
        if (q) acc[q.id] = q;
        return acc;
      }, {} as Record<string, QuestionType>);
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

  async updateQuestion(questionId: string, newMarkdown: string): Promise<void> {
    const parsedQuestion = await parseQuestion(newMarkdown);
    await this.db.questions.update(questionId, parsedQuestion);
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await this.db.questions.delete(questionId);
    await this.db.studyEvents.where("questionId").equals(questionId).delete();
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
    const questions = await this.listQuestionsInBank(questionBankId);
    for (const question of questions) {
      await this.deleteQuestion(question.id);
    }

    await this.db.questionBanks.delete(questionBankId);
  }

  async getStudySession(sessionId: string): Promise<StudySession> {
    const session = await this.db.studySessions.get(sessionId);
    if (!session) {
      throw new Error("Study session not found");
    }
    return session;
  }

  async getStudySessionWithEvents(
    sessionId: string
  ): Promise<StudySessionWithEvents> {
    const session = await this.db.studySessions.get(sessionId);
    if (!session) {
      throw new Error("Study session not found");
    }

    const events = await this.getStudyEventsInSession(sessionId);
    return { ...session, events };
  }

  async getStudyEventsInSession(sessionId: string): Promise<StudyEvent[]> {
    return this.db.studyEvents
      .filter((e) => e.sessionId === sessionId)
      .toArray();
  }

  async startStudySession(newSession: NewStudySession): Promise<string> {
    return this.db.studySessions.add({
      ...newSession,
      id: shortUuid(),
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

  async addStudyEvent(event: NewStudyEvent): Promise<void> {
    await this.db.studyEvents.add({
      ...event,
      id: shortUuid(),
    });
  }

  async getQuestionsForReview(dateStr: string): Promise<string[]> {
    const studyDate = parse(dateStr, "yyyy-MM-dd", new Date());

    const allEvents = await this.db.studyEvents.toArray();
    const allQuestions = await this.db.questions.toArray();

    const eventsByQuestion = allEvents.reduce(
      (acc: Record<string, StudyEvent[]>, event) => {
        if (!acc[event.questionId]) {
          acc[event.questionId] = [];
        }
        acc[event.questionId].push(event);
        return acc;
      },
      {}
    );

    const questionsForReview = allQuestions
      .filter((q) => {
        const events = eventsByQuestion[q.id];
        const nextStudyDate = getNextStudyDate(studyDate, events);

        console.log("nextStudyDate", nextStudyDate);
        console.log("studyDate", studyDate);

        if (
          isBefore(nextStudyDate, studyDate) ||
          isEqual(nextStudyDate, studyDate)
        ) {
          return true;
        }
        return false;
      })
      .map(({ id }) => id);

    return questionsForReview;
  }
}
