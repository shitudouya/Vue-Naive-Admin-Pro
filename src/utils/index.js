import { NIcon } from "naive-ui";
import { h } from "vue";
/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color, amount) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color, amount) {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(color.substring(2, 4), amount)}${addLight(
    color.substring(4, 6),
    amount
  )}`;
}

//渲染图标
export function renderIcon(icon, size = 14, color = "#333") {
  return () => h(NIcon, { size, color }, { default: () => h(icon) });
}

//随机生成min-max之间的数字
export const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

//判断根路由
export function isRootRouter(item) {
  return item.meta.alwaysShow != true && item.children && item.children.length === 1;
}

//排除Router
export const filterRouter = (routerMap) => {
  return routerMap.filter((item) => {
    return item.meta.hidden !== true && !["/:path(.*)*", "/", "redirect", "/login"].includes(item.path);
  });
};

//递归组装菜单格式
export const generatorMenu = (routerMap) => {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta.title,
      key: info.name,
      icon: isRoot ? item.meta.icon : info.meta.icon,
    };
    if (info.children && info.children.length > 0) {
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
};

//顶部标签栏svg背景
export const tabSVGImage = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <symbol id="tab-geometry-left" viewBox="0 0 214 36">
      <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"></path>
    </symbol>
    <symbol id="tab-geometry-right" viewBox="0 0 214 36">
      <use xlink:href="#tab-geometry-left"></use>
    </symbol>
    <clipPath id="crop">
      <rect class="mask" width="100%" height="100%" x="0"></rect>
    </clipPath>
  </defs>
  <svg width="52%" height="100%">
    <use xlink:href="#tab-geometry-left" width="214" height="36" class="tab-geometry"></use>
  </svg>
  <g transform="scale(-1, 1)">
    <svg width="52%" height="100%" x="-100%" y="0">
      <use xlink:href="#tab-geometry-right" width="214" height="36" class="tab-geometry"></use>
    </svg>
  </g>
</svg>
`;
