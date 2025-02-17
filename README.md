# Blanked

![Screenshot](/img/question.png)

A web-based fill-in-the-blank style quiz application. Allows you to write fill-in-the-blank style questions using markdown, then be quizzed on them easily in a browser.

I built this when studying for FAA knowledge exams, since those tests have lots of specific numbers and phrases they want you to remember.

## Usage

1. Create a markdown quiz file, hosted somewhere. I host mine using GitHub Gists ([here's a sample quiz](https://gist.githubusercontent.com/eburlingame/a2db13e3e41834756cee8c77bcb885d3/raw/7db060f891994dfda021351794d5e1b86737fdfe/TestQuiz.md))
2. Go to [the blanked app](https://eburlingame.github.io/blanked) and import your quiz using the Gist URL
3. Take your quiz

### Quiz Format

The quiz format is a markdown file with a small amount of front matter. Questions are separated by a horizontal rule `---`:

```md
name: Test Quiz
description: My cool cat quiz

---

## What's up _doc_?

## Anything within an _emphasis_ tag will be a _blank_ when the user takes the quiz.

You can group responses in brackets, meaning the user has to fill in all elements of the group, but it can be in any order:

## The primary colors are [*red*, *blue*, and *yellow*].

Markdown formatting works:

1. _This_ is a list
2. _With_ some _answers_

---

Here's an unorderedlist:

- _A_
- _B_
- _C_
```

## Development

The app is build with Next.js, Chakra UI, and `react-markdown`.

```bash
yarn dev
```
