<template>
    <div id="wScatter">
         <p class="w-nocont" v-show="nodata">暂无数据</p>
	</div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
    // 引入饼图组件
require('echarts/lib/chart/pie')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入折线图
require('echarts/lib/chart/line')
// 引入雷达
require('echarts/lib/chart/radar')
// 引入scatter 散射图
require('echarts/lib/chart/scatter')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/visualMap')
export default {
    data(){
      return {
		nodata:false,
		tip:'暂无数据',
		imageData_1: {},
      }
  },
	props:['summary'],

	watch:{
		summary:'wScatter'
	},
	 computed:{
        orgId() {
				return this.$route.query.orgId;
			},
    },
    methods:{
		nubsort(a,b){
			return b-a
		},
        wScatter(newdata) {	
		    if(!!this.summary.clazzSatisfieds && this.summary.clazzSatisfieds.length!=0){
				var data1 = this.summary.clazzSatisfieds; //项目满意度数据
			}else{
				this.nodata=true;
				return
			};											
			let data = [];
			let data2=[];
			data1.forEach(function(item, index) {
				let courseNum = index+1;
				data[index] = new Array();
				data2[index] = new Array();
				data2[index].push(item.studentCount);
				data[index].push(courseNum,item.satisfiedRate,item.name, item.satisfiedRate,item.satisfiedSubmitCount);
                   // (横坐标数组长度，纵坐标满意度，班级名，满意度，提交人数)
			});
			let personNum =data2.sort(this.nubsort)[0];//总人数取班级人数的最大值
			let len = data.length; // 数组长度
			let chartWScatter = echarts.init(document.getElementById('wScatter'));				
			let schema = [
			    {name: 'num', index: 0, text: '参与人数'},
			    {name: 'rate', index: 1, text: '好评率'}
			];


			let itemStyle = {
			    normal: {
			        opacity: 0.8,
			        shadowBlur:3,
			        shadowOffsetX: 0,
			        shadowOffsetY: 0,
			        shadowColor: 'rgba(0, 0, 0, 0.5)'
			    }
			};

			let option = {
			    backgroundColor: '#fff',
			    color: [
			        '#6355BC'
			    ],
			    
			    grid: {
			        x: '5%',
			        x2: 150,
			        y: '10%',
			        y2: '10%'
			    },
			    tooltip: {
			        padding: 10,
			        backgroundColor: '#222',
			        borderColor: '#777',
			        borderWidth: 1,
			        formatter: function (obj) {
                        var value = obj.value;
			            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;max-width: 250px; white-space: normal; ">'
			                + '<p style="margin-bottom: 10px;">班级：'  + value[2] 
			                + '</div>'
			                + schema[0].text + '：' + value[4] + '<br>'
			                + schema[1].text + '：' + value[1] + '%<br>';
			        }
			    },
			    xAxis: {
			        type: 'value',
			        // name: '课程数量',
			        nameGap: 16,
			        nameTextStyle: {
			            color: '#000',
			            fontSize: 14
					},
					min:0,
					max: parseInt(len),
					interval: 1,
			        splitLine: {
			            show: false
			        },
			        axisLine: {
			            lineStyle: {
			                color: '#000'
			            }
			        }
			    },
			    yAxis: {
			        type: 'value',
			        axisLabel: {
	                    formatter: '{value} %'
	                },
			        // name: '好评率',
			        nameLocation: 'end',
					nameGap: 20,
					min:0,
					max:100,
			        nameTextStyle: {
			            color: '#000',
			            fontSize: 14
			        },
			        axisLine: {
			            lineStyle: {
			                color: '#000'
			            }
			        },
			        splitLine: {
			            show: false
			        }
			    },
			    visualMap: [
			        {
			            left: 'right',
			            top: '10%',
			            dimension:4,
			            min: 0,
			            max: parseInt(personNum),
			            itemWidth: 17,
			            itemHeight: 50,
			            calculable: true,
			            precision: 0.1,
			            text: ['圆形大小：参与人数'],
			            textGap: 30,
			            textStyle: {
			                color: '#000'
			            },
			            inRange: {
			                symbolSize: [10, 60]
			            },
			            outOfRange: {
			                symbolSize: [10, 60],
			                color: ['rgba(255,255,255,.2)']
			            },
			            controller: {
			                inRange: {
			                    color: ['#BDC6D7']
			                },
			                outOfRange: {
			                    color: ['#BDC6D7']
			                }
			            }
			        },
			        {
			            left: 'right',
			            bottom: '5%',
			            dimension: 1,
			            min: 0,
			            max: 100,
			            itemWidth: 17,
			            itemHeight: 50,
			            calculable: true,
			            precision: 0.1,
			            text: ['明暗：好评率'],
			            textGap: 30,
			            textStyle: {
			                color: '#000'
			            },
			            inRange: {
			                colorLightness: [1, 0.5]
			            },
			            outOfRange: {
			                color: ['rgba(255,255,255,.2)']
			            },
			            controller: {
			                inRange: {
			                    color: ['#9286DF']
			                },
			                outOfRange: {
			                    color: ['#fff']
			                }
			            }
			        }
			    ],
			    series: [
			        {
			            name: '北京',
			            type: 'scatter',
			            itemStyle: itemStyle,
			            data: data
			        }
			    ]
			};
			chartWScatter.setOption(option);

			this.imageData_1 = chartWScatter;
			this.$emit("listenImg1", this.imageData_1);
		}
	},
}
</script>
<style lang="less" scoped>
 #wScatter{
     margin-top: 48px;
     width: 100%;
	 height: 500px;
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

