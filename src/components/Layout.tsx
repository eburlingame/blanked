import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box width="100%" maxWidth="680px" mx="auto" px={4} py={8}>
      {children}
    </Box>
  );
};

export default Layout;
