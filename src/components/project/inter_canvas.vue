<template>
    <div id="chartPie">
<p class="w-nocont" v-show="nodata">暂无数据</p>
    </div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入折线图
require("echarts/lib/chart/line");
// 引入雷达
require("echarts/lib/chart/radar");
// 引入scatter 散射图
require("echarts/lib/chart/scatter");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/visualMap");
export default {
  data() {
    return {
		    nodata:false,
        tip:'暂无数据',
        imageData_5: {},
	   };
  },
  props: ["summary"],
  watch: {
    summary: "setPie"
  },
  methods: {
    setPie() {
      let alldata =this.summary.discussMessageCount +this.summary.topicCount +this.summary.leaveMessageCount;
      if (alldata == 0) {
        this.nodata = true;
        return;
      }
      //let discussMessageCount = (this.summary.discussMessageCount/alldata *100).toFixed(3);
      //let topicCount = (this.summary.topicCount / alldata * 100).toFixed(3);
      //let leaveMessageCount = (this.summary.leaveMessageCount /alldata *100).toFixed(3);
      let chartPie = echarts.init(document.getElementById("chartPie"));
      chartPie.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} :{c}({d}%)",
          padding: 10,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1
        },
        series: [
          {
            name: "互动情况",
            color: ["#FE716F", "#3DB6FB", "#8898FB"],
            type: "pie",
            radius: "50%",
            // center: ['50%', '50%'],
            label: {
              normal: {
                formatter: "{abg|}  {b|{b}：}{c}",
                rich: {
                  b: {
                    fontSize: 14,
                    lineHeight: 33
                  },
                  per: {
                    color: "#000",
                    fontSize: 14,
                    // backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: this.summary.topicCount, name: "帖子" },
              { value: this.summary.leaveMessageCount, name: "留言" },
              { value: this.summary.discussMessageCount, name: "讨论" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });

      this.imageData_5 = chartPie;
      this.$emit("listenImg5", this.imageData_5);
    }
  },
};
</script>
<style lang="less" scoped>
#chartPie {
  margin-top: 47px;
  width: 100%;
  height: 410px;
  overflow: hidden;
   .w-nocont{
		 height: 467px;
		margin-bottom: 20px;
		text-align: center;
		color: #999;
		font-size: 24px;
		padding-top: 150px;
	 }
}
</style>
