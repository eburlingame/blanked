import Layout from "@/components/Layout";
import { useImportMarkdown } from "@/state/import";
import { Button, Heading, Input } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
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
    <>
      <Head>
        <title>Blanked</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <Link href="/">Home</Link>

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
        </main>
      </Layout>
    </>
  );
}
