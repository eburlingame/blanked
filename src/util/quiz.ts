/* eslint-disable @typescript-eslint/no-explicit-any */
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { parse } from "yaml";

export type QuizType = {
  name: string;
  description: string;
  questions: QuizQuestionType[];
};

export type QuizQuestionType = {
  markdown: string;
  answers: string[];
};

export type QuizAnswerType = {
  groupId?: string;
  options: string[];
};

export const parseQuiz = async (contents: string) => {
  const splitPattern = /---\n/g;
  const parts = contents.split(splitPattern);

  const frontMatter = parseFrontMatter(parts[0]);
  const questions = await Promise.all(parts.splice(1).map(parseQuestion));

  return {
    name: frontMatter.name,
    description: frontMatter.description,
    questions,
  };
};

const parseFrontMatter = (yamlSection: string) => {
  const frontMatterValue = parse(yamlSection);

  if (!frontMatterValue || typeof frontMatterValue !== "object") {
    throw new Error("Invalid front matter");
  }

  if (!frontMatterValue.name) {
    throw new Error("Missing name in front matter");
  }

  return {
    name: frontMatterValue.name,
    description: frontMatterValue.description || "",
  };
};

const parseQuestion = async (questionString: string) => {
  const ast = await unified()
    .use(remarkParse)
    .use(answerRemarkPlugin)
    .use(remarkStringify)
    .parse(questionString);

  console.log(ast);

  const contents = await unified()
    .use(remarkParse)
    .use(answerRemarkPlugin)
    .use(remarkStringify)
    .process(questionString);

  function answerRemarkPlugin() {
    return function (tree: any, file: any) {
      visit(tree, function (node) {
        if (node.type === "root") {
          file.answers = [];
          file.numGroups = 0;
          file.groupId = undefined;
        }

        if (node.type === "emphasis") {
          const answer = {
            groupId: file.groupId,
            options: node.children[0].value
              .split("|")
              .map((s: string) => s.trim()),
          };

          if (file.answers) {
            file.answers.push(answer);
          } else {
            file.answers = [answer];
          }
        }

        if (node.type === "text") {
          const openBracket = node.value.indexOf("[");
          if (openBracket !== -1) {
            file.numGroups++;
            file.groupId = file.numGroups;
          }

          const closeBracket = node.value.indexOf("]");
          if (closeBracket !== -1) {
            file.groupId = undefined;
          }
        }
      });
    };
  }

  return {
    markdown: contents.toString(),
    answers: contents.answers || [],
  };
};
