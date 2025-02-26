import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";

const BankLoader = dynamic(() => import("@/components/BankLoader"), {
  ssr: false,
});

export default function QuizPage() {
  const router = useRouter();
  const bankId = router.query.bankId as string;

  return (
    <>
      <Head>
        <title>Blanked</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <BankLoader bankId={bankId} />
        </main>
        <footer></footer>
      </Layout>
    </>
  );
}
