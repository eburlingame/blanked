import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const AddQuestionPage = dynamic(() => import("@/components/AddQuestionPage"), {
  ssr: false,
});

export default function AddQuestion() {
  const router = useRouter();
  const { bankId } = router.query;

  return <AddQuestionPage bankId={bankId as string} />;
}
