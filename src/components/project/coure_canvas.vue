<template>
    <div id="jclazzLearn">
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
import api from '@/global/resource'
import model from 'model/clazz/index'
export default {
  data(){
      return {
		nodata:false,
        tip:'暂无数据',

        imageData_3: {},
      }
  },
  props:['summary'],
  watch:{
	 summary:'jclazzLearnData' 
  },
  methods:{

			jclazzLearnData(){
				if(!!this.summary.courseSatisfieds &&this.summary.courseSatisfieds.length!=0){
					var resData=this.summary.courseSatisfieds;
					var len=resData.length;
				}else{
					this.nodata=true;
					return
				};				

				let data=[];
				resData.forEach((item,index) =>{
					data[index] = new Array();
					data[index].push(index,item.satisfiedRate,item.clazzName,item.name);//横坐标数组长度，纵坐标满意度，班级名，课程名
					
				});
				let data2=[];
				for(let i=0;i<data.length;i++){
					if(data[i][1]!=0){
                       data2.push(data[i])    
					}
				};

				var myoption = {
				    backgroundColor:"#fff",
				    tooltip: {
								padding: 10,
								backgroundColor: '#222',
								borderColor: '#777',
								borderWidth: 1,
								formatter: function (params) {
										var value = "";
										value += "课程名："+params["data"][3];
										value += '<br/>';
										value += "课程满意度：" +params["data"][1] + "%";
										value += '<br/>';
										value +="班级名："+ params["data"][2];
										return value;
								    }
								},
				    grid: {
				        left: '50px',
				        right: '10px',
				        top: '15px',
				        bottom: '30px'
				    },
				    xAxis: {
                        splitNumber : 20,
				        min: 0,
				        max:len,
				        splitLine: {
				        	show:false,
				        }
				    },
				    yAxis: {
                        splitNumber : 10,
				        min: 0,
				        max:100,
				        splitLine: {
				        	show:false,
				        },
				         axisLabel: {
            				formatter: '{value} %'
        				},
				        scale: true
				    },
				    series: [{
				        name: '课程满意度',
				        data: data2,
				        type: 'scatter',
				        symbolSize: 12,
				        itemStyle: {
							normal: {
								color:"#fd9e59",
								opacity:1
							}
						}
				    }]
				};
				let jclazzLearn = echarts.init(document.getElementById('jclazzLearn'));	
				jclazzLearn.setOption(myoption,true);

				this.imageData_3 = jclazzLearn;
				this.$emit("listenImg3", this.imageData_3);
			},
  },
}    
</script>
<style lang="less" scoped>
#jclazzLearn{
    margin-top: 48px;
    width: 100%;
	height: 500px;
	 .w-nocont{
		 height: 467px;
		margin-bottom: 20px;
		text-align: center;
		color: #999;
		font-size: 24px;
		padding-top: 200px;
	 }
}
</style>
