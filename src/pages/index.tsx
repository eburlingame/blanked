import Layout from "@/components/Layout";
import { Button, Heading, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { LuDownload, LuQuote, LuWalletCards } from "react-icons/lu";

const ReviewButton = dynamic(() => import("@/components/ReviewButton"), {
  ssr: false,
});

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
        {/* <Button flex="1" onClick={() => router.push("/sessions")}>
          <LuAppWindow />
          Sessions
        </Button> */}
        <Button flex="1" onClick={() => router.push("/export")}>
          <LuDownload />
          Export
        </Button>
      </HStack>

      <HStack mt="2" w="full">
        <ReviewButton />
      </HStack>
    </Layout>
  );
}
