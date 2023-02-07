<template>
  <div class="box">
    <h1>长乐未央管理后台</h1>
    <div class="login">
      <el-form
        :model="form"
        label-width="120px"
        ref="ruleFormRef"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router/dist/vue-router";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const ruleFormRef = ref();
const form = ref({
  username: "",
  password: "",
});

const rules = ref({
  username: [
    {
      required: true,
      message: "请填写用户组名称",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请填写用户组名称",
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      //调用pinia的方式，调用sigIn方法，并把表单的值传过去
      await authStore.signIn(form.value);
      await router.push({ path: "/" });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped>
h1 {
  text-align: center;
  padding-top: 180px;
}
.login {
  display: flex;
  justify-content: center;
}
.demo-ruleForm {
  width: 50%;
}
</style>
