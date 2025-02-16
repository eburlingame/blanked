import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Head from "next/head";

const QuizList = dynamic(() => import("@/components/QuizList"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Blanker</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <QuizList />
        </main>
      </Layout>
    </>
  );
}
