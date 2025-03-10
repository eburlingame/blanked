import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const BankQuestionList = dynamic(
  () => import("@/components/BankQuestionList"),
  {
    ssr: false,
  }
);

export default function BankPage() {
  const router = useRouter();
  const { bankId } = router.query;

  return (
    <Layout title="Blanked | Questions" maxWidth="1000px">
      <BankQuestionList bankId={bankId as string} />
    </Layout>
  );
}
