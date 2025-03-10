import Dexie, { Entity, EntityTable } from "dexie";
import { QuestionType } from "./models";

export class AppDB extends Dexie {
  questions!: EntityTable<QuestionType, "id">;

  constructor() {
    super("blanked-db");
    this.version(1).stores({
      questions: "id",
    });
    this.questions.mapToClass(Question);
  }
}

export class Question extends Entity<AppDB> {
  id!: number;
  name!: string;
  age!: number;

  //   async birthday() {
  //     await this.db.friends.update(this.id, (friend) => ++friend.age);
  //   }
}
