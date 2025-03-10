import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const queryClient = new QueryClient();

const BackendBootstrapper = dynamic(
  () => import("@/components/BackendBootstrapper"),
  {
    ssr: false,
  }
);

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
