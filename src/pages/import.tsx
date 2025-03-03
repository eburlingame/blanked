import Layout from "@/components/Layout";
import { useImportMarkdown } from "@/state/import";
import { Button, Heading, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Import() {
  const router = useRouter();

  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  const { mutateAsync: importQuestions } = useImportMarkdown();

  const doImport = async () => {
    try {
      setIsImporting(true);
      await importQuestions(importUrl);
      router.push(`/banks`);
    } catch (error) {
      alert("Error importing items: " + error);
    }
    setIsImporting(false);
  };

  return (
    <Layout title="Blanked | Import">
      <Heading>Import Questions from Markdown</Heading>

      <Input
        mt="4"
        autoFocus={true}
        placeholder="Enter the URL of the markdown file"
        value={importUrl}
        onChange={(e) => setImportUrl(e.target.value)}
      />
      <Button mt="2" onClick={doImport} loading={isImporting}>
        Import
      </Button>
    </Layout>
  );
}
