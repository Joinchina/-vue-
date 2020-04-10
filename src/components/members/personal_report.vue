<template>
  <div id="waddProfessor">
    <el-dialog
      class="dialog-form"
      title="个人报告"
      :visible.sync="dialogPersonalReport" :before-close="close">
      <!--header_start-->
      <div class="personal-header">
         <li v-if = "personalPhoto != ''"><img :src="personalPhoto"/></li>
         <li><span class="blue">{{personalName}}</span></li>
        <li>{{personalPlace}}</li>
      </div>
      <!--head_end-->
      <!--content_start-->
      <div class="personal-con">
        <ul>
          <li>
            签到次数：<span class="gray pad_left12">{{reportData.signCount}}次</span>
            <span class="pad_left36">未签到次数：</span><span class="gray pad_left12">{{reportData.notSignCount}}次</span>
            <span class="pad_left36">请假次数：</span><span class="gray pad_left12">{{reportData.absenceCount}}次</span>
            <span class="pad_left36">代签次数：</span><span class="gray pad_left12">{{reportData.agentSignCount}}次</span>
          </li>
          <li>
            同学圈中发贴数量：<span class="gray pad_left12">{{reportData.topicCount}}条</span>
            <span class="pad_left36">评论数量</span>
            <span class="gray pad_left12">{{reportData.topicCommentCount}}条</span>
            <span class="pad_left36">点赞数量</span>
            <span class="gray pad_left12">{{reportData.likeCount}}条</span>
            <span class="pad_left36">收藏数量</span>
            <span class="gray pad_left12">{{reportData.collectCount}}条</span>
          </li>
          <li>讨论组中累计发言数量：<span class="gray pad_left12">{{reportData.discussCount}}条</span></li>
          <li>
            作业完成数量：<span class="gray pad_left12">{{reportData.homeworkCount + reportData.reviewHomeworkFinishedCount}}份</span>
            <span class="pad_left36">优秀作业数量：</span><span class="gray pad_left12">{{reportData.excellentHomeworkCount + reportData.excellentReviewHomeworkCount}}份</span>
          </li>
          <li>评价提交数量：<span class="gray pad_left12">{{reportData.evaluationCount}}份</span></li>
          <li>反思提交数量：<span class="gray pad_left12">{{reportData.introspectionCount}}份</span></li>
          <li>参与调查：<span class="gray pad_left12">{{reportData.questionnaireCount}}个</span></li>
          <li>参与投票：<span class="gray pad_left12">{{reportData.voteCount}}个</span></li>
          <li>课程留言数量<span class="gray pad_left12">{{reportData.leaveMessageCount}}条</span></li>
          <li>照片墙发照片数量：<span class="gray pad_left12">{{reportData.photowallCount}}条</span></li>
        </ul>
      </div>
      <!--content_end-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click = "exportReport" class="btn-green" style="display:inline-block">导出报告</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>
<script>
  import model from 'model/members/members'
  import { getToken } from '@/filters/userVerify';
  import API from '@/global/resource'
export default {
  props:["dialogPersonalReport","userId","personalName","personalPlace","personalPhoto"],
  created(){
  },
  data(){
     return {
        reportData:[],
     }
  },
  watch:{
    userId:"getUser"
  },
  computed:{
      // id:function () {
      //     return this.userId;
      // }
      clazzId() {
        return this.$route.query.clazzId;
      }
  },
  methods:{
    close(){
      this.$emit('update:dialogPersonalReport', false);
    },
    getUser() {
      var data = {
        userId:this.userId,
        clazzId: this.clazzId
      }
      model.getUserStatistics(data, ( res => {
          if(res.status == 200){
            this.reportData = res.data;
          }else{
            this.$message.error(res.message);
          }

      }))
    },
    exportReport() {
      if(!this.$store.getters.getOrgVipInfo.vip){
          this.$store.state.vipFuncPopFalg = true;
          return;
      }
      window.open(API.urls.exportWordUserStatistics+"?clazzId="+this.clazzId+"&userId="+this.userId+"&token="+getToken());
    }

  }

}
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/form.css";
  #waddProfessor {
    h2 {
      font-size: 18px;
      color: #333;
      margin-left: 5%;
      margin-bottom: 20px;
    }
    .personal-header {
       padding: 0 0 10px 0;
      text-align: center;
      font-size: 16px;
    }
    .personal-header li{
      padding:0 0 10px 0;
      margin:0;
      list-style: none;
    }

    .personal-header li img{
       border-radius: 50%;
      width: 50px;
      height: 50px;
    }

    .personal-con {
       padding: 0 25px;
      font-size: 12px;
    }
    .personal-con li{
      line-height: 30px;
      color:#333;
      font-size:16px;
      margin:0 0 13px 0;
    }
    .personal-con .gray{
      font-size: 14px;
      color: #999;
    }
    .personal-con .pad_left12{
      padding-left: 12px;
    }
    .personal-con .pad_left36{
      padding-left: 36px;
    }
    .personal-con .pad_left16{
      padding-left: 16px;
    }
  }
</style>
