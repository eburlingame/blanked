import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Quiz = dynamic(() => import("@/components/Quiz"), {
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
