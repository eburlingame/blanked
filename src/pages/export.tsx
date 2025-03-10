import Layout from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const ImportExport = dynamic(() => import("@/components/ImportExport"), {
  ssr: false,
});

export default function ExportPage() {
  return (
    <Layout title="Blanked | Home">
      <Heading mb="2">Export Database</Heading>
      <ImportExport />
    </Layout>
  );
}
