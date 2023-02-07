<template>
  <div class="home">
    <el-button round class="create" @click="gotoCreate">新增</el-button>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180" />
      <el-table-column prop="username" label="名称" width="180" />
      <el-table-column prop="role.name" label="编号" width="180" />
      <el-table-column label="日期" width="180">
        <template #default="scope">
          <div>{{ dateFormat(scope.row.createdAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="gotoEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { ref } from "vue";
import { fetchUserList, deleteUser } from "@/api/users";
import moment from "moment";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

//data
const users = ref([]);

//路由跳转
const router = useRouter();
const gotoEdit = (id) => {
  router.push({ path: `users/edit/${id}` });
};
const gotoCreate = () => {
  router.push({ path: "/users/add" });
};

//方法
const init = async () => {
  const res = await fetchUserList();
  users.value = res.data.users;
};
const dateFormat = (value) => {
  if (!value) {
    return "";
  }
  moment.locale("zh-cn");
  return moment(value).format("LL");
};
const handleDelete = async (id) => {
  const res = await deleteUser(id);
  if (res.code !== 20000) {
    ElMessage.error(res.message);
    return;
  }
  ElMessage.success(res.message);
  await init();
};

//调用init 相当于生命周期
init();
</script>

<style scoped>
.create {
  margin-bottom: 30px;
  margin-top: 10px;
}
</style>
