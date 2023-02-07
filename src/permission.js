// 路由守卫
import router from "@/router";
import { getToken } from "@/utils/auth";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
import { ElMessage } from "element-plus";

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  //有token就代表了登录了
  if (hasToken) {
    //用户手打路径去登录页的情况
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      //有token且进入首页后获取用户信息，路由，菜单等
      const hasRouters =
        permissionStore.routers && permissionStore.routers.length > 0;

      // 如果已经有路由信息了，表示已经获取过了，不要重复读取接口了，直接进入页面。
      if (hasRouters) {
        next();
      } else {
        try {
          //初次打开页面，或者刷新后，读取信息，并存入pinia
          const { routers } = await authStore.getInfo();

          // 生成路由
          const accessedRouters = permissionStore.generateRoutes(routers);

          // 动态增加路由
          router.addRoute(accessedRouters);

          // 路由增加 401 页面
          router.addRoute({ path: "/:pathMatch(.*)", redirect: "/401" });

          if (to.matched.length === 0) {
            // 刷新页面第一次进入页面时，addRoute刚添加路由进去，但没有成功加载需要重进一次
            next({
              ...to,
              replace: true, // 重进一次, 不保留重复历史
            });
          } else {
            // 重进一次后成功加载对应路由，直接next()，防止路由无限循环
            next();
          }
        } catch (err) {
          authStore.resetToken();
          ElMessage.error(err || "错误了，请重新登录");
          next("/login");
        }
      }
    }
  } else {
    //  没有token的情况下表示没有登录
    if (to.path === "/login") {
      //并且当前已经是登录页，就显示
      next();
    } else {
      // 如果没有token，表示没有登录。
      // 并且访问的是的除登录页以外的其他页面，跳转到登录页
      next("/login");
    }
  }
});
