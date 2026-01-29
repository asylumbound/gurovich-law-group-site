import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import "@/index.css";
import TerminalApp from "./TerminalApp";

const queryClient = new QueryClient();

// Get the API URL - use main site URL if on subdomain
const getApiUrl = () => {
  // In production, Terminal will be on terminal.gurovich.law
  // API is on www.gurovich.law/api/trpc
  const hostname = window.location.hostname;
  
  // If we're on a terminal subdomain, point to main site API
  if (hostname.startsWith("terminal.")) {
    const mainDomain = hostname.replace("terminal.", "www.");
    return `https://${mainDomain}/api/trpc`;
  }
  
  // For local dev or same-domain deployment, use relative path
  return "/api/trpc";
};

const getLoginUrl = () => {
  const appId = import.meta.env.VITE_APP_ID;
  const portalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const currentUrl = window.location.href;
  return `${portalUrl}?app_id=${appId}&redirect_uri=${encodeURIComponent(currentUrl)}`;
};

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[Terminal API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[Terminal API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getApiUrl(),
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <TerminalApp />
    </QueryClientProvider>
  </trpc.Provider>
);
