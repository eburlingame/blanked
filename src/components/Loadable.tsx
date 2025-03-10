import { Box, Flex, Spinner } from "@chakra-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";

export type LoadableProps<T> = {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
};

const Loadable = <T,>({ query, children }: LoadableProps<T>) => {
  return (
    <>
      {query.isLoading || query.data === undefined ? (
        <Flex>
          <Spinner />
        </Flex>
      ) : query.error ? (
        <Box>Error loading: {query.error.message}</Box>
      ) : (
        children(query.data)
      )}
    </>
  );
};

export default Loadable;
