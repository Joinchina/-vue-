<template>
    <div class="j-clazz">
      <!--面包屑-->
      <div class="wrapper answer x-view">
        <nav class="subnav clearfix">
          <Goback :passtitle="eData.title ? eData.title : '饼图统计数据'" ></Goback>
          <span class="right">
              <span class="btn-green j-btn-gray" v-show="!reportBtnFlag">
                报告生成中......
              </span>
              <span class="btn-green" @click = "exportEvaluationPdfM" v-show="reportBtnFlag">
                <i class="icon-export-white"></i>导出报告
              </span>
				  </span>

        </nav>
        <div class="answer_tit answer_left_none round-layout">
          <h1 v-if="!!eData.title">{{eData.title}}</h1>
          <div class="detail">
            <ul class="discuss-dis">
              <li>
                <span class="icon-clazz" style="vertical-align: top"></span>
                <span class="icon-con" v-if="!!eData.clazzName">{{eData.clazzName}}</span>

              </li>
              <li>
                <span class="icon-course" style="vertical-align: top"></span>
                <span class="icon-con" v-if="!!eData.courseName">课程:{{eData.courseName}}</span>
              </li>
              <li>
                <span class="icon-members"></span>
                <span class="icon-con">
                  主讲人:
                  <span v-if="!!eData.mainTeacherName">{{eData.mainTeacherName}}</span>
                  <span v-else>无</span>
                </span>
              </li>
              <li>
                <span class="icon-time"></span>
                <!--项目任务-->
                <span class="icon-con ml8" v-if="crumbType == 'task'">
                  <span v-if="!!eData.beginTime || !!eData.endTime">{{eData.beginTime}} ~ {{eData.endTime}}</span>

                </span>

                <!--全部课程-->
                <span class="icon-con ml8" v-else-if= "crumbType == 'det'" >
                    <span v-if="!!eData.courseType && eData.courseType == 'SINGLE'">
                        <span v-if="!!eData.courseDate">{{eData.courseDate}}</span>
                        <span v-if="!!eData.courseBeginTime">{{eData.courseBeginTime}}</span> ~
                        <span v-if="!!eData.courseEndTime">{{eData.courseEndTime}}</span>
                    </span>
                    <span v-else-if="!!eData.courseType && eData.courseType == 'MULTI'">
                        <span v-if="!!eData.courseDate">{{eData.courseDate}}</span> ~  <span v-if="!!eData.endDate">{{eData.endDate}}</span>
                    </span>
                    <span v-else-if="!!eData.courseType && eData.courseType == 'LIVE'">
                        <span v-if="!!eData.courseDate">{{eData.courseDate}}</span>
                        <span v-if="!!eData.courseBeginTime">{{eData.courseBeginTime}}</span> ~
                        <span v-if="!!eData.courseEndTime">{{eData.courseEndTime}}</span>
                    </span>

                </span>
              </li>

            </ul>

          </div>
        </div>
      </div>
      <!--面包屑-->
      <!--content_start-->
      <div class="round-layout mt17 j-statistc">
        <h2>
          已提交人数：
          <span v-if="!!eData.submitNum">{{eData.submitNum}}</span>
          <span v-else>0</span>人
          <span class="ml32" v-if="!!eData.questionCount">题目总数：{{eData.questionCount}}个</span></h2>
          <!--<div id="myChartPie_0" :style="{width: '350px', height: '280px'}"></div>-->


        <ul>
          <li v-for = "(item,index) in questionArray" v-if="item.type == 'SELECT'">
            <h3>{{index + 1}}.{{item.question}}</h3>
            <div class="pie clearfix">
                <div class="left">
                    <div :id="'myChartPie_'+index" :style="{width: '300px', height: '300px'}"></div>

                    <!--<img src="../../assets/img/clazz/example-pie.png"/>-->
                </div>
                <div class="left left-table-dis">
                  <table  width="400" border="0" cellspacing="0" cellpadding="0" class="table-small">
                    <tr>
                      <th>答题选项</th>
                      <th>选择情况</th>
                      <th>百分比</th>
                    </tr>
                    <tr v-for="(nitem,index) in item.optionStatistics">
                      <td>{{nitem.optionContent}}</td>
                      <td>{{nitem.selectedCounts}}</td>
                      <td v-if="submitNum != 0">{{Math.round(nitem.selectedCounts*100 / submitNum)}}%</td>
                      <td v-else>0%</td>
                    </tr>
                  </table>
                </div>
            </div>
          </li>
          <li v-else-if="item.type == 'MUILTSELECT'">
            <h3>{{index + 1}}.{{item.question}}</h3>
            <div style="margin-left:80px; margin-top:50px;">
              <div :id="'myChartBar_'+index" :style="{width: '700px', height: '300px'}"></div>
            </div>
          </li>
          <li v-else-if="item.type == 'SUBJECTIVE'">
            <h3>{{index + 1}}.{{item.question}}</h3>
            <!-- 新增关键字 -->
              <div class="keyword">
                 关键词：<span v-for="(word,index) in item.keywords" :key="index" :style="{background:keywordColor[index%5],border:'1px solid '+keywordColor[index%5]+''}">{{word}}</span>
              </div>

            <table  border="0" cellspacing="0" cellpadding="0" class="table-big">          
              <tr>
                <th width="15%">序号</th>
                <th>提交内容</th>
              </tr>
              <tr v-for="(items,indexs) in item.answers">
                <td>{{indexs + 1}}</td>
                <td>{{items }}</td>
              </tr>
            </table>

          </li>
        </ul>
      </div>
      <iframe :src="'../../../../static/page/evaluation.html?paperId='+paperId+'&token='+token" frameborder="0" id="iframeId"></iframe>
      <!--content_end-->
     <!--导出报告-->
      <form id="exportForm" :action="urls" enctype="multipart/form-data" method="post">
         <input name="paperId" type="hidden"/>
         <input name="token" type="hidden"/>
      </form>
    </div>
