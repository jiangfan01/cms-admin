import { defineStore } from "pinia";
import { login } from "@/api/auth";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { ref } from "vue";
import { getMe } from "@/api/users";

export const useAuthStore = defineStore("auth", () => {
  //初始数据
  const token = ref(getToken());
  const username = ref("");
  const role = ref({});
  const routers = ref({});
  const menus = ref([]);

  //登录接口
  const signIn = async (payload) => {
    const res = await login(payload);
    token.value = res.data.token;
    setToken(res.data.token);
  };

  //清除接口的值和cookie里面的token
  const resetToken = () => {
    token.value = "";
    username.value = "";
    role.value = {};
    routers.value = {};
    menus.value = [];
    removeToken();
  };

  const getInfo = async () => {
    const { data } = await getMe();
    username.value = data.user.username;
    role.value = data.role;
    menus.value = data.menus;
    console.log(data.user.username);
    return data;
  };

  //一定要返回出去
  return { token, username, menus, routers, signIn, resetToken, getInfo };
});

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     token: "",
//     username: "",
//     role: "",
//     routers: {},
//     menus: [],
//   }),
//   actions: {
//     async login(payload) {
//       const res = await login(payload);
//       this.token = res.data.token;
//       setToken(res.data.token);
//     },
//   },
// });
