import { StudyEvent } from "@/state/models";
import { add, formatDate, parse, startOfDay } from "date-fns";
import groupBy from "lodash.groupby";

const learningPeriod = 3; // first 3 iterations

const incrementEFactor = (prevEf: number, quality: number) => {
  return Math.max(
    1.3,
    prevEf - 0.8 + 0.28 * quality - 0.02 * quality * quality
  );
};

const computeInterval = (lastInterval: number, eFactor: number) => {
  return Math.round(lastInterval * eFactor) > 0
    ? Math.round(lastInterval * eFactor)
    : 1;
};

type EventAcc = {
  interval: number;
  eFactor: number;
};

type DayAndQuality = {
  day: string;
  lowestQuality: number;
};

const initialInterval: EventAcc = {
  interval: 1,
  eFactor: 2.5,
};

export const getStudyInterval = (days: DayAndQuality[]) => {
  const { interval } = days.reduce(
    (acc: EventAcc, day: DayAndQuality, index: number) => {
      const answerQuality = day.lowestQuality;
      if (answerQuality < 3 || index < learningPeriod) {
        return initialInterval;
      }

      const lastInterval = acc.interval ?? 1;
      const lastEFactor = acc.eFactor ?? 2.5;

      return {
        interval: computeInterval(lastInterval, lastEFactor),
        eFactor: incrementEFactor(lastEFactor, answerQuality),
      };
    },
    initialInterval
  );

  return interval;
};

const DAY_FORMAT = "yyyy-MM-dd";

export const getLowestQualityPerDay = (
  events: StudyEvent[]
): DayAndQuality[] => {
  const eventsByDay = groupBy(events, (event) =>
    formatDate(event.timeCompleted, DAY_FORMAT)
  );

  return Object.entries(eventsByDay).map(([day, events]) => {
    return {
      day,
      lowestQuality: Math.min(...events.map((event) => event.answerQuality)),
    };
  });
};

export const getLastStudyDate = (events: DayAndQuality[]): Date | null => {
  if (!events || events.length === 0) {
    return null;
  }

  const dates = events.map((e) => parse(e.day, DAY_FORMAT, new Date()));
  dates.sort((a, b) => b.getTime() - a.getTime());

  return dates[0];
};

export const getNextStudyDate = (date: Date, events: StudyEvent[]) => {
  const days = getLowestQualityPerDay(events);
  const interval = getStudyInterval(days);
  const lastEvent = getLastStudyDate(days);

  if (!lastEvent) {
    return startOfDay(date);
  }

  return startOfDay(add(lastEvent, { days: interval }));
};
