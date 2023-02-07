<template>
  <div class="User-form">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="form.username" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="初始密码" prop="oldPassword" v-if="isEdit">
        <el-input
          v-model="form.oldPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input
          v-model="form.passwordConfirm"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="用户组" prop="roleId">
        <el-radio-group v-model="form.roleId">
          <el-radio :label="role.id" v-for="role in roles" :key="role.id">
            {{ role.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
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
import { fetchUser, createUser, updateUser } from "@/api/users";
import { fetchRoleList } from "@/api/roles";
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
const roles = ref([]);
const form = ref({
  oldPassword: "",
  password: "",
  username: "",
  passwordConfirm: "",
  roleId: "",
});
const validatePasswordConfirm = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写重复密码"));
  } else if (value !== form.value.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rules = ref({
  username: [
    { required: true, message: "请填写用户名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在2~10个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请填写密码", trigger: "blur" },
    { min: 6, max: 45, message: "长度在6~45个字符", trigger: "blur" },
  ],
  passwordConfirm: [{ validator: validatePasswordConfirm, trigger: "blur" }],
});

// 编辑获取用户组
const fetchData = async () => {
  const res = await fetchUser(route.params.id);
  form.value = res.data.user;
  form.value.password = "";
};

// 获取所有的用户组
const fetchRoles = async () => {
  const res = await fetchRoleList();
  roles.value = res.data.roles;
};
fetchRoles();

if (props.isEdit) {
  fetchData();
}

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let res;
      if (props.isEdit) {
        res = await updateUser(route.params.id, form.value);
      } else {
        res = await createUser(form.value);
      }
      if (res.code !== 20000) {
        return ElMessage.error(res.message);
      }
      ElMessage.success(res.message);
      await router.push({ path: "/users" });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
