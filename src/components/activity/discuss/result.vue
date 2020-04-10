<template>
  <div>
    <div class="wrapper answer">
      <!--header_start-面包屑-->
        <bread-crumb
          :courseId="courseId"
          :activityId="activityId"
          :clazzId="clazzId"
          :leveDiscuss="1"
        ></bread-crumb>
      <!--问答_start-->
      <div class="answer_tit answer_left_none round-layout">
        <h1>【讨论】&nbsp;{{detailsData.title}}</h1>
        <div class="detail">
          <ul class="discuss-dis">
            <li>
              <span class="icon-describe"></span>
              <span class="icon-con ">
                <span class="detailContent" :alt="detailsData.content" :title="detailsData.content">
                  描述：
                  {{detailsData.content | filterContent}}
                </span>
                &nbsp;<a href="javascript:void(0)" class="blue icon-more icon-more-none" style="display: none" @click="moreMethod('detailContent')"> 展开更多<span class="answer-more"></span></a>
                  <a href="javascript:void(0)" class="blue icon-s icon-more-none" @click="moreMethodS('detailContent')" style="display: none"> 收起<span class="answer-s"></span></a>
              </span>
            </li>
            <li>
              <span class="icon-course" style="vertical-align: top"></span>
              <span class="icon-con">课程:{{detailsData.courseName}}</span>
            </li>
            <li>
              <span class="icon-members"></span>
              <span class="detailName icon-con">
                成员:
                <span v-if="!!userList && userList.length != 0"><span v-for="(item,index) in userList" style="padding-right: 10px;">{{item.name}}</span></span>
                <span v-else>全部成员</span>
              </span>
                <a href="javascript:void(0)" class="blue icon-more " @click="moreMethod('detailName')" style="display: none;"> 展开更多<span class="answer-more"></span></a>
                <a href="javascript:void(0)" class="blue icon-s icon-more-none" @click="moreMethodS('detailName')" style="display: none"> 收起<span class="answer-s"></span></a>
              <ul class="clearfix images" v-if="!!pictureList && pictureList.length != 0" >
                <li v-for="(item,index) in pictureList"><img :src="item.transUrl" width="90" height="90" @click="showBigPic(item.url)"/></li>
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
          <div class="right">
              <span class="btn-green" @click = "exportChatMessage">
                <i class="icon-export-white"></i>内容导出
              </span>
          </div>
          <span class="icon"></span>讨论组聊天内容
        </div>
        <!--详情_start-->
        <ul class="con answer-detail" v-if="!!chatData && chatData.length !=0">
          <li class="clearfix border_none" v-for="(item,index) in chatData">
            <div class="image" v-if="!!item.miniAvatar "><img :src="item.miniAvatar"/></div>
            <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text text-none">
              <h2 class="h2_padnone">{{item.name}}<span class="gray">{{item.optime}}</span></h2>
              <p class="p_border" v-if="!!item.type && item.type == 'txt'"><span class="p_corner"></span>{{item.message}}</p>
              <p class="p_border_img" v-else-if="!!item.type && item.type == 'img'">
                <span class="p_corner"></span>
                <img :src="item.url"/>
              </p>
            </div>
          </li>
        </ul>
        <!--详情_end-->
      </div>
      <!--footer_start-->
      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change ="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="totalElements">
        </el-pagination>
      </div>
      <div class="answer-footer">
        <p>共{{totalElements}}条&nbsp;每页20条</p>
      </div>
      <!--footer_end-->
    </div>
    <!--学员问答_end-->
    <!--学员详情弹出层-->
    <dtail-answer :dialogDtailAnswer.sync="dtailAnswerf"></dtail-answer>
    <!-- 大图弹出框 -->
    <modal :show.sync = "dialogPic" contWidth = '80%' >
      <div slot="body">
        <img id="scheduleShowbigPic" v-if="bigUrl" :src="bigUrl">
        <img id="scheduleShowbigPic" v-else-if="!bigUrl" :src="firstBigUrl" >
      </div>
    </modal>
  </div>
