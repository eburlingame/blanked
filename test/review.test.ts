import { StudyEvent } from "@/state/models";
import { getLastStudyDate, getNextStudyDate } from "@/util/review";
import { formatDate, parse } from "date-fns";
import uuid from "short-uuid";
import { describe, expect, test } from "vitest";

const testEvent = (dateStr: string, quality: number): StudyEvent => {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());

  return {
    id: uuid.generate(),
    sessionId: "session-id",
    incorrectAnswerIndexes: [],
    timeDisplayed: date,
    timeStarted: date,
    timeCompleted: date,
    questionId: "question-id",
    answerQuality: quality,
  };
};

describe("getNextStudyDate", () => {
  test("no events should be next day", () => {
    const nextStudyDate = getLastStudyDate([
      { day: "2024-03-15", lowestQuality: 1 },
      { day: "2024-03-16", lowestQuality: 1 },
      { day: "2024-03-17", lowestQuality: 1 },
    ]);
    expect(formatDate(nextStudyDate!, "yyyy-MM-dd")).toBe("2024-03-17");
  });
});

const verifyNextStudyDate = (
  events: StudyEvent[],
  expectedDate: string
): void => {
  const currentDate = parse("2024-03-01", "yyyy-MM-dd", new Date());
  const nextStudyDate = getNextStudyDate(currentDate, events);
  const actualDate = formatDate(nextStudyDate, "yyyy-MM-dd");

  expect(actualDate).toBe(expectedDate);
};

describe("getNextStudyDate", () => {
  test("no events should be next day", () => {
    const events: StudyEvent[] = [];
    verifyNextStudyDate(events, "2024-03-01");
  });

  test("single event success", () => {
    const events: StudyEvent[] = [testEvent("2024-03-01", 5)];
    verifyNextStudyDate(events, "2024-03-02");
  });

  test("single event failure", () => {
    const events: StudyEvent[] = [testEvent("2024-03-01", 1)];
    verifyNextStudyDate(events, "2024-03-02");
  });

  test("within learning period", () => {
    const events: StudyEvent[] = [
      testEvent("2024-03-01", 5),
      testEvent("2024-03-01", 3),
      testEvent("2024-03-01", 1),
    ];
    verifyNextStudyDate(events, "2024-03-02");
  });

  test("just outside of learning period", () => {
    const events: StudyEvent[] = [
      testEvent("2024-03-01", 5),
      testEvent("2024-03-02", 5),
      testEvent("2024-03-03", 5),
      testEvent("2024-03-04", 5),
    ];
    verifyNextStudyDate(events, "2024-03-07");
  });

  test("well outside of learning period", () => {
    const events: StudyEvent[] = [
      testEvent("2024-03-01", 5),
      testEvent("2024-03-02", 5),
      testEvent("2024-03-03", 5),
      testEvent("2024-03-04", 5),
      testEvent("2024-03-07", 5),
    ];
    verifyNextStudyDate(events, "2024-03-15");
  });

  test("should reset after a failure", () => {
    const events: StudyEvent[] = [
      testEvent("2024-03-01", 5),
      testEvent("2024-03-02", 5),
      testEvent("2024-03-03", 5),
      testEvent("2024-03-04", 5),
      testEvent("2024-03-07", 2),
    ];
    verifyNextStudyDate(events, "2024-03-08");
  });

  test("should lower the e-factor", () => {
    const events: StudyEvent[] = [
      testEvent("2024-03-01", 2),
      testEvent("2024-03-02", 3),
      testEvent("2024-03-03", 5),
      testEvent("2024-03-04", 3),
      testEvent("2024-03-07", 5),
    ];
    verifyNextStudyDate(events, "2024-03-14");
  });
});
