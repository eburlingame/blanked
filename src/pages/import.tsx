import Layout from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const ImportPage = dynamic(() => import("@/components/ImportPage"), {
  ssr: false,
});

export default function Import() {
  return (
    <Layout title="Blanked | Import">
      <Heading>Import Questions</Heading>
      <ImportPage />
    </Layout>
  );
}
