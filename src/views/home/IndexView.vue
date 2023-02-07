<template>
  <div id="main" style="height: 100%"></div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { fetchChartsList } from "@/api/charts";
const months = ref([]);
const data = ref([]);
const init = async () => {
  const res = await fetchChartsList();
  months.value = res.data.months;
  data.value = res.data.data;
};

onMounted(async () => {
  await init();
  let myChart = echarts.init(document.getElementById("main"));
  myChart.setOption({
    title: {
      text: "文章数量",
    },
    // 鼠标放上去提示信息
    tooltip: {
      trigger: "文章数",
    },
    // 工具栏
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        dataView: { readOnly: false },
        magicType: { type: ["line", "bar"] },
        restore: {},
        saveAsImage: {},
      },
    },
    legend: {
      data: ["数量"],
    },
    // X轴数据
    xAxis: {
      data: months.value,
    },
    yAxis: {},
    color: ["#66CCFF"],
    series: [
      {
        name: "数量",
        type: "bar",
        data: data.value,
      },
    ],
  });
  window.onresize = function () {
    myChart.resize();
  };
});
</script>
