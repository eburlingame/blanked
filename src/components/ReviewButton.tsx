import { useStartStudySession } from "@/state/mutations";
import { useQuestionsForReview } from "@/state/queries";
import { Button, HStack } from "@chakra-ui/react";
import { formatDate, startOfTomorrow } from "date-fns";
import { useRouter } from "next/router";
import Loadable from "./Loadable";

const ReviewButton = () => {
  const router = useRouter();

  const today = formatDate(new Date(), "yyyy-MM-dd");
  const tomorrow = formatDate(startOfTomorrow(), "yyyy-MM-dd");

  const todayQuery = useQuestionsForReview(today);
  const tomorrowQuery = useQuestionsForReview(tomorrow);

  const { mutateAsync: startStudySession } = useStartStudySession();

  const onClick = async (questionsIds: string[]) => {
    const sessionId = await startStudySession(questionsIds);
    router.push(`/quiz/session/${sessionId}`);
  };

  return (
    <HStack>
      <Loadable query={todayQuery}>
        {(questionIds) => (
          <Button
            colorPalette="green"
            disabled={questionIds.length === 0}
            onClick={() => onClick(questionIds)}
          >
            Review current ({questionIds?.length} questions)
          </Button>
        )}
      </Loadable>
      <Loadable query={tomorrowQuery}>
        {(questionIds) => (
          <Button
            colorPalette="gray"
            disabled={questionIds.length === 0}
            onClick={() => onClick(questionIds)}
          >
            Review next ({questionIds?.length} questions)
          </Button>
        )}
      </Loadable>
    </HStack>
  );
};

export default ReviewButton;
