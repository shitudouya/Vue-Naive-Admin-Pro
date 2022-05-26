import Layout from "@/layout/index.vue";
import { renderIcon } from "@/utils";
import { LineChartOutlined, UserSwitchOutlined, InfoCircleOutlined } from "@vicons/antd";

export const dynamicRouter = [
  {
    path: "/dashboard",
    name: "DashboardMain",

    component: Layout,
    meta: {
      icon: renderIcon(LineChartOutlined, 18, "#fff"),
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        meta: {
          title: "主控台",
        },
        component: () => import("@/views/Dashboard/Dashboard.vue"),
      },
    ],
  },
  {
    path: "/permission",
    name: "Permission",
    redirect: "/permission/user",
    component: Layout,
    meta: {
      title: "权限测试",
      alwaysShow: true,
      icon: renderIcon(UserSwitchOutlined, 18, "#fff"),
    },
    children: [
      {
        path: "admin",
        name: "Permission-Admin",
        meta: {
          title: "管理员",
          permissions: ["Permission-Admin"],
        },
        component: () => import("@/views/Permission/Admin.vue"),
      },
      {
        path: "user",
        name: "Permission-User",
        meta: {
          title: "用户",
          permissions: ["Permission-User"],
        },
        component: () => import("@/views/Permission/User.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "AboutMain",
    component: Layout,
    meta: {
      icon: renderIcon(InfoCircleOutlined, 18, "#fff"),
    },
    children: [
      {
        path: "",
        name: "About",
        meta: {
          title: "关于",
        },
        component: () => import("@/views/About/About.vue"),
      },
    ],
  },
];
