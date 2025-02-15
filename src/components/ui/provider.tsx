"use client";

import {
  ChakraProvider,
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

import "@fontsource/pt-sans";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'PT Sans', sans-serif` },
        body: { value: `'PT Sans', sans-serif` },
      },
    },
  },
});

const system = createSystem(defaultBaseConfig, customConfig);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
