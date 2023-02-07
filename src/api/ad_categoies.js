import request from "@/utils/request";

// 查询列表
export function fetchAd_categoriesList(params) {
  return request({
    url: "/admin/ad_categories",
    method: "get",
    params,
  });
}

// 查询单条
export function fetchAd_categories(id) {
  return request({
    url: `/admin/ad_categories/${id}`,
    method: "get",
  });
}

// 创建
export function createAd_categories(data) {
  return request({
    url: "/admin/ad_categories",
    method: "post",
    data,
  });
}

// 修改
export function updateAd_categories(id, data) {
  return request({
    url: `/admin/ad_categories/${id}`,
    method: "put",
    data,
  });
}

// 删除
export function deleteAd_categories(id) {
  return request({
    url: `/admin/ad_categories/${id}`,
    method: "delete",
  });
}

// 修改排序
export function changeAd_categoriesSort(data) {
  return request({
    url: `/admin/ad_categories/change_sort`,
    method: "patch",
    data,
  });
}
