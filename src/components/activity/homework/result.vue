<template>
  <div>
    <div class="wrapper answer">
      <!--header_start-面包屑-->
      <div class="bread-box">
        <bread-crumb
          :courseId="courseId"
          :clazzId="clazzId"
          :activityId="activityId"
          :leveHomeDetail="1"
        ></bread-crumb>
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
              <span class="icon-home-time" v-if="detailArray.status =='WAITING' && detailArray.openMode == 'TIMING'"></span>
              <span v-if="detailArray.status =='WAITING' && detailArray.openMode == 'TIMING'" class="endTime">
                开始时间:&nbsp;&nbsp;
                <span>{{detailArray.beginTime}}</span>
              </span>
              <span class="icon-home-time"></span>
              <span v-if="!!detailArray.endTime" class="endTime">
                截止时间:&nbsp;&nbsp;&nbsp;
                <span>{{detailArray.endTime}}</span>
              </span>
              <span v-else class="endTime">截止时间:&nbsp;&nbsp;&nbsp;<span>永久</span></span>
              <span class="set-time" @click="timeSet" v-if="detailArray.status != 'WAITING' && detailArray.operationStatus && detailArray.openMode == 'TIMING'">
                <i class="icon-time-blue"></i>
                时间设置
              </span>
            </li>
            <li>
              <span class="icon-describe"  v-if="detailArray.content != ''"></span>
              <span class="icon-con" v-if="detailArray.content != ''">
                <span class="detailContent" :alt="detailArray.content" :title="detailArray.content">
                  说明：{{detailArray.content | filterContent}}
                </span>
                <a href="javascript:void(0)" class="blue icon-more icon-more-none" style="display: none" @click="moreMethod('detailContent')"> 展开更多<span class="answer-more"></span></a>
                <a href="javascript:void(0)" class="blue icon-s icon-more-none" @click="moreMethodS('detailContent')" style="display: none"> 收起<span class="answer-s"></span></a>
              </span>
              <ul class="clearfix images" >
                <li v-for="(item,index) in pictureList"><img :src="item.transUrl" width="90" height="90" @click="showBigPic(item.url)"/></li>
              </ul>
            </li>
             <!-- 添加作业预览 -->
             <li v-if="publishAttachList.length>0" style="margin-top:-12px">
              <!-- <span> <img src="../../../assets/img/icon/icon-attach.png" alt=""></span>
              <span v-if="uploadimg == '.ppt' || uploadimg == '.pptx'"><img src="../../../assets/img/icon/icon-ppt.png" alt=""></span>
							<span v-else ><img src="../../../assets/img/icon/icon-word2.png" alt=""></span>
              <span @click="viewhomework" class="viewhomework">{{uploadname}}{{uploadformat}}</span>  -->

                <div v-for="(item,index) in publishAttachList" class="j-pad">  
                  <img src="../../../assets/img/icon/icon-attach.png" alt="">  

                  <span>
                    <img src="../../../assets/img/icon/icon-ppt.png" alt="" v-if="item.type == 'PPT'">
                    <img src="../../../assets/img/icon/icon-word2.png" alt="" v-else>
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
    <!--学员问答_start-->
    <div class="answer_tit margin16 round-layout">
      <div class="answer_con">
        <div class="title">
          <span class="icon"></span>学员的作业（<span class="commitCount">{{commitCount}}</span>/<span  class="totalCount">{{totalCount}}</span>）
          <router-link class="icon-home-uncommit ml18"  :to="{ path: '/activity/homework/mansum', query: {clazzId:clazzId, courseId:courseId, activityId: activityId, crumb: crumb, crumb2:'work', nowIndex:1}}">未提交<span>{{unCommitCount}}</span></router-link>
          <router-link class="icon-home-uncommit commitCount ml10"  :to="{ path: '/activity/homework/mansum', query: {clazzId:clazzId, courseId:courseId, activityId: activityId, crumb: crumb, crumb2:'work'}}">已提交<span>{{commitCount}}</span></router-link>
        </div>
        <!-- 没作业的时候显示暂无作业 -->
        <empty
          v-if="nohomework"
          :emptytext="emptytext"
          ></empty>
        <ul class="con"
        v-loading="loadingD"
        :element-loading-text="$globalParam.loadText"
        :element-loading-spinner="$globalParam.loadSpinner"
        :element-loading-background="$globalParam.loadText">
          <li class="clearfix" v-for="(item,index) in homeworkArray">
            <div class="clearfix">
              <div class="image" v-if="!!item.miniAvatar "><img :src="item.miniAvatar"/></div>
              <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
              <div class="text">
                <h2>
                  {{item.userName}}
                  <span class="gray">
                    {{item.createDate}}
                    <a href="javascipt:void(0)" class="icon-home-type" v-if="!!item.scoreLevel">
                        {{item.scoreLevel | filterScore}}
                    </a>
                  </span>
                </h2>
              </div>
            </div>
            <h3>
              <router-link class="title_hover"  :to="{ path: '/activity/homework/detail', query: {clazzId:clazzId, courseId:courseId,activityId:activityId, homeworkId: item.id, crumb: crumb, crumb2:'work'}}">
               {{item.title}}
              </router-link>
            </h3>
            <p v-if="!!item.content" style="color:#999;word-wrap:break-word;  ">{{item.content | filterHomeWorkDetail}}</p>
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
    :dialogSetTimehomework.sync="settime"
    :activityId = "activityId"
    @updateCont = "setNewTime">
    </setTimehomework>
  </div>
