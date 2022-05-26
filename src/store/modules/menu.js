import { dynamicRouter } from "@/router/modules/dynamic";
import { defineStore } from "pinia";
import { store } from "../index";

const DEFAULT_CONFIG = {
  id: "id",
  children: "children",
  pid: "pid",
};
const getConfig = (config) => Object.assign({}, DEFAULT_CONFIG, config);

const filter = (tree, func, config = {}) => {
  config = getConfig(config);
  const children = config.children;
  function listFilter(list) {
    return list
      .map((node) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
};

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menus: [],
    hasAddedRouter: false,
  }),
  getters: {
    getMenus() {
      return this.menus;
    },
    getHasAddedRouter() {
      return this.hasAddedRouter;
    },
  },
  actions: {
    setMenus(menus) {
      this.menus = menus;
    },
    setHasAddedRouter() {
      this.hasAddedRouter = true;
    },
    generateRouters(payload) {
      const permissionsList = payload.data.permissions;
      const routeFilter = (route) => {
        const { meta } = route;
        const { permissions } = meta;
        if (!permissions) return true;
        return permissionsList.some((item) => permissions.includes(item));
      };
      let accessedRouters = filter(dynamicRouter, routeFilter);
      this.setMenus(accessedRouters);
      return accessedRouters;
    },
    clearState() {
      this.$reset();
    },
  },
});

export function useMenuStoreWidthOut() {
  return useMenuStore(store);
}
