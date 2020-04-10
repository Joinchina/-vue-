<template>
  <div class="mutualDetailBox">
    <div class="wrapper answer">
      <!--header_start-面包屑-->
      <div class="bread-box">
        <Goback :passtitle="passtitle"></Goback>
        <div class="add-clazz1">
          <router-link :to="{ path: '/activity/homework/homeworkview/', query:{activityId:activityId, paperKey:paperKey(homeworkid)}}" class="btn-blue" target="_blank" v-show="commitCount">
            <i class="icon-full-white"></i>
            大屏幕
          </router-link>
          <button v-if = "commitCount"  type="button" class="btn-export" @click="exportHomeWork = true">
            <i class="icon-export-white"></i>
             导出学员作业
          </button>
          <button v-else class="btn-export" style="cursor:not-allowed">
              <i class="icon-export-white"></i>
              导出学员作业
          </button>
        </div>
      </div>
      <!--问答_start-->
      <div class="answer_tit answer_left_none round-layout" 
      v-loading="loadingD"
      :element-loading-text="$globalParam.loadText"
      :element-loading-spinner="$globalParam.loadSpinner"
      :element-loading-background="$globalParam.loadText">
        <h1>{{detailArray.title}}</h1>
        <div class="detail">
          <ul>
            <li >
              <span class="icon-home-time" v-if="detailArray.status == 'WAITING'"></span>
              <span class="endTime" v-if="detailArray.status == 'WAITING'">
                作业开始时间:&nbsp;
                <span>{{detailArray.beginTime}}</span>
              </span>
              <span class="icon-home-time"></span>
              <span class="endTime">
                作业提交截止时间:&nbsp;
                <span>{{detailArray.endTime}}</span>
              </span>
              <span class="icon-home-time"></span>
              <span class="endTime">
                评阅截止时间:&nbsp;
                <span>{{detailArray.reviewHomeWorkEndTime}}</span>
              </span>
              <span class="set-time" @click="timeSet" v-if="detailArray.status != 'WAITING' && detailArray.operationStatus && detailArray.openMode == 'TIMING'">
                <i class="icon-time-blue"></i>
                时间设置
              </span>
            </li>
            <li>
              
              <span class="icon-con" v-if="detailArray.content != ''||true">
                <span :class="{detailContent:true, notClip:textPShow&&showMore}" :alt="detailArray.content" ref="detailContentRef" :title="detailArray.content">
                    <span class="icon-describe"  v-if="detailArray.content != ''||true"></span>
                    {{detailArray.content}}
                </span>
              </span>
              <span round :class="{'showMore':showMore,'packUp':!showMore}" @click="showToogle" v-if="textPShow">{{showMore?"展示更多":"收起"}}<span class="answer-more"></span></span>
            </li>
            <li>
                <ul class="clearfix images">
                    <li v-for="(item,index) in pictureList" :key="index"><img :src="item.transUrl" width="90" height="90" @click="showBigPic(item.url)"/></li>
                </ul>
            </li>
             <!-- 添加作业预览 -->
             <li v-if="publishAttachList.length>0">
                <div v-for="(item,index) in publishAttachList" class="j-pad" :key="index">  
                  <img src="../../assets/img/icon/icon-attach.png" alt="">  

                  <span>
                    <img src="../../assets/img/icon/icon-ppt.png" alt="" v-if="item.type == 'PPT'">
                    <img src="../../assets/img/icon/icon-video.png" alt="" v-else-if="item.type == 'VIDEO'">
                    <img src="../../assets/img/icon/icon-word2.png" alt="" v-else>
                  </span>

                   <span @click="viewhomework(item.linkUrl)" class="viewhomework" v-if = "item.transStatus == 'SUCCESS'">{{item.name}}</span>
                   <span v-if = "item.transStatus == 'INPROCESS'">{{item.name}}</span>

                    <span class="zm" v-if = "item.transStatus == 'INPROCESS'">转码中...</span>
                    <span class="zm" v-if = "item.transStatus == 'FAILURE'">转码失败</span>
                </div>       
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
            <span class="icon"></span>已提交的作业（<span class="commitCount">{{commitCount}}</span>/<span  class="totalCount">{{totalCount}}</span>）
            <router-link class="icon-home-uncommit ml18"  :to="{ path: '/clazz/mutualPeoples', query: {clazzId:clazzId, courseId:courseId, activityId: activityId, nowIndex:'second',count:unCommitCount+';'+unReview+';'+finishCount}}">未提交<span>{{unCommitCount}}</span></router-link>
            <router-link class="icon-home-uncommit commitCount ml10"  :to="{ path: '/clazz/mutualPeoples', query: {clazzId:clazzId, courseId:courseId, activityId: activityId, nowIndex:'third',count:unCommitCount+';'+unReview+';'+finishCount}}">未评阅<span>{{unReview}}</span></router-link>
            <router-link class="icon-home-uncommit commitCount ml10"  :to="{ path: '/clazz/mutualPeoples', query: {clazzId:clazzId, courseId:courseId, activityId: activityId, nowIndex:'first',count:unCommitCount+';'+unReview+';'+finishCount}}">已完成<span>{{finishCount}}</span></router-link>
            <div class="sortBox" v-if="detailArray.status=='END'||detailArray.status=='REVIEWING'">
                <span>排序：</span>
                <el-select v-model="sortValue" placeholder="请选择" icon="el-icon-caret-bottom" @change="mutualworkPage">
                    <el-option label="按提交时间" value="commitTime"></el-option>
                    <el-option label="按评分" value="score"></el-option>
                </el-select>
            </div>
        </div>
        <!-- 没作业的时候显示暂无作业 -->
        <empty
          v-if="nohomework&&loadingD==false"
          :emptytext="emptytext"
          ></empty>
        <ul class="con"
        v-loading="loadingD"
        :element-loading-text="$globalParam.loadText"
        :element-loading-spinner="$globalParam.loadSpinner"
        :element-loading-background="$globalParam.loadText">
          <li class="clearfix" v-for="(item,index) in homeworkArray" :key="index">
            <div class="clearfix">
              <div class="image" v-if="!!item.miniAvatar"><img :src="item.miniAvatar"/><i :class="{rank:true,rankOne:item.rank==1,rankTwo:item.rank==2,rankThree:item.rank==3}" v-if="!!item.rank&&detailArray.status == 'END'">No.{{item.rank}}</i></div>
              <div class="image" v-else><img src="../../assets/img/activity/example2.png"/><i :class="{rank:true,rankOne:item.rank==1,rankTwo:item.rank==2,rankThree:item.rank==3}" v-if="!!item.rank&&detailArray.status == 'END'">No.{{item.rank}}</i></div>
              <div class="text">
                <h2>
                  {{item.userName}}
                  <span class="rankScore">{{item.score|fixTwo}}</span>
                  <span class="notReview" v-if="!!item.managerReviewScoreStatus">待评阅</span>
                  <span class="gray" v-if="detailArray.status=='END'">
                    <a href="javascipt:void(0)" :class="{'icon-home-type':true,excellent:item.scoreLevel=='A',good:item.scoreLevel=='B',qualified:item.scoreLevel=='C'}" v-if="!!item.scoreLevel">
                        {{item.scoreLevel | filterScore}}
                    </a>
                  </span>
                </h2>
              </div>
              <span class="gray timeRight">{{item.createDate}}</span>
            </div>
            <h3>
              <router-link class="title_hover"  :to="{ path: '/clazz/studentMutualDetail', query: {clazzId:clazzId, courseId:courseId,activityId:activityId, homeworkId: item.id}}">
               {{item.title}}
              </router-link>
            </h3>
            <p v-if="!!item.content" style="color:#999;word-wrap:break-word;  ">{{item.content | filterHomeWorkDetail}}</p>
            <div class="reviewPeoples" v-if="!!item.reviewUserList&&item.reviewUserList.length>0">
                <i class="el-icon-star-on"></i>
                <span v-for="(user,keyIndex) in item.reviewUserList" :key="keyIndex">{{user.reviewUserName+'（'+(user.isReview?'已评':'未评')+'）'+(keyIndex!=item.reviewUserList.length-1?'、':"")}}</span>
            </div>
            <div class="commonts clearfix">
              <!--附件-->
              <span style="padding-right:10px;">
                <span v-if = "!!item.attachmentCount && item.attachmentCount == 0"><span class="icon-attach"></span>&nbsp;附件(0)</span>
                <span v-else>
                  <span class="icon-attach"></span>&nbsp;
                  附件({{item.attachmentCount}})
                </span>
              </span>
              


               <!--评论-->
              <span v-if="!!item.commentCount">
                <span class="icon-comments"></span>&nbsp;
                评论({{item.commentCount}})
              </span>
              <span v-else><span class="icon-comments"></span>&nbsp;评论(0)</span>

              
            </div>
          </li>
        </ul>
      </div>
      <!--footer_start-->

      <div class="answer-footer">

        <p>共{{totalElements}}条&nbsp;每页20条</p>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
          @current-change ="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalElements"
          :page-size="20">
          </el-pagination>
        </div>
      </div>
      <!--footer_end-->
    </div>
    <!--学员问答_end-->
    <!--导出学员作业-->
    <export-homework
      :dialogExport.sync = "exportHomeWork"
      :activityId = "activityId"
    ></export-homework>

    <!-- 大图弹出框 -->
    <Modal :show.sync = "dialogPic" contWidth = '80%' >
      <div slot="body">
        <img id="scheduleShowbigPic" v-if="bigUrl" :src="bigUrl">
        <img id="scheduleShowbigPic" v-else-if="!bigUrl" :src="firstBigUrl" >
      </div>
    </Modal>

    <!-- 作业附件 -->
    <!-- 查看pdf -->
		<Modal :show.sync = "filelog" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%;height:100%">        
				<iframe :src="bigfileUrl" id="iframepdf" frameborder="0" width="100%" height="100%"></iframe>			
      </div>
		</Modal>
    
    <!-- 进行中的作业设置时间 -->
    <setTimehomework
    :dialogSetTimeMutual.sync="settime"
    :activityId = "activityId"
    @updateCont = "setNewTime">
    </setTimehomework>
  </div>
