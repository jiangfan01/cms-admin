import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { getToken } from "@/utils/auth";
import { useAuthStore } from "@/stores/auth";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // do something 在发送请求前
    const authStore = useAuthStore();
    // 如果有useAuthStore里面定义的token值
    if (authStore.token) {
      // 让每个请求携带token
      // ["X-Token"]为自定义key
      // 请根据实际情况自行修改
      config.headers["token"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something 当请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  /**
   * 如果你想获取 http 信息，例如 headers 或 status
   * 请 return  response => response
   */

  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  (response) => {
    const res = response.data;

    // 如果返回的自定义code不是20000, 认定为error。
    if (res.code !== 20000) {
      ElMessage({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (
        res.code === 50001 ||
        res.code === 50008 ||
        res.code === 50012 ||
        res.code === 50014
      ) {
        // 重新登录
        ElMessageBox.confirm(
          "你已被登出，可以取消继续留在该页面，或者重新登录",
          "确定登出",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(async () => {
          //遇到非法token就调用pinia里面的resetToken方法清除token并回到登录页
          const authStore = useAuthStore();
          await authStore.resetToken();
          // location.reload();
          location.href = "/login";
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
