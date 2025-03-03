import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const BankLoader = dynamic(() => import("@/components/BankLoader"), {
  ssr: false,
});

export default function QuizPage() {
  const router = useRouter();
  const bankId = router.query.bankId as string;

  return (
    <Layout title={`Blanked | Study`}>
      <BankLoader bankId={bankId} />
    </Layout>
  );
}
