<template>
  <el-container>
    <el-header>
      <img
        src="https://images.clwy.cn/common/logo.png"
        alt="长乐未央Logo"
        class="logo"
      />
      <h1>长乐未央后台管理</h1>
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ authStore.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <Sidebar />
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>
          Copyright 2013 - 2023 CLWY Inc. All Rights Reserved.
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from "./components/SdieBar";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
console.log(authStore);
const router = useRouter();

const handleCommand = (command) => {
  if (command === "logout") {
    authStore.resetToken();
    router.push("/login");
  }
};
</script>
<style>
.user-info {
  float: right;
}
</style>
