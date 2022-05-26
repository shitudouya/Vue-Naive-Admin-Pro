import { createApp } from "vue";
import App from "./App.vue";
import AppProvider from "@/components/AppProvider/AppProvider.vue";
import { setupStore } from "./store/index";
import { setupRouter } from "./router";
import router from "./router/index";

//引入css
import "@/styles/index.less";
import "default-passive-events";

async function bootstrap() {
  const appProvider = createApp(AppProvider);
  //创建app实例
  const app = createApp(App);
  // 挂载状态管理
  setupStore(app);
  //优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
  appProvider.mount("#appProvider", true);
  //挂载路由
  setupRouter(app);
  //等待路由准备就绪
  await router.isReady();
  //解决tailwind覆盖naive样式
  const meta = document.createElement("meta");
  meta.name = "naive-ui-style";
  document.head.appendChild(meta);
  //挂载app实例
  app.mount("#app", true);
}

bootstrap();
