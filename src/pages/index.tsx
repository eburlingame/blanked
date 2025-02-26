import Layout from "@/components/Layout";
import { Button, Heading, HStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

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
          <Heading mb="2">Home</Heading>
          <HStack>
            <Button onClick={() => router.push("/banks")}>
              Question Banks
            </Button>
            <Button onClick={() => router.push("/questions")}>Questions</Button>
            <Button onClick={() => router.push("/sessions")}>Sessions</Button>
          </HStack>

          <HStack mt="2">
            <Button colorPalette="green">Review Now</Button>
          </HStack>
        </main>
      </Layout>
    </>
  );
}
