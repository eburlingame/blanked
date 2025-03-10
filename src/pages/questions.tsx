import Layout from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const QuestionList = dynamic(() => import("@/components/QuestionList"), {
  ssr: false,
});

export default function Questions() {
  return (
    <Layout title="Blanked | Questions" maxWidth="1000px">
      <Heading mb="2">Questions</Heading>

      <QuestionList />
    </Layout>
  );
}
