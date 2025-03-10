import { useStudySession } from "@/state/queries";
import Loadable from "./Loadable";
import QuizSequencer from "./QuizSequencer";

export type QuizProps = {
  sessionId: string;
};

const Quiz = ({ sessionId }: QuizProps) => {
  const sessionQuery = useStudySession(sessionId);

  return (
    <Loadable query={sessionQuery}>
      {(session) => <QuizSequencer session={session} />}
    </Loadable>
  );
};

export default Quiz;
