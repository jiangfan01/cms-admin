import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/styles/index.scss";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();
const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(pinia)
  .mount("#app");

// 路由守卫
import "./permission";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