</template>
<script>
  import model from 'model/activity/result'
  import api from '@/global/resource'
  import { getToken } from '@/filters/userVerify'
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入饼图组件
  require('echarts/lib/chart/pie')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  import Goback from 'base/goback/goback'
  import formsSummit from 'components/formsumit/form'
  export default {
    data(){
      return{
          clazzId:"",
          paperId:"",
          crumbType:"",
          reportBtnFlag:false,
          reportBtnSeconds:5,
          eData:{},
          questionArray:[],
          pieDataArray:[],
          pieTableArray:[],
          chartArray:[],
          chartArray2:[],
          barDataArray:{
            name:[],
            value:[]
          },
          piePercentage:0,
          submitNum:0,
          urls:"",
          keywordColor:['#DAFFEE','#FFE25C','#EEEEEE','#FFE0DF','#EEEEEE'],//高频词的四种颜色
          token:"",
          formObj:{
            method:"post",
            urls:api.urls.experttutu,
            data:{}
          },
      }
    },
    created(){
       this.clazzId = this.$route.query.clazzId;
       this.paperId = this.$route.query.paperId;
       this.urls = api.urls.exportEvaluationPDF;
       console.log("urls=========",this.urls);
       this.crumbType = this.$route.query.crumb;
       this.getEvaluationData();
       this.reportBtnShow();

    },
    mounted(){

    },
    methods:{
      reportBtnShow(){
          var _this = this;
          if(_this.reportBtnSeconds <= 0){
            _this.reportBtnFlag = true;
          }else{
            _this.reportBtnSeconds--;
            setTimeout(function () {
              _this.reportBtnShow();
            }, 1000);
          }

      },
      exportEvaluationPdfM(){
        if(!this.$store.getters.getOrgVipInfo.vip){
          this.$store.state.vipFuncPopFalg = true;
          return;
        }
        
         var form = $('#exportForm');
         $("#exportForm input[name='paperId']").val(this.paperId);
         $("#exportForm input[name='token']").val(getToken());
          // for(var i = 0;i < this.chartArray.length;i++){
            
          //     var imgData_input = $('<input type="hidden" name="imageData_' + i + '" />');
          //     if(this.chartArray[i].getDataURL){
          //         imgData_input.attr('value', this.chartArray[i].getDataURL({pixelRatio:1, backgroundColor:'#fff'}));
          //     }
          //     form.append(imgData_input);
          // }
          form.submit();
          // 注意return false取消链接的默认动作
          return false;



      },
      getEvaluationData(){
        let data = {
          paperId: this.paperId
        }
        model.getEvaluationDetail (data, ( res => {
          if(res.status == 200) {
             var _this = this;
             this.eData = res.data;
             this.submitNum = res.data.submitNum;
             this.questionArray = res.data.questions;

             //加载模板后执行方法
             this.$nextTick(function () {
               _this.questionArray.forEach(function (item,index) {
                 let options = item.optionStatistics;

                 if(item.type == "SELECT"){
                     let options = item.optionStatistics;
                     options.forEach(function (items,indexs) {
                       _this.pieDataArray[indexs] = {
                         value: items.selectedCounts,
                         name: items.optionContent
                       }
                     })

                   var chartObj = _this.drawLine(index,"myChartPie_","pie",_this.pieDataArray);
                   _this.chartArray.push(chartObj);


                 }else if(item.type == "MUILTSELECT"){

                     options.forEach(function (items,indexs) {
                       _this.barDataArray["name"][indexs] = items.optionContent
                       _this.barDataArray["value"][indexs] = items.selectedCounts
                     })
                     var chartObj = _this.drawLine(index,"myChartBar_","bar",_this.barDataArray);
                     _this.chartArray.push(chartObj);



                 }else if(item.type == "SUBJECTIVE"){
                     _this.barDataArray["name"][index] = "answer"
                     _this.barDataArray["value"][index] = "answer"
                     _this.chartArray.push(_this.barDataArray);
                 }
                })
              })




          } else {
            this.$message.error(res.message);
          }
        }));
      },
      drawLine(index,name,type,data){
        let myChart = echarts.init(document.getElementById(name + index));
         //饼形图
        if(type == "pie"){
            this.pieReport(myChart,data);
        //柱形图
        }else{
            this.barReport(myChart,data);
        }
        return myChart;

      },
      pieReport(myChartPie,data){
          myChartPie.setOption(
          {
            title : {
              subtext: '已提交人数：'+this.submitNum+"人",
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
             // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series : [
              {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
//                data:[
//                  {value:335, name:'直接访问'},
//                  {value:310, name:'邮件营销'},
//                  {value:234, name:'联盟广告'},
//                  {value:135, name:'视频广告'},
//                  {value:1548, name:'搜索引擎'}
//                ],
                data:data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        )
      },
      barReport(myChartBar,dataname){
        myChartBar.setOption(
          {
            title: {
              subtext: '已提交人数：'+this.submitNum+"人",
              x:'left'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: dataname["name"]
            },
            series: [
              {
                name: '人数',
                type: 'bar',
                data: dataname["value"]
              }
            ]
          }
        )
      }
    },

    components: {
      Goback,
      formsSummit,
    }
  }
</script>
<style scoped="" lang="less">
  @import "../../assets/less/clazz";
  @import "../../assets/less/activity.less";
  @import "../../assets/less/icon.less";
  #iframeId{
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
}
  .keyword{
    width: 100%;
    overflow: hidden;
    margin-top:20px;
    margin-left:53px;
    h2{
      float: left;
      font-size: 16px;
      color: #39467F;
    }
    span{
      border-top-right-radius: 30px;
      border-top-left-radius: 30px;
      border-bottom-right-radius: 30px;
      font-size: 14px;
      color: #333333;
      margin-right: 16px;
      padding: 0px 10px;
      cursor: pointer;
    }
  }
  .j-btn-gray{
    background: #999!important;
    cursor:default!important;

  }
  .answer_tit h1{
    color: #000;
    border: none!important;
    box-shadow: none!important;
  }
  .x-view{
    width: 100%!important;
  }
  .discuss-dis{
    .icon-time{
      vertical-align: middle;
    }
  }
  .j-statistc{
    color: #484848;
    font-size: 18px;
    h2{
      height: 74px;
      line-height: 74px;
      border-bottom: 1px solid #e6e6e6;
      text-align: center;
    }
    li{
      padding-left: 41px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e6e6e6;
      h3{
        padding-top: 30px;
        font-size: 20px;
      }
      .pie{
        padding-top: 38px;
        h4{
          color: #999;
          font-weight: normal;
          font-size: 12px;
          padding-left: 160px;
        }
        .left{
          float: left;
          padding-left: 72px;
          padding-right: 90px;
          font-size:12px;
          .table-small th{
            border: 1px solid #dfdfdf;
            padding-left: 6px;
            padding-top: 9px;
            padding-bottom: 9px;
            font-size: 14px;
          }
          .table-small td{
            border: 1px solid #dfdfdf;
            padding-left: 6px;
            padding-top: 9px;
            padding-bottom: 9px;
            font-size: 12px;
          }
        }
        .left-table-dis{
          padding-top: 70px;
          padding-left: 0;
        }
      }
      .li-none{
        border-bottom: none;
      }
      .table-big{
        width: 80%;
        margin:43px 0 0 53px;
      }
      .table-big td ,.table-big th{
        border: 1px solid #dfdfdf;
        padding-left: 6px;
        padding:7px 0 7px 7px;
      }
      .table-big td{
        font-weight: normal!important;
      }
    }

  }

</style>
