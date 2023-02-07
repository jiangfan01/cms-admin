<template>
  <div class="role-form">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="用户组名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" />
      </el-form-item>
      <el-form-item label="菜单与权限" prop="permissions">
        <el-tree
          ref="treeRef"
          :data="permissions"
          :props="{ label: 'title' }"
          show-checkbox
          default-expand-all
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          check-on-click-node
          check-strictly
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-loading="loading"
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          提交
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchRole, createRole, updateRole } from "@/api/roles";
import { fetchPermissionList } from "@/api/permissions";
import { ElMessage } from "element-plus";

// 接受 Props
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const route = useRoute();
const ruleFormRef = ref();
const form = ref({
  name: "",
  sort: 0,
  permissions: [],
});
const permissions = ref([]);
const rules = ref({
  name: [
    {
      required: true,
      message: "请填写用户组名称",
      trigger: "blur",
    },
  ],
});
const treeRef = ref();

// 获取所有的权限列表
const fetchPermissions = async () => {
  const res = await fetchPermissionList();
  permissions.value = res.data.permissions;
};

fetchPermissions();

// 编辑获取用户组
const fetchData = async () => {
  const res = await fetchRole(route.params.id);
  form.value = res.data.role;

  // 获取当前用户所拥有的所有权限，通过map循环只要id。设置到tree里
  const permissons = res.data.permissions.map((item) => item.id);
  treeRef.value.setCheckedKeys(permissons, false);
};
if (props.isEdit) {
  fetchData();
}

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      // getCheckedKeys方法，获取被选择的数据，只有id
      console.log(treeRef.value.getCheckedKeys(false));
      form.value.permissions = treeRef.value.getCheckedKeys(false);

      let res;
      if (props.isEdit) {
        res = await updateRole(route.params.id, form.value);
      } else {
        res = await createRole(form.value);
      }

      ElMessage.success(res.message);
      await router.push({ path: "/roles" });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