</template>
<script>
  import {cutstr} from '@/global/util';
  import model from 'model/activity/mutual';
  import Goback from 'base/goback/goback'
  import exportHomework from 'components/activity/homework/export_pop';
  import Modal from 'base/modal/modal'
  import setTimehomework from 'components/clazz/ecitMutualEndTime'
  import Empty from 'base/empty/empty-white'
  export default {
    data(){
      return{
        courseId:"",
        clazzId:"",
        activityId:"",

        exportHomeWork:false,
        cur_page:1,
        totalElements:0,
        totalCount:0,
        commitCount:0,
        unCommitCount:0,
        finishCount: 0,
        unReview:0,
        detailArray:{},
        homeworkArray:[],
        dialogPic: false,   // 查看大图弹出框
        bigUrl:"",        // 大图路径
        firstBigUrl: "", // 默认第一个大图的
        pictureList:[],
        open:false,
        // uploadformat:".doc",
        // uploadname:"我是最多上传的十个字",
        // filename:"",
        // fileUrl:"",
        bigfileUrl:"",
        filelog:false,
        //fileArr:[],
        //homeworktype:"",
        //uploadimg:"",

        //获取附件集合
        publishAttachList:[],

        loadingD:true,

        settime:false, //起止时间设置
        homeworkid:"",
        passtitle:"学员互评作业",
        showMore:true,
        sortValue:'commitTime',//排序value
        textPShow:true,
        emptytext: '暂无人员提交作业~',
        nohomework:false,
      }
    },
    computed: {
      crumb () {
          return this.$route.query.crumb;
      },

    },
    filters:{
      filterScore(value){
          if(value == "A"){
            return "优秀";
          }else if(value == "B"){
            return "较好";
          }else if(value == "C"){
            return "及格";
          }else{
            return "不及格";
          }
      },
      filterHomeWorkDetail:function (value) {
         if(!!value){
           return cutstr(value,190);
         }
      },
      fixTwo(score){
        let text ='';
        if(!score){
          text="未评分"
        }else if(~~score==score){
          text="总得分"+ score+'.00'
        }else{
          text="总得分"+ score.toFixed(2);
        }
        return text
      }
    },
    
    created(){
      this.activityId = this.$route.query.activityId;
      this.clazzId = this.$route.query.clazzId;
      this.courseId = this.$route.query.courseId;
      this.open = this.$route.query.open;
      //详情
      this.getWorkDetail();
      //未提交、已提交人数；
      this.getWorkTotal();
      //学员提交作业
      this.mutualworkPage();
      window.scrollTo(0,0)
    },
    methods:{
        paperKey (activityId) {
          return activityId + "_" + new Date().getTime();
        },
        setNewTime(data) {
            this.detailArray.endTime = data.endTime;
            this.detailArray.reviewHomeWorkEndTime = data.reviewHomeWorkEndTime;
        },
        timeSet(){
            this.settime = true;
        },
        showBigPic(url) {
            this.bigUrl = url;
            this.dialogPic = true;
        },
        getWorkDetail(){
            var data = {
              activityId:this.activityId
            }
            model.activityDetail(data, ( res => {
                if(res.status == 200){

                    

                    this.detailArray  = res.data;
                    this.pictureList = res.data.pictureList;
                    this.homeworkid=res.data.id;
                    if(this.open == true){
                        this.open2();
                        this.open=false
                    };
                    if(res.data.publishhomeworkAttachmentList.length>0){
                        this.getuploadname(res.data)
                    }
                    setTimeout(()=>{
                        this.loadingD = false;
                        let textP = this.$refs.detailContentRef;
                        this.textPShow=textP.scrollHeight-textP.clientHeight>10;
                    },700)
                }else{

                    this.loadingD = false;

                    this.$message.error(res.message);
                }

            }))
        },
        getWorkTotal(){
          var data = {
            activityId:this.activityId
          }
          model.workTotal(data, ( res => {
            // console.log(data)
            if(res.status == 200) {
                this.totalCount = res.data.totalCount;  //总数
                this.commitCount = res.data.commitCount;    //提交数
                this.finishCount = res.data.finishCount;    //已完成数
                this.unReview = res.data.unReviewCount; //未评阅的
                this.unCommitCount = parseInt(this.totalCount - this.commitCount);
            }else{
                this.$message.error(res.message)
            }
          }))
        },
        mutualworkPage(){
            var data = {
              activityId:this.activityId,
              keyword: this.sortValue,
              size:20,
              number:this.cur_page
            }
            model.mutualworkPage(data, ( res => {
            if(res.status == 200) {
                // console.log(JSON.stringify(data))
                this.homeworkArray = res.data.content;
                this.totalElements = res.data.totalElements;
                if(this.homeworkArray.length==0){
                  this.nohomework=true
                }
            }else{
                this.$message.error(res.message)
            }

            }))
        },
        handleCurrentChange(val){
            this.cur_page = val;
            this.mutualworkPage();
        },
        open2() {
            this.$message({
            message: '恭喜你，作业发布成功了',
            type: 'success',
            });
        },
        getuploadname(data){
            this.publishAttachList = data.publishhomeworkAttachmentList;
        },
        viewhomework(url){
            this.filelog=true;
            this.bigfileUrl=url;
        },
        //展示更多切换
        showToogle(){
            this.showMore=!this.showMore
        },
        //排序change
        sortChange(){
            console.log(this.sortValue)
        }
    },
    components: {
      Goback,
      exportHomework,
      Modal,
      setTimehomework,
      Empty
    }
  }
