import Layout from "@/components/Layout";
import ReviewButton from "@/components/ReviewButton";
import { Button, Heading, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LuAppWindow, LuQuote, LuWalletCards } from "react-icons/lu";

export default function Home() {
  const router = useRouter();

  return (
    <Layout title="Blanked | Home" homeButton={false}>
      <Heading mb="2">Home</Heading>

      <HStack alignItems="stretch" w="full">
        <Button flex="1" onClick={() => router.push("/banks")}>
          <LuWalletCards />
          Banks
        </Button>
        <Button flex="1" onClick={() => router.push("/questions")}>
          <LuQuote />
          Questions
        </Button>
        <Button flex="1" onClick={() => router.push("/sessions")}>
          <LuAppWindow />
          Sessions
        </Button>
      </HStack>

      <HStack mt="2" w="full">
        <ReviewButton />
      </HStack>
    </Layout>
  );
}
