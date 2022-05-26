import { mockTempPermission } from "@/mock";
import { useMenuStoreWidthOut } from "@/store/modules/menu";
import { ErrorPageRoute } from "./modules/constant";

const whiteList = ["/login"];

export const createRouterGuard = (router) => {
  const menuStore = useMenuStoreWidthOut();
  router.beforeEach(async (to, from, next) => {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        if (menuStore.getHasAddedRouter) {
          next();
          return;
        }
        //mock登陆用户的权限信息
        const userInfo = await mockTempPermission(token);
        if (!userInfo || userInfo.code === 401) {
          window["$message"].warning(userInfo.msg);
          next("/login");
          return;
        }
        //根据用户权限信息生成路由
        const routes = menuStore.generateRouters(userInfo);
        //动态添加到路由表
        routes.forEach((item) => {
          router.addRoute(item);
        });
        //404路由放在最后添加
        router.addRoute(ErrorPageRoute);
        //设置路由已被添加完毕
        menuStore.setHasAddedRouter();
        //路由放行
        next({ ...to, replace: true });
      } else {
        window["$message"].warning("没有权限访问，请先登陆");
        next("/login");
      }
    }
  });
  router.afterEach((to) => {});
};
