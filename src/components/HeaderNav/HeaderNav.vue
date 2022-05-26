<template>
  <div class="header-nav-container border-[1px] bg-white border-[#e6e6e6]">
    <div class="nav-left flex items-center">
      <!-- 折叠操作 -->
      <div class="icon-trigger px-[10px]" @click="setCollapsed">
        <n-icon size="18" color="#444">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </n-icon>
      </div>
      <!-- 刷新操作 -->
      <div class="icon-trigger px-[10px]" @click="reloadPage">
        <n-icon size="18" color="#444">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb class="ml-[14px]">
        <template v-for="breadcrumbItem in breadcrumbList" :key="breadcrumbItem.name">
          <n-breadcrumb-item>
            <span class="link-text">
              <component v-if="breadcrumbItem.meta.icon" :is="breadcrumbItem.meta.icon" />
              {{ breadcrumbItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="flex items-center">
      <!-- 主题切换 -->
      <n-popover trigger="hover" :to="false">
        <template #trigger>
          <div class="icon-trigger px-[10px]">
            <n-icon size="20" color="#444">
              <Color20Regular />
            </n-icon>
          </div>
        </template>
        <div class="theme-box mb-[10px]">
          <n-divider title-placement="center"> 内置主题 </n-divider>
          <div class="grid grid-cols-5 gap-[6px]">
            <span
              class="theme-item"
              v-for="(item, index) in appThemeList"
              :key="index"
              :style="{ 'background-color': item }"
              @click="toggleTheme(item)"
            >
              <n-icon size="16" color="#fff" v-if="item === appStore.appTheme">
                <Checkmark16Regular />
              </n-icon>
            </span>
          </div>
        </div>
      </n-popover>
      <!-- 全屏切换 -->
      <div class="icon-trigger px-[10px]" @click="toggle">
        <n-icon size="20" color="#444">
          <FullScreenMinimize24Regular v-if="isFullscreen" />
          <FullScreenMaximize24Regular v-else />
        </n-icon>
      </div>
      <!-- 个人信息 -->
      <n-dropdown trigger="hover" show-arrow @select="handleSelect" :options="dropdownOptions">
        <div class="icon-trigger px-[10px] space-x-[6px]">
          <n-avatar :size="35" :src="avatarPNG" round> </n-avatar>
          <span>R-Admin</span>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup>
import { MenuUnfoldOutlined, MenuFoldOutlined, ReloadOutlined } from "@vicons/antd";
import { computed } from "vue";
import avatarPNG from "@/assets/images/avatar.png";
import { useFullscreen } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import {
  FullScreenMaximize24Regular,
  FullScreenMinimize24Regular,
  Color20Regular,
  Checkmark16Regular,
} from "@vicons/fluent";
import { useAppStore } from "@/store/modules/app";
import { useMessage } from "naive-ui";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const message = useMessage();

const appThemeList = appStore.getAppThemeList;
const { isFullscreen, toggle } = useFullscreen();
const emit = defineEmits(["handleCollapsed"]);
const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true,
  },
});
const dropdownOptions = [
  {
    label: "个人设置",
    key: 1,
  },
  {
    label: "退出登录",
    key: 2,
  },
];
const generatorBreadcrumb = (routerMap) => {
  return routerMap.map((item) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === "/",
    };
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      currentMenu.children = generatorBreadcrumb(item.children, currentMenu);
    }
    return currentMenu;
  });
};

const breadcrumbList = computed(() => {
  if (route.meta.hideBreadcrumb) {
    return [];
  }
  return generatorBreadcrumb(route.matched);
});

const setCollapsed = () => {
  emit("handleCollapsed", !props.collapsed);
};
// 刷新页面
const reloadPage = () => {
  const { path, query } = route;
  router.push({
    path: "/redirect" + path,
    query,
  });
};
//切换主题
const toggleTheme = (item) => {
  localStorage.setItem("themeColor", item);
  appStore.setAppTheme(item);
};
// 下拉选择
const handleSelect = (key) => {
  if (key === 1) {
  } else if (key === 2) {
    appStore.clearAllState(() => {
      localStorage.removeItem("token");
      router.replace("/login");
      message.success("退出登录成功");
    });
  }
};
</script>

<style lang="less" scoped>
.header-nav-container {
  height: @headerNavHeight;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .icon-trigger {
    height: @headerNavHeight - 2;
    @apply flex items-center cursor-pointer hover:bg-[#f3f3f3];
  }
  .link-text {
    i {
      color: #6d7379 !important;
    }
  }
  .theme-box {
    .n-divider {
      margin: 6px 0 10px 0;
      font-size: 14px;
      color: #444f5a;
    }
    .theme-item {
      width: 22px;
      height: 22px;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
