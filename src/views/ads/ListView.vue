<template>
  <div class="home">
    <el-button round class="create" @click="handleCreate">新增</el-button>
    <el-table :data="categoies" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="sort" label="排序" width="180" />
      <el-table-column label="日期" width="180">
        <template #default="scope">
          <div>{{ dateFormat(scope.row.createdAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.id)"
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
import { ref } from "vue";
import { fetchAdsList, deleteAds } from "@/api/ads";
import moment from "moment";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router/dist/vue-router";

const router = useRouter();
const handleEdit = (id) => {
  router.push({ path: `ad_categoies/edit/${id}` });
};
const handleCreate = () => {
  router.push({ path: "ad_categoies/add" });
};

const categoies = ref([]);

//方法
const init = async () => {
  const res = await fetchAdsList();
  categoies.value = res.data.categoies;
};
const dateFormat = (value) => {
  if (!value) {
    return "";
  }
  moment.locale("zh-cn");
  return moment(value).format("LL");
};
const handleDelete = async (id) => {
  const res = await deleteAds(id);
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
