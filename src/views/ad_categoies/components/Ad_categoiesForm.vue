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
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" />
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
import {
  fetchAd_categories,
  createAd_categories,
  updateAd_categories,
} from "@/api/ad_categoies";
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
  sort: "",
  description: "",
});

const rules = ref({
  name: [
    { required: true, message: "请填写用户名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在2~10个字符", trigger: "blur" },
  ],
  sort: [{ required: true, message: "请填写密码", trigger: "blur" }],
  description: [{ required: true, message: "请填写密码", trigger: "blur" }],
});

// 编辑获取用户组
const fetchData = async () => {
  const res = await fetchAd_categories(route.params.id);
  form.value = res.data.category;
};

if (props.isEdit) {
  fetchData();
}

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let res;
      if (props.isEdit) {
        res = await updateAd_categories(route.params.id, form.value);
      } else {
        res = await createAd_categories(form.value);
      }
      if (res.code !== 20000) {
        return ElMessage.error(res.message);
      }
      ElMessage.success(res.message);
      await router.push({ path: "/ad_categoies" });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
