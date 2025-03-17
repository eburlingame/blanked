# Blanked

![Screenshot](/img/question.png)

A web-based fill-in-the-blank style quiz application. Allows you to write fill-in-the-blank style questions using markdown, then be quizzed on them easily in a browser.

I built this when studying for FAA knowledge exams, since those tests have lots of specific numbers and phrases they want you to remember.

## Question Review 

Blanked has a question review feature which prompts you to answer certain questions on a daily cadence. The selection of the questions is done using the [SuperMemo SM-2 algorithm](https://super-memory.com/english/ol/sm2.htm), similar to the Anki flashcard program.

## Storage

All data is store locally in the browser using IndexDB. The entire database can easily be downloaded and uploaded as needed.

## Quiz Format

The quiz format is a markdown file with a small amount of front matter. Questions are separated by a horizontal rule `---`:

```md
What's up *doc*?
---
How's it *going|hanging*?
---
Group [*A*, *B*, or, *C*] can be in any order, and *Q*?
---
You can use usual markdown features, like lists:
1. *This* is a list
2. *With* some *answers*
```

## Development

The app is build with Next.js, Chakra UI, and `react-markdown`.

```bash
yarn dev
```
