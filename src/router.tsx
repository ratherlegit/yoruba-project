import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Diacritics } from "@/pages/Diacritics";

const rootRoute = createRootRoute({ component: () => <Outlet /> });
const diacriticsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Diacritics });
const routeTree = rootRoute.addChildren([diacriticsRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
