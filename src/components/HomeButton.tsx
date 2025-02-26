import { Box } from "@chakra-ui/react";
import Link from "next/link";

const HomeButton = () => {
  return (
    <Box my="2">
      <Link href="/">Home</Link>
    </Box>
  );
};

export default HomeButton;
