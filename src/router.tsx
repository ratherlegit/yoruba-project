import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { NotFound } from "@/components/NotFound";
import { About } from "@/pages/About";
import { Proverbs } from "@/pages/Proverbs";
import { Transform } from "@/pages/Transform";
import { Breakdown } from "@/pages/Breakdown";
import { Diacritics } from "@/pages/Diacritics";
import { Home } from "@/pages/Home";
import { LessonPage } from "@/pages/LessonPage";
import { LevelPage } from "@/pages/LevelPage";
import { SoundBank } from "@/pages/SoundBank";
import { VocabHome } from "@/pages/VocabHome";
import { VocabLevelPage } from "@/pages/VocabLevelPage";
import { VocabTopicPage } from "@/pages/VocabTopicPage";

const rootRoute = createRootRoute({ component: Layout, notFoundComponent: () => <NotFound /> });

const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home }),
  createRoute({ getParentRoute: () => rootRoute, path: "/level/$levelId", component: LevelPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/lesson/$levelId/$lessonId", component: LessonPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/vocab", component: VocabHome }),
  createRoute({ getParentRoute: () => rootRoute, path: "/vocab/$levelId", component: VocabLevelPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/vocab/$levelId/$topicId", component: VocabTopicPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/sounds", component: SoundBank }),
  createRoute({ getParentRoute: () => rootRoute, path: "/proverbs", component: Proverbs }),
  createRoute({ getParentRoute: () => rootRoute, path: "/transform", component: Transform }),
  createRoute({ getParentRoute: () => rootRoute, path: "/about", component: About }),
  ...(import.meta.env.DEV
    ? [
        createRoute({ getParentRoute: () => rootRoute, path: "/dev/diacritics", component: Diacritics }),
        createRoute({ getParentRoute: () => rootRoute, path: "/dev/breakdown", component: Breakdown }),
      ]
    : []),
];

export const routeTree = rootRoute.addChildren(routes);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
