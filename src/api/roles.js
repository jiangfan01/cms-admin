import request from "@/utils/request";

// 查询列表
export function fetchRoleList(params) {
  return request({
    url: "/admin/roles",
    method: "get",
    params,
  });
}

// 查询单条
export function fetchRole(id) {
  return request({
    url: `/admin/roles/${id}`,
    method: "get",
  });
}

// 创建
export function createRole(data) {
  return request({
    url: "/admin/roles",
    method: "post",
    data,
  });
}

// 修改
export function updateRole(id, data) {
  return request({
    url: `/admin/roles/${id}`,
    method: "put",
    data,
  });
}

// 删除
export function deleteRole(id) {
  return request({
    url: `/admin/roles/${id}`,
    method: "delete",
  });
}

// 修改排序
export function changeRoleSort(id, data) {
  return request({
    url: `/admin/roles/${id}/change_sort`,
    method: "patch",
    data,
  });
}
