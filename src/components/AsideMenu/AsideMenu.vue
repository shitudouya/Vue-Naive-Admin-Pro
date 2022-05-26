<template>
  <n-menu
    :options="menuList"
    inverted
    :collapsed="collapsed"
    :collapsed-width="minMenuWidth"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="state.openKeys"
    :value="selectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  ></n-menu>
</template>

<script setup>
import { useAppStore } from "@/store/modules/app";
import { onMounted, ref, unref, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { generatorMenu } from "@/utils";
import { useMenuStore } from "@/store/modules/menu";

defineProps({
  collapsed: {
    type: Boolean,
    required: true,
  },
});
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const menuStore = useMenuStore();
const menuList = ref([]);
const selectedKeys = ref(route.name);

const matched = route.matched;
const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : [];
const state = reactive({
  openKeys: getOpenKeys,
});
const { minMenuWidth } = appStore.getMenuStyle;

// 点击菜单
const clickMenuItem = (key) => {
  router.push({ name: key });
};

//查找是否存在子路由
const findChildrenLen = (key) => {
  if (!key) return false;
  const subRouteChildren = [];
  for (const { children, key } of unref(menuList)) {
    if (children && children.length) {
      subRouteChildren.push(key);
    }
  }
  return subRouteChildren.includes(key);
};

//展开菜单
function menuExpanded(openKeys) {
  if (!openKeys) return;
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
  const isExistChildren = findChildrenLen(latestOpenKey);
  state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys;
}
//更新菜单
function updateMenu() {
  menuList.value = generatorMenu(menuStore.getMenus);
}

watch(
  () => route.fullPath,
  () => {
    updateMenu();
    const matched = route.matched;
    state.openKeys = matched.map((item) => item.name);
    const activeMenu = route.meta.activeMenu || "";
    selectedKeys.value = activeMenu ? activeMenu : route.name;
  }
);

onMounted(() => {
  updateMenu();
});
</script>

<style lang="less" scoped></style>
