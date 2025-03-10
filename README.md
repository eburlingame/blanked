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
