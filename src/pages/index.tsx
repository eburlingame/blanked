import Layout from "@/components/Layout";
import Head from "next/head";

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
        <main>Recent Quizzes</main>
        <footer></footer>
      </Layout>
    </>
  );
}