</template>
<script>
  import model from 'model/activity/result';
  import { getToken } from '@/filters/userVerify'
  import {cutstr} from '@/global/util';
  import dtailAnswer from "components/activity/answer/detail";
  import breadCrumb from 'components/course/breadcrumb';
  import Modal from 'base/modal/modal';
  import API from '@/global/resource';
  export default {
    created() {
      this.courseId = this.$route.query.courseId;
      this.activityId = this.$route.query.activityId;
      this.clazzId = this.$route.query.clazzId;
      //详情列表
      this.courseDiscussDetails();
      //未提交/已提交人数
      //聊天内容
      this.courseDiscussChat();
    },
    data(){
      return{
        courseId:"",
        activityId:"",
        clazzId:"",
        dtailAnswerf:false,
        pictureList:[],
        userList:[],
        detailsData:[],
        chatData:[],
        cur_page:1,
        totalElements:0,
        substrVal:"",
        dialogPic: false,   // 查看大图弹出框
        bigUrl: "",       // 大图路径
        firstBigUrl: ""     // 默认第一个大图的
      }
    },
    filters: {
      filterContent: function (value) {
         if(!!value){
           if(value.length > 120){
             $(".detailContent").next(".icon-more").show();
             return cutstr(value,210);
           }else{
             return value;
           }
         }
      }
    },
    methods:{
      exportChatMessage(){
        if(!this.$store.getters.getOrgVipInfo.vip){
          this.$store.state.vipFuncPopFalg = true;
          return;
        }
        if(this.totalElements > 0){
           window.open(API.urls.exportWordChatMessage+"?activityId="+this.activityId+"&token="+getToken());
        }
        
      },
      showBigPic(url) {
        this.bigUrl = url;
        this.dialogPic = true;
      },
      handleCurrentChange(val){
        this.cur_page = val;
        this.courseDiscussChat();
      },
      courseDiscussDetails(){
        let data = {
          activityId:this.$route.query.activityId
        }
        model.courseDiscussDetails(data, ( res => {
          if(res.status == 200) {
            this.detailsData = res.data;
            this.userList = res.data.userList;
            this.pictureList = res.data.pictureList;
          }else{
            this.$message.error(res.message);
          }
        }));
      },
      moreMethod(id){
          $("."+id).html($("."+id).attr("title"));
          $("."+id).next(".icon-more").hide();
          $("."+id).next().next(".icon-s").show();
      },
      moreMethodS(id){
          $("."+id).next().next(".icon-s").hide();
          $("."+id).next(".icon-more").show();
          $("."+id).html(cutstr($("."+id).html(),210));
      },
      courseDiscussChat(){
        let data = {
          activityId:this.$route.query.activityId,
          size:20,
          number:this.cur_page
        }
        model.coursePageChat(data, ( res => {
          if(res.status == 200) {
            this.chatData = res.data.content;
            this.totalElements = res.data.totalElements;
            //导出内容按钮不许点击
            if(this.totalElements == 0){
                $(".btn-green").attr("style","cursor:not-allowed");
            }
          }else{
            this.$message.error(res.message);
          }
        }));
      },
    },
    components: {
      dtailAnswer,
      breadCrumb,
      Modal
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/activity.less";
  @import "../../../assets/reset-element-ui/form.css";
  .round-layout h1{
    box-shadow: none!important;
    border-bottom: none!important;
  }
  .answer-detail li .p_border_img{
    border:1px solid #c0e0e0;
    background: #f5fafa;
    border-radius: 3px;
    padding:15px 12px;
    color: #333;
    line-height: 25px;
    width: auto!important;
    position: relative;
    max-width: 100px;
    max-height:auto;
  }
  .answer-detail li .p_border_img img{
    width: 100%;
    height: 100%;
  }
  .icon-more{
    background: none;
    width: auto;
    height: auto;
  }
  .answer_tit h1{
    font-weight: 500;
    color: #333;
    padding-bottom: 20px!important;
  }
  .discuss-dis{
    padding-left: 10px;
  }
  .discuss-dis{
    .images{
       img{ cursor: pointer;}
    }
  }
   #scheduleShowbigPic {
    width: 100%;
    height: auto; 
    display: block;
    margin: 0 auto;
  }
  .btn-green{
    padding: 10px 20px;
    font-size: 16px;
  }
  .btn-green i{
    vertical-align: middle;
    margin-right: 5px;
  }
</style>