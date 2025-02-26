import BackendBootstrapper from "@/components/BackendBootstrapper";
import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BackendBootstrapper>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </QueryClientProvider>
    </BackendBootstrapper>
  );
}
