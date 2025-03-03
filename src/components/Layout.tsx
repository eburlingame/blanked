import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode } from "react";

export type LayoutProps = {
  title: string;
  children: ReactNode;
};

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Fill in the blank study app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box width="100%" maxWidth="680px" mx="auto" px={4} py={8}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
