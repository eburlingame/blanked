import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />

      <body style={{ fontFamily: "PT Sans, sans-serif" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
