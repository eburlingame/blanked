import { StudyEvent } from "@/state/models";
import { add, startOfToday } from "date-fns";

const learningPeriod = 3; // first 3 iterations

type EventAcc = {
  interval: number;
  lastInterval: number | null;
  eFactor: number;
  lastEFactor: number | null;
};

export const getStudyInterval = (events: StudyEvent[]) => {
  const { interval } = events.reduce(
    (acc: EventAcc, event) => {
      const answerQuality = event.answerQuality;
      if (answerQuality < 3) {
        return acc;
      }

      const lastInterval = acc.lastInterval ?? 1;
      const lastEFactor = acc.lastEFactor ?? 2.5;

      let interval = 0;
      let eFactor = 0;

      if (answerQuality < learningPeriod) {
        interval = 1;
        eFactor = 2.5;
      } else {
        interval =
          Math.round(lastInterval * lastEFactor) > 0
            ? Math.round(lastInterval * lastEFactor)
            : 1;
        eFactor = Math.max(
          lastEFactor +
            0.1 -
            (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02),
          1.3
        );
      }

      return {
        interval,
        lastInterval: interval,
        eFactor,
        lastEFactor: eFactor,
      };
    },
    {
      interval: 1,
      lastInterval: null,
      eFactor: 2.5,
      lastEFactor: null,
    }
  );

  return interval;
};

export const getLastStudyDate = (events: StudyEvent[]) => {
  const maxDate = new Date(
    Math.max(...events.map((event) => event.timeCompleted.getTime()))
  );

  const lastEvent = events.find((event) => event.timeCompleted === maxDate);
  if (!lastEvent) {
    return null;
  }

  return new Date(lastEvent.timeCompleted);
};

export const getNextStudyDate = (events: StudyEvent[]) => {
  const interval = getStudyInterval(events);
  console.log(interval);

  const lastEvent = getLastStudyDate(events);
  if (!lastEvent) {
    return startOfToday();
  }

  return add(lastEvent, { days: interval });
};
