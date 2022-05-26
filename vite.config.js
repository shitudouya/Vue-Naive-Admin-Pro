import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import visualizer from "rollup-plugin-visualizer";

export default ({ command, mode }) => {
  const isProduction = mode === "production";
  const { VITE_APP_TITLE } = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      vue(),
      Components({
        dts: "src/components.d.ts",
        resolvers: [NaiveUiResolver()],
      }),
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: VITE_APP_TITLE,
          },
        },
      }),

      visualizer(),
    ],
    server: {
      host: true,
      open: true,
      port: 8800,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
      extensions: [".vue", ".js"],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/variable.less";`,
        },
      },
    },
    optimizeDeps: {
      include: [
        "lodash",
        "lodash-es",
        "@vicons/fluent",
        "@vicons/antd",
        "naive-ui/es/locales/date/ZhCN",
        "naive-ui/es/locales/common/ZhCN",
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              const arr = id.toString().split("node_modules/")[1].split("/");
              switch (arr[0]) {
                case "@vue":
                case "axios":
                case "@vicons":
                case "naive-ui":
                case "vue-router":
                case "vuedraggable":
                case "echarts":
                case "zrender":
                case "sortablejs":
                  return arr[0];
                default:
                  return "vendor";
              }
            }
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  });
};
