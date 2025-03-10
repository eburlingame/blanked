import Layout from "@/components/Layout";
import { useImportMarkdown } from "@/state/import";
import { Button, Heading, Input, Tabs, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Import() {
  const router = useRouter();

  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [contents, setContents] = useState("");

  const { mutateAsync: importQuestions } = useImportMarkdown();

  const onImportWithUrl = async () => {
    try {
      setIsImporting(true);
      const response = await fetch(importUrl);
      const contents = await response.text();

      await importQuestions({ contents, url: importUrl });
      router.push(`/banks`);
    } catch (error) {
      alert("Error importing items: " + error);
    }
    setIsImporting(false);
  };

  const onImport = async () => {
    try {
      setIsImporting(true);
      await importQuestions({ contents, url: null });
      router.push(`/banks`);
    } catch (error) {
      alert("Error importing items: " + error);
    }
    setIsImporting(false);
  };

  return (
    <Layout title="Blanked | Import">
      <Heading>Import Questions</Heading>

      <Tabs.Root defaultValue="raw">
        <Tabs.List>
          <Tabs.Trigger value="raw">Import from text</Tabs.Trigger>
          <Tabs.Trigger value="url">Import from URL</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value="raw">
          <Textarea
            placeholder="Paste your markdown here"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={10}
            width="100%"
          />

          <Button mt="2" onClick={onImport} loading={isImporting}>
            Import
          </Button>
        </Tabs.Content>

        <Tabs.Content value="url">
          <Input
            autoFocus={true}
            placeholder="Enter the URL of the markdown file"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
          />

          <Button mt="2" onClick={onImportWithUrl} loading={isImporting}>
            Import
          </Button>
        </Tabs.Content>
      </Tabs.Root>
    </Layout>
  );
}
