import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { SFFullPageLoader } from "./components/sportflix/SFLoader";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => <SFFullPageLoader label="WatchBox7" />,
    defaultPendingMs: 150,
  });

  return router;
};
