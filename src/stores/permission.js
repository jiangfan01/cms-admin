import { defineStore } from "pinia";
import Layout from "@/views/layout/IndexView";
import { ref } from "vue";

export const usePermissionStore = defineStore("permission", () => {
  const routers = ref({});

  const generateRoutes = (data) => {
    let accessedRouters = {
      path: "/",
      component: Layout,
      children: [],
    };

    data.forEach((item) => {
      accessedRouters.children.push({
        path: item.path,
        component: () => import(`@/views/${item.component}`),
        meta: { title: item.title },
      });
    });

    routers.value = accessedRouters;
    return accessedRouters;
  };
  return { generateRoutes, routers };
});
