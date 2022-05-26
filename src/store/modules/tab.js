import { defineStore } from "pinia";
import { toRaw } from "vue";

const whiteList = ["Redirect", "Login"];

export const useTabStore = defineStore("tab", {
  state: () => ({
    tabList: [],
  }),
  actions: {
    // 初始化标签页
    initTabs(routes) {
      this.tabList = routes;
    },
    // 添加标签页
    addTabList(route) {
      if (whiteList.includes(route.name)) return false;
      const findIndex = this.tabList.findIndex((item) => item.name === route.name);
      if (findIndex !== -1) {
        const tempList = toRaw(this.tabList);
        tempList[findIndex] = route;
        this.tabList = tempList;
      } else {
        this.tabList.push(route);
      }
      return true;
    },
    // 关闭左侧
    closeLeftTabs(route) {
      const index = this.tabList.findIndex((item) => item.name == route.name);
      this.tabList.splice(0, index);
    },
    // 关闭右侧
    closeRightTabs(route) {
      const index = this.tabList.findIndex((item) => item.name == route.name);
      this.tabList.splice(index + 1);
    },
    // 关闭其他
    closeOtherTabs(route) {
      this.tabList = this.tabList.filter((item) => item.name == route.name);
    },
    // 关闭当前页
    closeCurrentTab(route) {
      const index = this.tabList.findIndex((item) => item.name == route.name);
      this.tabList.splice(index, 1);
    },
    //清除状态
    clearState() {
      this.$reset();
    },
  },
});
