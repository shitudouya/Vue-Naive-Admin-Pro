import { defineStore } from "pinia";
import { useMenuStore } from "./menu";
import { useTabStore } from "./tab";
import { useUserStore } from "./user";

export const useAppStore = defineStore("app", {
  state: () => ({
    //默认主题
    appTheme: "#41B584",
    //内置主题列表
    appThemeList: [
      "#41B584",
      "#1890FF",
      "#6954F0",
      "#10A7A7",
      "#FF9800",
      "#FF8474",
      "#1BBB54",
      "#DA705A",
      "#B5526C",
      "#00C1D4",
      "#FB9300",
      "#EE4F12",
      "#0096C7",
      "#9C27B0",
      "#FF5C93",
    ],
    //菜单样式
    menuStyle: {
      //正常菜单宽度
      menuWidth: 240,
      //最小宽度
      minMenuWidth: 80,
    },
    //菜单是否折叠状态
    collapsed: false,
    //是否沉浸模式
    immersion: false,
  }),
  getters: {
    getAppTheme() {
      return this.appTheme;
    },
    getAppThemeList() {
      return this.appThemeList;
    },
    getMenuStyle() {
      return this.menuStyle;
    },
    getIsCollapsed() {
      return this.collapsed;
    },
    getIsImmersion() {
      return this.immersion;
    },
  },
  actions: {
    setAppTheme(theme) {
      this.appTheme = theme;
    },
    setIsCollapsed(collapsed) {
      this.collapsed = collapsed;
    },
    setIsImmersion(immersion) {
      this.immersion = immersion;
    },
    clearAllState(callback) {
      const menuStore = useMenuStore();
      const tabStore = useTabStore();
      const userStore = useUserStore();
      menuStore.clearState();
      tabStore.clearState();
      userStore.clearState();
      callback && callback();
    },
  },
});
