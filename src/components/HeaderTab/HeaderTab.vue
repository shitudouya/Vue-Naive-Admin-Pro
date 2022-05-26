<template>
  <div class="header-tab-container flex items-end">
    <Draggable :list="tabList" animation="300" item-key="name" class="flex tab-wrapper">
      <template #item="{ element }">
        <div
          @click.stop="switchPage(element)"
          @contextmenu.prevent="handleContextMenu($event, element)"
          @mousewheel.passive="handleMouseWheel"
          :class="['tab-card-item', { 'active-item': state.activeKey === element.fullPath }]"
        >
          <div class="tab-background" v-html="tabSVGImage"></div>
          <div class="tab-content">
            <div class="tab-title">{{ element.meta.title }}</div>
            <n-icon class="tab-icon" @click.stop="removeTab(element)" size="12" color="#555">
              <CloseOutlined />
            </n-icon>
          </div>
        </div>
      </template>
    </Draggable>

    <n-dropdown
      :show="state.showDropdown"
      :x="state.dropdownX"
      :y="state.dropdownY"
      @clickoutside="onClickOutside"
      placement="bottom-start"
      @select="handleDropdownSelect"
      :options="TabMenuOptions"
    />
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/modules/app";
import { useTabStore } from "@/store/modules/tab";
import { renderIcon, tabSVGImage } from "@/utils";
import { CloseOutlined, ColumnWidthOutlined } from "@vicons/antd";
import {
  DismissCircle20Regular,
  ArrowExportRtl20Regular,
  ArrowExportLtr20Regular,
  ResizeLarge20Regular,
  ArrowClockwise20Regular,
} from "@vicons/fluent";
import { useMessage } from "naive-ui";
import { computed, watch, reactive, unref, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Draggable from "vuedraggable";

const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const message = useMessage();
const appStore = useAppStore();

const state = reactive({
  activeKey: route.fullPath,
  dropdownX: 0,
  dropdownY: 0,
  showDropdown: false,
});
const currentSelect = ref("");
const tabList = computed(() => tabStore.tabList);
const whiteList = ["Login", "Redirect", "ErrorPage"];

const TabMenuOptions = computed(() => {
  const isDisabled = unref(tabList).length <= 1;
  const isImmersion = appStore.getIsImmersion;
  return [
    {
      key: 1,
      label: "关闭页面",
      icon: renderIcon(DismissCircle20Regular, 18),
      disabled: isDisabled,
    },
    { key: 2, label: "关闭左侧", icon: renderIcon(ArrowExportRtl20Regular, 18) },
    { key: 3, label: "关闭右侧", icon: renderIcon(ArrowExportLtr20Regular, 18) },
    { key: 4, label: "关闭其它", icon: renderIcon(ColumnWidthOutlined, 19), disabled: isDisabled },
    { key: "divider", type: "divider" },
    { key: 5, label: "刷新页面", icon: renderIcon(ArrowClockwise20Regular, 18) },
    {
      key: 6,
      label: "沉浸模式",
      icon: renderIcon(ResizeLarge20Regular, 20),
      disabled: isImmersion,
    },
  ];
});

const getSimpleRoute = (route) => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};

//切换页面
const switchPage = (element) => {
  const { path, query, fullPath } = element;
  if (fullPath === route.fullPath) return;
  state.activeKey = fullPath;
  router.push({
    path,
    query,
  });
};

//监听鼠标滚动事件，用于Tab栏溢出时可以滚动查看
const handleMouseWheel = (e) => {
  const tabWrapper = document.querySelector(".tab-wrapper");
  const tabWidth = tabWrapper.offsetWidth;
  const scrollWidth = tabWrapper.scrollWidth;
  if (tabWidth < scrollWidth) {
    if (e.deltaY > 0) {
      tabWrapper.scrollLeft += 100;
    } else {
      tabWrapper.scrollLeft -= 100;
    }
  }
};

