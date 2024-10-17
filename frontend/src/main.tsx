import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GoogleOAuthProviderWrapper from "@/components/GoogleOAuthProviderWrapper";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils/apolloClient";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

loadDevMessages();
loadErrorMessages();

import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProviderWrapper>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ApolloProvider>
    </GoogleOAuthProviderWrapper>
  </StrictMode>
);
