<template>
    <div id="chartPie2">
        <p class="w-nocont" v-show="nodata">暂无数据</p>
    </div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");

// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/visualMap");
export default {
    data() {
        return {
    		nodata:false,
            tip:'暂无数据',

            imageData_2: {}
    	};
    },
    props: ["summary"],
    watch: {
        summary: "setPie"
    },
    methods: {
        setPie() {
            let alldata = this.summary.courseAljx +
                            this.summary.courseCgkc +
                            this.summary.courseDxfx +
                            this.summary.courseFajd +
                            this.summary.courseHdjl +
                            this.summary.courseJxgm +
                            this.summary.courseJxsj + 
                            this.summary.courseOther +
                            this.summary.coursePbhd +
                            this.summary.courseWtyt +
                            this.summary.courseZjfs +
                            this.summary.courseZtjz +
                            this.summary.courseLive;
            if (alldata == 0) {
                this.nodata = true;
                return;
            }
            console.log("所有课程", this.summary);
            let chartPie2 = echarts.init(document.getElementById("chartPie2"));
            // this.chartArray["imageData_1"] = chartPie2;
            chartPie2.setOption({
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
                    name: "课程情况",
                    color: ["#8898FB", "#32D5C5", "#AFA9FF", "#FE8080", "#AC9185", "#FFBE37", "#D691D1", "#00ABB4", "#9365A4", "#47B854", "#A7A99C", "#5CD7DD", "#0F9FEC"],
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
                        { value: this.summary.courseAljx, name: "案例教学" },
                        { value: this.summary.courseCgkc, name: "参观考察" },
                        { value: this.summary.courseDxfx, name: "到校访学" },
                        { value: this.summary.courseFajd, name: "方案解读" },
                        { value: this.summary.courseHdjl, name: "互动交流" },
                        { value: this.summary.courseJxgm, name: "教学观摩" },
                        { value: this.summary.courseJxsj, name: "教学实践" },
                        { value: this.summary.courseOther, name: "其他" },
                        { value: this.summary.coursePbhd, name: "破冰活动" },
                        { value: this.summary.courseWtyt, name: "问题研讨" },
                        { value: this.summary.courseZjfs, name: "总结反思" },
                        { value: this.summary.courseZtjz, name: "专题讲座" },
                        { value: this.summary.courseLive, name: "直播课" }
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

            this.imageData_2 = chartPie2;
            this.$emit("listenImg2", this.imageData_2);
        }
    },
};
</script>
<style lang="less" scoped>
#chartPie2 {
    margin-top: 107px;
    padding-bottom: 30px;
    width: 100%;
    height: 440px;
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
