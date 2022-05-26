import { createRouter, createWebHashHistory } from "vue-router";
import { createRouterGuard } from "./guard";
import { baseRoute, RedirectRoute } from "./modules/constant";

export const constantRouter = [...baseRoute, RedirectRoute];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export const setupRouter = (app) => {
  app.use(router);
  createRouterGuard(router);
};

export default router;
