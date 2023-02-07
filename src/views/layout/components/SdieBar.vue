<template>
  <el-aside width="200px">
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router>
      <!--      <el-menu-item index="/">-->
      <!--        <template #title>-->
      <!--          <el-icon>-->
      <!--            <PieChart />-->
      <!--          </el-icon>-->
      <!--          仪表盘-->
      <!--        </template>-->
      <!--      </el-menu-item>-->
      <el-sub-menu
        :index="menu.title"
        v-for="menu in authStore.menus"
        :key="menu.id"
      >
        <template #title>
          <el-icon>
            <component :is="menu.icon"></component>
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item
          :index="child.path"
          v-for="child in menu.children"
          :key="child.id"
        >
          <el-icon>
            <component :is="child.icon"></component>
          </el-icon>
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const authStore = useAuthStore();
const activeMenu = computed(() => {
  return route.path;
});
</script>
