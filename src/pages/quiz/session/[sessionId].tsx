import Layout from "@/components/Layout";
import Quiz from "@/components/Quiz";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const BankLoader = dynamic(() => import("@/components/BankLoader"), {
  ssr: false,
});

export default function QuizPage() {
  const router = useRouter();
  const sessionId = router.query.sessionId as string;

  return (
    <Layout title={`Blanked | Study`}>
      <Quiz sessionId={sessionId} />
    </Layout>
  );
}
