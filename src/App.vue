<template>
  <n-config-provider :locale="zhCN" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
    <AppProvider>
      <router-view />
    </AppProvider>
  </n-config-provider>
</template>

<script setup>
import { useAppStore } from "@/store/modules/app";
import { zhCN, dateZhCN } from "naive-ui";
import AppProvider from "@/components/AppProvider/AppProvider";
import { computed, watch } from "vue";
import { lighten } from "@/utils/index";
import { useWindowSize } from "@vueuse/core";
import throttle from "lodash/throttle";

const { width } = useWindowSize();
const appStore = useAppStore();

//naive主题覆盖
const getThemeOverrides = computed(() => {
  const localThemeColor = localStorage.getItem("themeColor");
  if (localThemeColor && localThemeColor.startsWith("#")) {
    appStore.setAppTheme(localThemeColor);
  }
  const appTheme = appStore.appTheme;
  const lightenStr = lighten(appTheme, 6);
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
    },
  };
});

//监听窗口变化伸缩菜单栏
watch(
  width,
  throttle((newWidth) => {
    if (newWidth <= 780) {
      appStore.setIsCollapsed(true);
    } else {
      appStore.setIsCollapsed(false);
    }
  }, 300),
  { immediate: true }
);
</script>

<style lang="less" scoped></style>
