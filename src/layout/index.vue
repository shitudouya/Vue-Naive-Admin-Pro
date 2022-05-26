<template>
  <n-layout class="layout" position="absolute" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      show-trigger="arrow-circle"
      @collapse="handleCollapsed(true)"
      @expand="handleCollapsed(false)"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="minMenuWidth"
      :width="immersion ? '0' : menuWidth"
      :native-scrollbar="false"
      inverted
    >
      <!-- Logo -->
      <Logo :collapsed="collapsed" />
      <!-- 侧边菜单栏 -->
      <AsideMenu :collapsed="collapsed" />
    </n-layout-sider>

    <n-layout>
      <!-- 顶部 -->
      <n-layout-header position="absolute">
        <!-- 顶部导航栏 -->
        <HeaderNav :collapsed="collapsed" v-show="!immersion" @handleCollapsed="handleCollapsed" />
        <!-- 顶部标签栏 -->
        <HeaderTab />
      </n-layout-header>

      <!-- 内容主体 -->
      <n-layout-content
        position="absolute"
        :native-scrollbar="false"
        :class="['layout-content', immersion ? 'is-immersion' : '']"
      >
        <div class="layout-content-main">
          <router-view v-slot="{ Component, route }">
            <transition name="zoom-fade" mode="out-in" appear>
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </div>
        <div
          class="immersion-box shadow-sm hover:opacity-80"
          :class="immersion ? 'enter-immersion' : ''"
          @click="handleExitImmersion"
        >
          <n-icon color="#899" :size="22">
            <ResizeSmall24Regular />
          </n-icon>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import Logo from "@/components/Logo/Logo";
import AsideMenu from "@/components/AsideMenu/AsideMenu";
import { useAppStore } from "@/store/modules/app";
import HeaderNav from "@/components/HeaderNav/HeaderNav";
import HeaderTab from "@/components/HeaderTab/HeaderTab";
import { computed } from "vue";
import { ResizeSmall24Regular } from "@vicons/fluent";

const appStore = useAppStore();
const { menuWidth, minMenuWidth } = appStore.getMenuStyle;
const collapsed = computed(() => appStore.getIsCollapsed);
const immersion = computed(() => appStore.getIsImmersion);

const handleCollapsed = (value) => {
  appStore.setIsCollapsed(value);
};
//退出沉浸模式
const handleExitImmersion = () => {
  appStore.setIsImmersion(false);
};
</script>

<style lang="less" scoped>
.layout {
  .n-layout-sider {
    transition: all 0.3s var(--n-bezier);
    box-shadow: 2px 0 4px rgb(0 21 41 / 60%);
  }
  .n-layout {
    background-color: @bgColor;
    .layout-content {
      top: @headerNavHeight+ @headerTabHeight;
      .layout-content-main {
        padding: 15px;
      }
    }
    .is-immersion {
      top: @headerTabHeight;
    }
  }
  .immersion-box {
    position: fixed;
    right: 20px;
    top: 0px;
    background-color: #ebeaea;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease-in-out;
    border-radius: 50%;
    opacity: 0;
  }
  .enter-immersion {
    visibility: visible;
    top: @headerTabHeight + 20px;
    opacity: 1;
  }
}
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: transform 0.35s, opacity 0.28s ease-in-out;
}
.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
