import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Head from "next/head";

const BankList = dynamic(() => import("@/components/BankList"), {
  ssr: false,
});

export default function Home() {
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
          <BankList />
        </main>
      </Layout>
    </>
  );
}
