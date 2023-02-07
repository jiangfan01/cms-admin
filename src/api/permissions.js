import request from "@/utils/request";

// 查询列表
export function fetchPermissionList(params) {
  return request({
    url: "/admin/permissions",
    method: "get",
    params,
  });
}

// 查询单条
export function fetchPermission(id) {
  return request({
    url: `/admin/permissions/${id}`,
    method: "get",
  });
}

// 创建
export function createPermission(data) {
  return request({
    url: "/admin/permissions",
    method: "post",
    data,
  });
}

// 修改
export function updatePermission(id, data) {
  return request({
    url: `/admin/permissions/${id}`,
    method: "put",
    data,
  });
}

// 删除
export function deletePermission(id) {
  return request({
    url: `/admin/permissions/${id}`,
    method: "delete",
  });
}

// 修改排序
export function changePermissionSort(data) {
  return request({
    url: `/admin/permissions/change_sort`,
    method: "patch",
    data,
  });
}