//Tab栏鼠标右键事件
const handleContextMenu = (e, element) => {
  state.showDropdown = false;
  currentSelect.value = element;
  nextTick().then(() => {
    state.showDropdown = true;
    state.dropdownX = e.clientX;
    state.dropdownY = e.clientY;
  });
};

// 关闭页面
const removeTab = (selectTab) => {
  if (unref(tabList).length === 1) {
    return message.warning("这已经是最后一页，不能再关闭了！");
  }
  tabStore.closeCurrentTab(selectTab);
  //如果关闭的是当前页面
  if (state.activeKey === selectTab.fullPath) {
    const currentRoute = unref(tabList)[Math.max(0, unref(tabList).length - 1)];
    state.activeKey = currentRoute.fullPath;
    router.push(currentRoute);
  }
};

// 关闭左侧
const closeLeft = (selectTab) => {
  tabStore.closeLeftTabs(selectTab);
  state.activeKey = selectTab.fullPath;
  router.push(selectTab.fullPath);
};

// 关闭右侧
const closeRight = (selectTab) => {
  tabStore.closeRightTabs(selectTab);
  state.activeKey = selectTab.fullPath;
  router.replace(selectTab.fullPath);
};

// 关闭其他
const closeOther = (selectTab) => {
  tabStore.closeOtherTabs(selectTab);
  state.activeKey = selectTab.fullPath;
  router.replace(selectTab.fullPath);
};

// 刷新页面
const handleRefreshPage = (selectTab) => {
  const { path, query } = selectTab;
  router.push({
    path: "/redirect" + path,
    query,
  });
};

//沉浸模式
const handleEnterImmersion = (selectTab) => {
  if (route.fullPath !== selectTab.fullPath) {
    router.push(route.fullPath);
  }
  appStore.setIsImmersion(true);
};

const onClickOutside = () => {
  state.showDropdown = false;
};

const handleDropdownSelect = (key) => {
  if (key === 1) {
    //关闭当前
    removeTab(currentSelect.value);
  } else if (key === 2) {
    //关闭左侧
    closeLeft(currentSelect.value);
  } else if (key === 3) {
    //关闭右侧
    closeRight(currentSelect.value);
  } else if (key === 4) {
    //关闭其它
    closeOther(currentSelect.value);
  } else if (key === 5) {
    //刷新页面
    handleRefreshPage(currentSelect.value);
  } else if (key === 6) {
    //沉浸模式
    handleEnterImmersion(currentSelect.value);
  }
  state.showDropdown = false;
};
watch(
  () => route.fullPath,
  (to) => {
    if (whiteList.includes(route.name)) return;
    state.activeKey = to;
    tabStore.addTabList(getSimpleRoute(route));
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.header-tab-container {
  height: @headerTabHeight;
  padding: 0 5px;
  background-color: var(--tab-bg-color);
  .tab-wrapper {
    width: 100%;
    overflow: hidden;
  }
  :deep(.tab-card-item) {
    position: relative;
    display: inline-block;
    height: 40px;
    min-width: 150px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    margin-right: -20px;
    &:not(.active-item):hover {
      .tab-background {
        opacity: 1;
        svg {
          .tab-geometry {
            fill: #e5e5e5;
          }
        }
      }
    }
    .tab-background {
      opacity: 0;
      position: absolute;
      top: 6px;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    &.active-item {
      z-index: 1;
      .tab-background {
        opacity: 1;
        svg {
          .tab-geometry {
            fill: #fff;
          }
        }
      }
    }
    .tab-content {
      position: absolute;
      z-index: 5;
      left: 0;
      right: 0;
      height: 100%;
      display: flex;
      .tab-title {
        position: absolute;
        height: 100%;
        top: 2px;
        left: 20px;
        right: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #555;
      }
      .tab-icon {
        position: absolute;
        right: 20px;
        top: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        &:hover {
          background-color: #f0f2f5;
        }
      }
    }
  }
}
</style>
