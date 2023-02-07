<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple" />
        <el-tree
          :data="permissions"
          default-expand-all
          node-key="id"
          :expand-on-click-node="false"
          draggable
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>
                <el-icon>
                  <component :is="data.icon"></component>
                </el-icon>
                {{ data.title }}
                <el-tag v-if="data.path" size="small">{{ data.path }}</el-tag>
              </span>
              <span>
                <a @click="append(data)" v-if="data.level !== 3"> 添加 </a>
                <a @click="edit(data)">编辑</a>
                <a @click="remove(node, data)"> 删除 </a>
              </span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-form
          :model="form"
          ref="ruleFormRef"
          :rules="rules"
          status-icon
          label-width="120px"
        >
          <el-form-item label="上级菜单" prop="parentId">
            <el-cascader
              ref="cascader"
              v-model="form.parentId"
              :options="menus"
              @change="handleChange"
              :show-all-levels="false"
              :props="{
                checkStrictly: true,
                label: 'title',
                value: 'id',
                expandTrigger: 'hover',
                emitPath: false,
              }"
            />
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="例: 分类列表" />
          </el-form-item>

          <el-form-item label="图标" prop="icon" v-if="form.level !== 3">
            <el-input v-model="form.icon" placeholder="例: Sunny" />
          </el-form-item>

          <el-form-item
            label="页面链接路径"
            prop="path"
            v-if="form.level !== 1"
          >
            <el-input v-model="form.path" placeholder="例: /categories" />
          </el-form-item>

          <el-form-item
            label="组件路径"
            prop="component"
            v-if="form.level === 3"
          >
            <el-input
              v-model="form.component"
              placeholder="请省略@/views/，直接写categories/ListView"
            />
          </el-form-item>

          <el-form-item label="请求方式" prop="method" v-if="form.level === 3">
            <el-select v-model="form.method" placeholder="请选择">
              <el-option
                v-for="method in methods"
                :key="method"
                :label="method"
                :value="method"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="接口路径" prop="api" v-if="form.level === 3">
            <el-input v-model="form.api" placeholder="例: /admin/categories" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  fetchPermissionList,
  fetchPermission,
  updatePermission,
  changePermissionSort,
  createPermission,
} from "@/api/permissions";
import { ElMessage } from "element-plus";
import { deepClone } from "@/utils";

const methods = ref(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const permissions = ref([]);
const ruleFormRef = ref();
const isEdit = ref(false);
const cascader = ref();
const menus = ref([]);
const defaultForm = ref({
  level: 1,
  parentId: 0,
  title: "",
  path: null,
  component: null,
  method: null,
  api: null,
  sort: 99,
});
const form = ref({
  level: 1,
  parentId: 0,
  title: "",
  path: null,
  component: null,
  method: null,
  api: null,
  sort: 99,
});
const rules = ref({
  title: [
    { required: true, message: "请填写菜单名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 ~ 20 位", trigger: "blur" },
  ],
});

// 获取所有的权限列表
const fetchPermissions = async () => {
  const res = await fetchPermissionList();
  permissions.value = res.data.permissions;
  menus.value = [
    {
      title: "顶级菜单",
      id: 0,
      level: 1,
      children: res.data.menus,
    },
  ];
};
fetchPermissions();

//选择上级菜单
const handleChange = () => {
  const nodes = cascader.value.getCheckedNodes();
  form.value.level = nodes[0].level;
};

//新增
const append = (data) => {
  resetForm();
  isEdit.value = false;
  form.value.parentId = data.id;
  form.value.level = data.level + 1;
};

//编辑
const edit = async (data) => {
  const res = await fetchPermission(data.id);
  isEdit.value = true;
  form.value = res.data.permission;
};

//重置, 这里重置会给原来对象重新赋值会产生浅拷贝
const resetForm = () => {
  //重新访问新增时重新设默认值
  // form.value = {
  //   level: 1,
  //   parentId: 0,
  //   title: "",
  //   path: null,
  //   component: null,
  //   method: null,
  //   api: null,
  //   sort: 99,
  // };

  // 这种写法可以实现深拷贝，但是如果是多级嵌套的，会失效。
  // form.value = Object.assign({}, defaultForm.value);

  //使用外部js文件来处理深拷贝
  form.value = deepClone(defaultForm.value);
};

//提交表单
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let res;
      if (isEdit.value) {
        res = await updatePermission(form.value.id, form.value);
      } else {
        res = await createPermission(form.value);
      }
      if (res.code !== 20000) {
        ElMessage.error(res.message);
      }
      ElMessage.success(res.message);
      await fetchPermissions();
    }
  });
};

//判断是否可以拖拽
const allowDrop = (draggingNode, dropNode, type) => {
  // 禁止不同层级的节点拖拽
  if (draggingNode.level !== dropNode.level) {
    return false;
  }

  // 禁止不同父级菜单的节点拖拽
  if (draggingNode.data.parentId !== dropNode.data.parentId) {
    return false;
  }

  // 禁止拖拽到内层
  return type !== "inner";
};

//使用嵌套完成排序
// const generateSorts = (permissions) => {
//   const sorts = [];
//   //第一层循环
//   permissions.forEach((firstItem, firstIndex) => {
//     sorts.push({ id: firstItem.id, sort: firstIndex + 1 });
//
//     //第二层
//     firstItem.children.forEach((secondItem, secondIndex) => {
//       sorts.push({ id: secondItem.id, sort: secondIndex + 1 });
//
//       //第三层
//       secondItem.children.forEach((thirdItem, thirdIndex) => {
//         sorts.push({ id: thirdItem.id, sort: thirdIndex + 1 });
//       });
//     });
//   });
//
//   return sorts;
// };

//使用递归完成排序
const generateSorts = (permissions) => {
  const sorts = [];

  permissions.forEach((item, index) => {
    //如果有子级继续循环直到条件不满足
    if (item.children) {
      sorts.push(...generateSorts(item.children));
    }
    // 如果没有子级，表示已经到最后一层了，结束循环
    sorts.push({ id: item.id, sort: index + 1 });
  });
  return sorts;
};

//调用嵌套完成的数据进行接口排序
const handleDrop = async () => {
  const sorts = generateSorts(permissions.value);
  const res = await changePermissionSort({ sorts });
  ElMessage.success(res.message);
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
