/* eslint-disable @typescript-eslint/no-explicit-any */
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import slugify from "slugify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { parse } from "yaml";

export type QuizType = {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestionType[];
};

export type QuizQuestionType = {
  markdown: string;
  answers: QuizAnswerType[];
};

export type QuizAnswerType = {
  groupId?: string;
  options: string[];
};

export const parseQuiz = async (contents: string): Promise<QuizType> => {
  const splitPattern = /---\n/g;
  const parts = contents.split(splitPattern);

  const frontMatter = parseFrontMatter(parts[0]);
  const questions = await Promise.all(parts.splice(1).map(parseQuestion));

  return {
    id: slugify(frontMatter.name),
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
  const contents = await unified()
    .use(remarkParse)
    .use(remarkGfm)
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
          const answer: QuizAnswerType = {
            groupId: file.groupId,
            options: node.children[0].value
              .split("|")
              .map((s: string) => s.trim()),
          };

          const questionLength = Math.max(
            ...answer.options.map((o) => o.length)
          );

          node.children = node.children.map((child: any) => {
            if (child.type === "text") {
              return {
                type: "text",
                value: encodeAnswerContents(
                  file.answers.length,
                  questionLength
                ),
              };
            }
            return child;
          });

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

          node.value = node.value.replace(/\[|\]/g, "");
        }
      });
    };
  }

  return {
    markdown: contents.toString(),
    answers: (contents as any).answers || [],
  };
};

export const encodeAnswerContents = (
  answerIndex: number,
  answerLen: number
) => {
  const answer = `answer_${answerIndex}_${answerLen}`;
  return answer;
};

export type AnswerContents = {
  answerIndex: number;
  answerLen: number;
};

export const decodeAnswerContents = (
  contents: string
): AnswerContents | null => {
  const regex = /answer_(\d+)_(\d+)/g;

  const match = regex.exec(contents);
  if (match) {
    const answerIndex = parseInt(match[1], 10);
    const answerLen = parseInt(match[2], 10);
    return { answerIndex, answerLen };
  }
  return null;
};
