import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { NotFound } from "@/components/NotFound";
import { About } from "@/pages/About";
import { Diacritics } from "@/pages/Diacritics";
import { Home } from "@/pages/Home";
import { LessonPage } from "@/pages/LessonPage";
import { LevelPage } from "@/pages/LevelPage";

const rootRoute = createRootRoute({ component: Layout, notFoundComponent: () => <NotFound /> });

const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home }),
  createRoute({ getParentRoute: () => rootRoute, path: "/level/$levelId", component: LevelPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/lesson/$levelId/$lessonId", component: LessonPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/about", component: About }),
  ...(import.meta.env.DEV
    ? [createRoute({ getParentRoute: () => rootRoute, path: "/dev/diacritics", component: Diacritics })]
    : []),
];

export const routeTree = rootRoute.addChildren(routes);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
