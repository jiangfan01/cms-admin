import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/layout/IndexView";

const routes = [
  {
    path: "/login",
    component: () => import("../views/login/LoginView"),
    meta: { title: "登录" },
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/Page404View"),
    meta: { title: "404" },
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/Page401View"),
    meta: { title: "401" },
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("../views/home/IndexView"),
        meta: { title: "首页" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
