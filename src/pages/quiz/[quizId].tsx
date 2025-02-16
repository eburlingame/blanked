import Layout from "@/components/Layout";
import Quiz from "@/components/Quiz";
import { parseQuiz, QuizType } from "@/util/quiz";
import Head from "next/head";
import { useEffect, useState } from "react";

const contents = `
name: AGI Test Questions
description: Hi there
---
What's up *doc*?

This is all *one* question.
---
How's it *going|hanging*?
---
Group [*A*, *B*, or, *C*], and *Q*?
`;

export default function QuizPage() {
  const [result, setResult] = useState<QuizType | null>(null);

  useEffect(() => {
    const a = async () => {
      setResult(await parseQuiz(contents.trim()));
    };
    a();
  }, []);

  console.log(result);

  return (
    <>
      <Head>
        <title>Blanker</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>{result && <Quiz quiz={result} />}</main>
        <footer></footer>
      </Layout>
    </>
  );
}
