<template>
    <div id="active">
         <p class="w-nocont" v-show="nodata">暂无数据</p>
    </div>
</template>
<script>
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/visualMap')
export default {
    data(){
        return {
            nodata:false,
            tip:'暂无数据',
            namedata:[],

            imageData_4: {},
        }
    },
  props:['summary'],
  watch:{
     summary:'active' 
  } , 
  methods:{
    //   sortdata(a,b){
    //       return b-a
    //   },
    //   sortname(num){
    //       let name;
    //       switch(num)
    //             {
    //             case num=this.summary.homeworkCommitCount:
    //             name='作业';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.evaluationCommitCount:
    //             name='评价';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.introspectionCommitCount:
    //             name='反思';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.userLogCommitCount:
    //             name='日志';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.voteCommitCount:
    //             name='投票';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.questionnaireCommitCount:
    //             name='问卷';
    //             this.namedata.push(name);
    //             break;
    //             case num=this.summary.photowallCommitCount:
    //             name='照片墙';
    //             this.namedata.push(name);
    //             break;
    //             }
    //   },
      active(){
            let alldata=this.summary.homeworkCommitCount+
                        this.summary.evaluationCommitCount+
                        this.summary.introspectionCommitCount+
                        this.summary.userLogCommitCount+
                        this.summary.voteCommitCount+
                        this.summary.questionnaireCommitCount+
                        this.summary.photowallCommitCount;
            if(alldata==0){
               this.nodata=true;
               return 
            };
            // 计算y轴数据
            let ymaxheight=alldata;

                //ymaxheight=Math.ceil(alldata/500)*500;
                    
            var dom = document.getElementById("active");
            var myChart = echarts.init(dom);
            var app = {};
            let option = null;
            option = {
                tooltip : {
                    padding: 10,
					backgroundColor: '#222',
					borderColor: '#777',
					borderWidth: 1,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    showContent:true,
                    formatter: function (params) {
                        var tar = params[1];
                        return tar.name + '<br/>' +'合计' + ' : ' + tar.value;
                    }
                },
                grid: {
                    top:'5%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type : 'category',
                    splitLine: {show:false},
                    data : ['成果总数',
                    '作业',
                    '评价',
                    '反思',
                    '日志',
                    '投票',
                    '问卷',
                    '照片墙'
                    ]
                },
                yAxis: {
                    type : 'value',
                    min:0,
                    max:ymaxheight,
                },
                series: [

                    {
                        name: '纵',
                        type: 'bar',
                        stack:  '总量',
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }

                        },
                        data: [ymaxheight-alldata,
                               ymaxheight-this.summary.homeworkCommitCount, 
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount, 
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount-this.summary.introspectionCommitCount, 
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount-this.summary.introspectionCommitCount-this.summary.userLogCommitCount, 
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount-this.summary.introspectionCommitCount-this.summary.userLogCommitCount-this.summary.voteCommitCount,
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount-this.summary.introspectionCommitCount-this.summary.userLogCommitCount-this.summary.voteCommitCount-this.summary.questionnaireCommitCount,
                               ymaxheight-this.summary.homeworkCommitCount-this.summary.evaluationCommitCount-this.summary.introspectionCommitCount-this.summary.userLogCommitCount-this.summary.voteCommitCount-this.summary.questionnaireCommitCount-this.summary.photowallCommitCount,]
                    },
                    {
                        name: '横',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                color:'#ffffff',
                                shadowColor:'rgba(0,0,0,0)'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#8CB3F6'},   
                                    {offset: 1, color: '#6ABFFF'}
                                ]
                                )
                             }
                        },
                        barWidth:40,
                        data:[
                        alldata, 
                        this.summary.homeworkCommitCount, 
                        this.summary.evaluationCommitCount,
                        this.summary.introspectionCommitCount,
                        this.summary.userLogCommitCount,
                        this.summary.voteCommitCount,
                        this.summary.questionnaireCommitCount,
                        this.summary.photowallCommitCount
                        ]
                    }
                ]
            };
            // let ymax=options.yAxis.max;
            // console.log(ymax)
            myChart.setOption(option, true);

            this.imageData_4 = myChart;
            this.$emit("listenImg4", this.imageData_4);
           
      }
  },
}
</script>
<style lang="less" scoped>
#active{
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