</script>
<style scoped lang="less">
    @import "../../assets/less/icon.less";
    @import "../../assets/less/activity.less";
    @import "../../assets/reset-element-ui/form.css";
    .mutualDetailBox{
      font-family: "PingFangSC";
    }
    .set-time {
        font-size: 16px;
        color: #1077D7;
        cursor: pointer;
        >.icon-time-blue {
          margin-left: 20px;
          margin-right: 2px;
          vertical-align: top!important;
          margin-top: 6px;
        }
    }
    .round-layout h1{
        border-bottom: none;
        box-shadow: none;
        .noReview{
          padding: 0px 8px;
          display: inline-block;
          font-size: 14px;
          vertical-align: middle;
          border-radius: 4px;
          margin-left: 10px;
          border: 1px solid #FD7866;
          color: #F96D5A;
        }
    }
    .icon-more{
        background: none;
        width: auto;
        height: auto;
    }
    .detailContent{
        display: inline-block;
        margin:2px 0 0 0;
        line-height: 20px;
        font-family:"PingFangSC";
        padding-left: 56px;
        margin-left: -30px;
        text-indent: -26px;
    }
    .notClip{
        position: relative; line-height: 20px; max-height: 40px;overflow: hidden;
    }
    .notClip:after{
        content: "..."; position: absolute; bottom: 0; right: 0px; padding-left: 50px;
        background: -webkit-linear-gradient(left, transparent, #fff 80%);
        background: -o-linear-gradient(right, transparent, #fff 70%);
        background: -moz-linear-gradient(right, transparent, #fff 65%);
        background: linear-gradient(to right, transparent, #fff 70%);
    }
    .endTime{
        display: inline-block;
        position: relative;
        top:1px;
        margin-right: 30px;
        font-size: 16px;
    }
    .bread-box {
        position: relative;
        .add-clazz1 {
            display: inline-block;
            position: absolute;
            top: 0;
            right: 0;

        }
        }
    .btn-export{
        float: right;
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        background: #35a69d;
        border-radius: 6px;
        border: 0;
        cursor:pointer;
        margin-left:12px;
        position: relative;
    }
    .btn-export::after{
        position: absolute;
        right: -6px;
        top: -10px;
        width: 27px;
        height: 15px;
        content: "";
        background: url("../../assets/img/expert/vipLogo.png") center center no-repeat;
        background-size: 27px 14px;
    }
    .btn-export i,.btn-blue i{
        vertical-align: middle!important;
    }
    .btn-blue {
        display: inline-block;
        font-size: 16px;
        color: #fff;
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        margin-right: 15px;
    }
    .commonts .icon-attach{
        vertical-align: middle!important;
    }
    .add-clazz1{
        padding:0!important;

    }
    .add-clazz1, .w-add, .btn-export, .btn-full{
        margin-left:0!important;
    }
    a.title_hover{
        color:#333333;
    }
    a.title_hover:hover{
        color:#1077d7;
        text-decoration: underline;
    }
    .images img{
        cursor: pointer;
    }
    .answer_tit .detail .images{
      padding: 0px 0 0 21px;
    }
    .image{
        position: relative;
        .rank{
            position: absolute;
            bottom: -6px;
            left: 0;
            font-size: 12px;
            color: #fff;
            width: 40px;
            height: 14px;
            text-align: center;
            background: #7687A7;
            border-radius: 14px;
            line-height: 14px;
        }
        .rank.rankOne{
            background: #FAA115;
        }
        .rank.rankTwo{
            background: #6A8A89;
        }
        .rank.rankThree{
            background: #E49B54;
        }
    }
    .j-pad{
        padding-bottom: 10px;
    }
        #scheduleShowbigPic {
        width: 100%;
        height: auto; 
        display: block;
        margin: 0 auto;
    }
    .viewhomework{
        cursor: pointer;
        text-decoration: underline;
	      color: #409eff;
    }


    .zm {
        color: #717171;
        padding-left: 15px;
    }
    .showMore,.packUp{
        cursor: pointer;
        color: #399EFE;
    }
    .answer-more{
        background: url("../../assets/img/icon/icon-more-t.png") no-repeat;
        width: 13px;
        height: 13px;
        display: inline-block;
        vertical-align: middle;
        transition: all .3s linear;
    }
    .packUp{
        .answer-more{
            transform: rotate(180deg);
        }
        
    }
    .answer_tit{
      margin-top: 10px;
    }
    .answer_tit .detail li{
        position: relative;
        &:last-child{
          padding-bottom: 0;
        }
    }
    .totalCount{
        font-size: 18px;
        color: #666;
    }
    a.icon-home-uncommit{
        padding: 6px  20px;
        font-size: 14px;
        color: #666666;
        line-height: 17px;
        font-family: "PingFangSC" !important;
        span{
            font-size: 16px;
            color: #CE3200;
        }  
    }
    .answer_con .con li .text h2 span{
        display: inline;
    }
    .answer_con .con li .text .notReview{
      border: 1px solid #FCC6BD;
      padding: 0px 6px;
      color: #F96D5A;
      display: inline-block;
      border-radius: 4px;
      font-size: 12px;
      vertical-align: middle;
    }
    .answer_con .con li .text h2{
        color: #333333;
        .rankScore{
            margin-left: 5px;
            text-indent: 6px;
            font-size: 16px;
            color: #51607C;
            border-left: 1px solid #CCCCCC;
            display: inline-block;
            padding: 0 0;
            height: 15px;
            line-height: 16px;
        }
    }
    .answer_con .con li .timeRight{
        float: right;
        font-size: 16px;
        color: #999999;
        margin-top: 16px;
        margin-right: 28px;
    }
    .answer_con .con li .image{
        margin-top: 10px;
    }
    .reviewPeoples{
        margin-top: 10px;
        font-size: 16px;
        color: #283853;
    }
    .answer_tit .icon-home-time,.set-time > .icon-time-blue{
      vertical-align: middle;
    }
    .answer_con .con li a.excellent{
        border-color: #FD7866;
        color: #F96D5A;
    }
    .answer_con .con li a.good{
        border-color: #B7ECD8;
        color: #1AB974;
    }
    .answer_con .con li a.qualified{
        border-color: #C2D4FA;
        color: #5786EE;
    }
</style>
<style lang="less">
    .sortBox{
        float: right;
        margin-right: 28px;
        span{
            font-size: 16px;
            color: #333333;
        }
        .el-select{
            width: 140px;
        }
    }
    .answer_con .con li a.icon-home-type{
        cursor: default;
        padding: 2px 8px;
    }
</style>


