import { StudySessionWithEvents } from "@/state/models";
import { Heading, VStack } from "@chakra-ui/react";

export type QuizSummaryProps = {
  session: StudySessionWithEvents;
};

const QuizSummary = ({ session }: QuizSummaryProps) => {
  return (
    <VStack>
      <Heading as="h2">Questions Complete!</Heading>

      {session.events.length > 0 ? (
        <Heading as="h3" size="md">
          {session.events.length} questions answered
        </Heading>
      ) : (
        <Heading as="h3" size="md">
          No questions answered
        </Heading>
      )}
    </VStack>
  );
};

export default QuizSummary;
