import { useStartStudySession } from "@/state/mutations";
import { useQuestionsForReview } from "@/state/queries";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Loadable from "./Loadable";

const ReviewButton = () => {
  const router = useRouter();
  const questionsQuery = useQuestionsForReview();

  const { mutateAsync: startStudySession } = useStartStudySession();

  const onClick = async (questionsIds: string[]) => {
    const sessionId = await startStudySession(questionsIds);
    router.push(`/quiz/session/${sessionId}`);
  };

  return (
    <Loadable query={questionsQuery}>
      {(questionIds) => (
        <Button colorPalette="green" onClick={() => onClick(questionIds)}>
          Review Now ({questionIds?.length} questions)
        </Button>
      )}
    </Loadable>
  );
};

export default ReviewButton;
