import { useImportMarkdown } from "@/state/import";
import { Button, Input, Tabs, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const ImportPage = () => {
  const router = useRouter();

  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      const fullContents =
        `\nname: "${title}"\ndescription: "${description}"\n---\n${contents}`.trim();

      await importQuestions({ contents: fullContents, url: null });
      router.push(`/banks`);
    } catch (error) {
      alert("Error importing items: " + error);
    }
    setIsImporting(false);
  };

  return (
    <Tabs.Root defaultValue="raw">
      <Tabs.List>
        <Tabs.Trigger value="raw">Import from text</Tabs.Trigger>
        <Tabs.Trigger value="url">Import from URL</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value="raw">
        <Input
          autoFocus={true}
          placeholder="Question bank name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Question bank description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mt="2"
          mb="2"
          width="100%"
        />

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
  );
};

export default ImportPage;
