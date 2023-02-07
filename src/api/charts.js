import request from "@/utils/request";

// 查询列表
export function fetchChartsList(params) {
  return request({
    url: "/admin/charts/articles",
    method: "get",
    params,
  });
}
