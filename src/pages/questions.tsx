import Layout from "@/components/Layout";
import { Button, Heading, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Questions() {
  const router = useRouter();

  return (
    <Layout title="Blanked | Questions">
      <Heading mb="2">Home</Heading>
      <HStack>
        <Button onClick={() => router.push("/banks")}>Question Banks</Button>
        <Button onClick={() => router.push("/questions")}>Questions</Button>
        <Button onClick={() => router.push("/sessions")}>Sessions</Button>
      </HStack>

      <HStack mt="2">
        <Button colorPalette="green">Review Now</Button>
      </HStack>
    </Layout>
  );
}
