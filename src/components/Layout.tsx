import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode } from "react";
import HomeButton from "./HomeButton";

export type LayoutProps = {
  title: string;
  children: ReactNode;
  maxWidth?: string;
  homeButton?: boolean;
};

const Layout = ({
  title,
  children,
  maxWidth = "680px",
  homeButton = true,
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box width="100%" maxWidth={maxWidth} mx="auto" px={4} py={8}>
        {homeButton && <HomeButton />}

        {children}
      </Box>
    </>
  );
};

export default Layout;