</template>
<script>
  import {cutstr} from '@/global/util';
  import model from 'model/activity/homework';
  import breadCrumb from 'components/course/breadcrumb';
  import exportHomework from 'components/activity/homework/export_pop';
  import Modal from 'base/modal/modal'
  import setTimehomework from 'components/activity/discuss/sethomeworktime'
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
      filterContent: function (value) {
        if(!!value){
          if(value.length > 120){
            $(".detailContent").next(".icon-more").show();
            $(".icon-describe").css({"marginTop":"-1px"})
            return cutstr(value,210);
          }else{
            $(".icon-describe").css({"marginTop":"4px"})
            return value;
          }
        }


      },
      filterHomeWorkDetail:function (value) {
         if(!!value){
           return cutstr(value,190);
         }
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
       this.homeworkPage();

    },
    methods:{
      paperKey (activityId) {
				return activityId + "_" + new Date().getTime();
			},
      setNewTime(data) {
        this.detailArray.endTime = data.endTime;
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
        model.getWorkDetail(data, ( res => {
           console.log("getWorkDetail", res)
           if(res.status == 200){

             this.loadingD = false;

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
            this.totalCount = res.data.totalCount;
            this.commitCount = res.data.commitCount;
            this.unCommitCount = parseInt(this.totalCount - this.commitCount);
          }else{
            this.$message.error(res.message)
          }
        }))
      },
      homeworkPage(){
        var data = {
          activityId:this.activityId,
          size:20,
          number:this.cur_page
        }
        model.homeworkPage(data, ( res => {
          if(res.status == 200) {
            // console.log(JSON.stringify(data))
            this.homeworkArray = res.data.content;
            if(this.homeworkArray.length==0){
              this.nohomework=true
            }
            this.totalElements = res.data.totalElements;
          }else{
            this.$message.error(res.message)
          }

        }))
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
      handleCurrentChange(val){
        this.cur_page = val;
        this.homeworkPage();
      },
      open2() {
        this.$message({
          message: '恭喜你，作业发布成功了',
          type: 'success',
        });
      },
      getuploadname(data){
        // console.log(data)
      //      this.filename=data.publishhomeworkAttachmentList[0].name;
      //      this.fileUrl=data.publishhomeworkAttachmentList[0].linkUrl;
      //      this.fileArr=data.publishhomeworkAttachmentList;
      //      this.homeworktype=data.publishhomeworkAttachmentList[0].type;
      //       let num=this.filename.lastIndexOf(".");
						// let suffix=this.filename.substring(num);
      //       let filename=this.filename.substr(0,num);
      //       this.uploadimg=suffix;
      //         if(filename.length<0){
      //            this.uploadname=filename
						// 	}else{
						// 		this.uploadname=filename.substr(0,10)+"..."
						// 	};
      //       this.uploadformat=suffix;
          console.log(data);
          this.publishAttachList = data.publishhomeworkAttachmentList;
      },
      viewhomework(url){
         this.filelog=true;
         this.bigfileUrl=url;
      },
    },

    components: {
      breadCrumb,
      exportHomework,
      Modal,
      setTimehomework,
      Empty
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/less/icon.less";
  @import "../../../assets/less/activity.less";
  @import "../../../assets/reset-element-ui/form.css";
  .set-time {
    font-size: 16px;
    color: #1077D7;
    cursor: pointer;
    >.icon-time-blue {
      margin-left: 20px;
      margin-right: 2px;
      vertical-align: text-bottom;
    }
  }
  .round-layout h1{
    border-bottom: none;
    box-shadow: none;
  }
  .icon-more{
    background: none;
    width: auto;
    height: auto;
  }
  .detailContent{
     display: inline-block;
     margin:2px 0 0 0;
  }
  .endTime{
    display: inline-block;
    position: relative;
    top:1px;
    margin-right: 20px;
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
  }
  .btn-export::after{
    position: absolute;
    right: -6px;
    top: -10px;
    width: 27px;
    height: 15px;
    content: "";
    background: url("../../../assets/img/expert/vipLogo.png") center center no-repeat;
    background-size: 27px 14px;
  }
  .btn-export i{
    vertical-align: middle!important;
  }
  .btn-blue {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    padding: 10px 15px;
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
    color:#1077d7;
  }
  a.title_hover:hover{
    color:#1077d7;
    text-decoration: underline;
  }
  .images img{
     cursor: pointer;
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
}
.icon-describe{
position:absolute;
}
.icon-con{
 left: 28px;
}
.zm {
  color: #717171;
  padding-left: 15px;
}
</style>

