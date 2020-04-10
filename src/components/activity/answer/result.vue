<template>
<div>
  <div class="wrapper answer">
    <!--header_start-面包屑-->
    <div style="padding-bottom: 10px;">
      全部课程 / 课程详情 / 问答结果
    </div>
    <!--问答_start-->
    <div class="answer_tit answer_left_none round-layout">
       <h1>通话是教育通话是教育</h1>
       <div class="detail">
         <ul>
           <li>
           <span class="icon-describe"></span>
           <span class="icon-con">
             描述：兴华教育中心第一小学弟就华花园youu阿花厺舒适思思是事实覅时候覅时候覅描述：兴华教育中心第一小学弟就华花园youu阿花厺舒适思思是事实覅时候覅时候覅描述：兴华教育中心第一小学弟就华花园youu阿花厺舒适</span>
             <a href="javascript:void(0)" class="blue icon-more"> 展开更多<span class="answer-more"></span></a>
         </li>
           <li>
             <span class="icon-course"></span>
             <span>小学语文课程</span>
             <ul class="clearfix images">
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
               <li><img src="../../../assets/img/activity/example.png" width="90" height="90"/></li>
             </ul>
           </li>
         </ul>

       </div>
    </div>
  </div>
  <!--问答_end-->
  <!--header_end-->
  <!--学员问答_start-->
  <div class="answer_tit margin16 round-layout">
    <div class="answer_con">
      <div class="title">
         <span class="icon"></span>学员的问答
      </div>
      <ul class="con">
        <li class="clearfix">
          <div class="clearfix">
              <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
              <div class="text">
                 <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
              </div>
          </div>
          <h3><a href="javascript:void(0)" class="title_hover" @click="dtailAnswerf = true">信息技术公司</a></h3>
          <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和</p>
          <div class="commonts clearfix">
             <span class="icon-comments"></span>&nbsp;评论(20)
          </div>
        </li>
        <li class="clearfix">
          <div class="clearfix">
            <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text">
              <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
            </div>
          </div>
          <h3><a href="javascript:void(0)" class="title_hover" @click="dtailAnswerf = true">信息技术公司</a></h3>
          <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中</p>
          <div class="commonts clearfix">
            <span class="icon-comments"></span>&nbsp;评论(20)
          </div>
        </li>
        <li class="clearfix">
          <div class="clearfix">
            <div class="image"><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text">
              <h2>张三<span class="gray">2016-11-12 12:33</span></h2>
            </div>
          </div>
          <h3><a href="javascript:void(0)" class="title_hover" @click="dtailAnswerf = true">信息技术公司</a></h3>
          <p>在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中在企业和学校和其他组织中</p>
          <div class="commonts clearfix">
            <span class="icon-comments"></span>&nbsp;评论(20)
          </div>
        </li>
      </ul>
    </div>
    <!--footer_start-->
    <div class="answer-footer">

      <p>共200条&nbsp;每页20条</p>
      <!-- 分页 -->
      <!--<div class="pagination">-->
        <!--<el-pagination-->
          <!--@current-change ="handleCurrentChange"-->
          <!--layout="prev, pager, next"-->
          <!--:total="totalElements">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
    <!--footer_end-->
  </div>
  <!--学员问答_end-->

  <!--学员详情弹出层-->
  <dtail-answer :dialogDtailAnswer.sync="dtailAnswerf"></dtail-answer>
</div>
</template>
<script>
  import model from 'model/activity/result'
  import {cutstr} from '@/global/util';
  import dtailAnswer from "components/activity/answer/detail";
  export default {
    created() {
      this.getQuestionDetail();
    },
    data(){
      return{
        dtailAnswerf:false
      }
    },
    methods:{
      getQuestionDetail(){
         let data = {
           activityId:this.$route.query.activityId
         }
        model.getQuestionDetail(data, ( res => {
          if(res.status == 200) {

              console.log(JSON.stringify(res));
          }
        }));
      }
    },
    components: {
      dtailAnswer
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/activity.less";
  @import "../../../assets/reset-element-ui/form.css";
  @img: "../../../assets/img/icon";

</style>
