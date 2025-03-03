import Layout from "@/components/Layout";
import QuestionList from "@/components/QuestionList";
import { Heading } from "@chakra-ui/react";

export default function Questions() {
  return (
    <Layout title="Blanked | Questions" maxWidth="900px">
      <Heading mb="2">Questions</Heading>
      <QuestionList />
    </Layout>
  );
}
