<template>
  <div>
    <!--header_start-面包屑-->
    <bread-crumb
      :courseId="courseId"
      :clazzId="clazzId"
      :activityId="activityId"
      :leveHomeDetailD="1"
    ></bread-crumb>
      <div class="answer_con homework">
        <!--头部_start-->
        <div class="home-tit">
        <ul class="con con_none">
          <li class="clearfix">
            <div class="clearfix">
              <div class="image" v-if="!!detailArray.miniAvatar "><img :src="detailArray.miniAvatar"/></div>
              <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
              <div class="text">
                <h2>
                  {{detailArray.userName}}
                  <span class="gray">{{detailArray.createDate}}
                    <a href="javascipt:void(0)" class="icon-home-type" v-if="scoreLevel!=''">{{scoreLevel | scoreFilter}}</a> </span>
                </h2>
              </div>
            </div>
            <h3>{{detailArray.title}}</h3>
            <div class="answer-detail">
              <p class="icon-con" style="color:#666;word-wrap:break-word;">
                <span class="detailContent" v-if="detailArray.content !=''" :alt="detailArray.content" :title="detailArray.content" >说明：
                  <span >{{detailArray.content}}</span>
                </span>
                <!-- <a href="javascript:void(0)" class="blue icon-more icon-more-none" style="display: none" @click="moreMethod('detailContent')"> 展开更多<span class="answer-more"></span></a>
                <a href="javascript:void(0)" class="blue icon-s icon-more-none" @click="moreMethodS('detailContent')" style="display: none"> 收起<span class="answer-s"></span></a> -->
              </p>
              <ul class="clearfix images">
                <li v-for="(item,index) in pictureList"><img :src="item.transUrl" width="90" height="90" @click="showBigPic(item.url)"/></li>
              </ul>
            </div>
            <!--增加作业附件下载-->
            <div class="j-load" v-if="!!workAttchList && workAttchList.length > 0">
                <h2>附件：{{workAttchTotal}}个</h2>
                <ul class="list" >
                    <li v-for = "(item,index) in workAttchList">
                        <!--图标类型的判断-->
                        <i v-if = "item.type == 'WORD'" class="icon-word2" ></i>
                        <i v-else-if = "item.type == 'PPT'" class="icon-ppt" ></i>
                        <i v-else-if = "item.type == 'VIDEO'" class="icon-video" ></i>
                        <!--名称的展现-->
                        <span v-if = "item.transStatus == 'SUCCESS'">
                          <a href="javascript:void(0)" class="moren" @click="handleView(item)">
                            {{item.name}}
                          </a>
                        </span>
                        <span v-else style="padding-left:10px;">
                           {{item.name}}
                        </span>
                       
                        <!--是否正在转码-->
                        <span class="zm" v-if = "item.transStatus == 'INPROCESS'">转码中...</span>
                        <!--下载-->
                        <a class="icon-load" href="javascript:void(0)" @click = "workAttchdownLoadSingle(item)"></a>
                    </li>
                </ul>
            </div>
          </li>
        </ul>
        </div>
        <!--头部_end-->
        <!--请打分_start-->
        <div class="answer_tit margin16 round-layout">
          <div class="title">
            <span class="icon"></span>请打分
          </div>
          <ul class="mark clearfix">
            <li><a href="javascript:void(0)" class="home-qualify" :class="{'home-unqualify-cur':scoreFlag == 'D'}" @click="markMethod('D')"></a> </li>
            <li><a href="javascript:void(0)" class="home-hege" :class="{'home-hege-cur':scoreFlag == 'C'}" @click="markMethod('C')"></a> </li>
            <li><a href="javascript:void(0)" class="home-good" :class="{'home-goog-cur':scoreFlag == 'B'}" @click="markMethod('B')"></a> </li>
            <li><a href="javascript:void(0)" class="home-youxiu" :class="{'home-youxiu-cur':scoreFlag == 'A'}" @click="markMethod('A')"></a> </li>
          </ul>
        </div>
        <!--请打分_end-->
        <!--详情_start-->
        <div class="answer_tit margin16 round-layout">
          <div class="title">
            <span class="icon"></span>评论<span v-if="commmentTotal != 0">（{{commmentTotal}}）</span>
          </div>
        <ul class="con  answer-detail homework-con">
          <li class="clearfix border_none" v-for="(item,index) in commentArray">
            <div class="image" v-if="!!item.miniAvatar "><img :src="item.miniAvatar"/></div>
            <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
            <div class="text text-w">
              <h2>{{item.userName}}<span class="gray">{{item.createDate}}</span></h2>
              <p>{{item.content}}</p>
            </div>
          </li>
          <div class="h-commonts">
            <h2>你的评论</h2>
            <!--<textarea></textarea>-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item prop="content">
                  <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入评论内容（500字以内）"></el-input>
                </el-form-item>
            </el-form>
          </div>
          <!--<el-button type="primary" @click="submitForm('ruleForm')">发送</el-button>-->
          <div class="home-send">
            <div class="homework-footer clearfix">
              <button  class="homework-commit" @click="submitForm('ruleForm')">发送</button>
            </div>
          </div>
          <div style="clear: both"></div>
        </ul>
           </div>
        <!--详情_end-->
      </div>
      <!-- 大图弹出框 -->
    <modal :show.sync = "dialogPic" contWidth = '80%' >
      <div slot="body">
        <img id="scheduleShowbigPic" v-if="bigUrl" :src="bigUrl">
        <img id="scheduleShowbigPic" v-else-if="!bigUrl" :src="firstBigUrl" >
      </div>
    </modal>
    <!-- 查看视频 -->
    <modal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="transparent" :before-close="videoClose">
      <div slot="body" style="height:100%">
        <video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
        您的浏览器不支持video标签
        </video>
      </div>
    </modal>
    <!-- 查看pdf -->
    <modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="transparent">
      <div slot="body" class="w-transparent" style="height:100%">
        <iframe v-if="details.type==='WORD' || details.type==='PPT'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
        
      </div>
    </modal>
  </div>
</template>
<script>
import { cutstr } from "@/global/util";
import model from "model/activity/homework";
import breadCrumb from "components/course/breadcrumb";
import exportHomework from "components/activity/homework/export_pop";
import Modal from "base/modal/modal";
import API from "@/global/resource";
import { getToken } from "@/filters/userVerify";
export default {
  data() {
    return {
      ruleForm: {
        content: ""
      },
      rules: {
        content: [
          { required: true, message: "请输入评论内容", trigger: "blur" },
          { max: 500, message: "评论不能超过500字" }
        ]
      },
      homeworkId: "",
      datas: {},
      scoreLevel: "",
      scoreFlag:"",
      pictureList: [],
      detailArray: {},
      // commentCheckFlag:false,
      // scoreAddFlag:false,
      scoreStatus: "",
      commentArray: [],
      commmentTotal: 0,
      dialogPic: false, // 查看大图弹出框
      bigUrl: "", // 大图路径
      firstBigUrl: "", // 默认第一个大图的
      workAttchList: [],
      workAttchTotal: 0,
      viewVideoShow: false,
      viewPdfShow: false,
      details: {},
    };
  },
  filters: {
    scoreFilter: function(value) {
      switch (value) {
        case "A":
          return "优秀";
          break;
        case "B":
          return "较好";
          break;
        case "C":
          return "及格";
          break;
        case "D":
          return "不及格";
          break;
        default:
      }
    },
    filterContent: function(value) {
      if (!!value) {
        if (value.length > 120) {
          $(".detailContent")
            .next(".icon-more")
            .show();
          return cutstr(value, 210);
        } else {
          return value;
        }
      }
    }
  },
  created() {
    $("#scoreAdd").hide();
    this.clazzId = this.$route.query.clazzId;
    this.courseId = this.$route.query.courseId;
    this.homeworkId = this.$route.query.homeworkId;
    this.activityId = this.$route.query.activityId;
    //作业提交的详情
    this.studentHomeworkM();
    //作业评论
    this.commentHomeworkM();
    //评论是否显示
    // this.checkedPublishComment();
    //作业附件下载
    this.workAttchMentList();
  },
  methods: {
    workAttchdownLoadSingle(item) {
      let attchId = item.id;
      window.open(
        API.urls.workAttchdownLoadSingle +
          "?id=" +
          attchId +
          "&token=" +
          getToken()
      );
    },
    handleView(item) {
      switch (item.type) {
        case "VIDEO":
          this.viewVideoShow = true;
          this.getCurUrl(item.id);
          break;
        default:
          this.viewPdfShow = true;
          this.getCurUrl(item.id);
      }
    },
    getCurUrl(id) {
      let link;
      let type;
      this.workAttchList.forEach(item => {
        if (item.id == id) {
          link = item.linkUrl;
          type = item.type;
          return false;
        }
      });
      this.details = {
        linkUrl: link,
        type: type
      };
    },
    videoClose() {
      document.getElementById("myVideo").pause();
      this.viewVideoShow = false;
    },
    workAttchMentList() {
      let data = {
        id: this.homeworkId
      };
      model.workAttchMentList(data, res => {
        if (res.status == 200) {
          this.workAttchList = res.data;
          this.workAttchTotal = res.data.length;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    showBigPic(url) {
      this.bigUrl = url;
      this.dialogPic = true;
    },
    // moreMethod(id) {
    //   $("." + id).html($("." + id).attr("title"));
    //   $("." + id)
    //     .next(".icon-more")
    //     .hide();
    //   $("." + id)
    //     .next()
    //     .next(".icon-s")
    //     .show();
    // },
    // moreMethodS(id) {
    //   $("." + id)
    //     .next()
    //     .next(".icon-s")
    //     .hide();
    //   $("." + id)
    //     .next(".icon-more")
    //     .show();
    //   $("." + id).html(cutstr($("." + id).html(), 210));
    // },
    studentHomeworkM() {
      this.datas = {
        id: this.homeworkId
      };
      model.studentHomework(this.datas, res => {
        if (res.status == 200) {
          this.detailArray = res.data;
          this.scoreStatus = res.data.scoreStatus;
          // console.log(res.data);
          // this.courseId = res.data.courseId;
          // this.activityId = res.data.activityId;
          // this.scoreAddFlag = res.data.scoreable;
          if (!!res.data.pictureList) {
            this.pictureList = res.data.pictureList;
          }
          if (!!res.data.scoreLevel) {
            this.scoreLevel = res.data.scoreLevel;
            this.scoreFlag = this.scoreLevel;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    commentHomeworkM() {
      var data = {
        id: this.homeworkId
      };
      model.commentHomework(data, res => {
        if (res.status == 200) {
          this.commentArray = res.data;
          this.commmentTotal = this.commentArray.length;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //打分
    markMethod(score) {
      this.scoreFlag = score;
      var data = {
        id: this.homeworkId,
        scoreLevel: score
      };
      model.markScore(data, res => {
        if (res.status == 200) {
          this.scoreLevel = res.data.scoreLevel;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //评论成功
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var content = this.ruleForm.content;
          var data = {
            homeworkId: this.homeworkId,
            content: content
          };
          model.publishComment(data, res => {
            if (res.status == 200) {
              this.ruleForm.content = "";
              this.commentHomeworkM();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {
    breadCrumb,
    Modal
  }
};
</script>
<style scoped lang="less">
@import "../../../assets/less/activity.less";
@import "../../../assets/reset-element-ui/form.css";
@import "../../../assets/less/icon.less";
a.icon-home-type {
  padding: 3px 12px;
  color: #737373;
  border-radius: 2px;
  margin-left: 8px;
  display: inline-block;
  border: 1px solid #a5a5a5;
}
.home-tit {
  background: #fff;
  padding: 15px 0 0 0;
}
.home-score li {
  float: left;
  border: 1px dashed #d6d6d6;
}
.home-send {
  width: 75%;
}
.icon-more {
  background: none;
  width: auto;
  height: auto;
}
#scheduleShowbigPic {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.answer-detail {
  .images {
    img {
      cursor: pointer;
    }
  }
}
.j-load {
  margin-top: 10px;
  margin-right: 20px;
  border-top: 1px dashed #e1e1e1;
  padding-top: 20px;
  h2 {
    line-height: 25px;
    font-size: 16px;
    font-weight: 400;
    .all {
      padding-left: 40px;
      color: #333;
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
      &:hover {
        color: #0077ff;
        text-decoration: underline;
      }
    }
  }
  .list {
    margin-top: 10px;
    i {
      vertical-align: middle;
      display: inline-block;
      margin-right: 5px;
    }
    li {
      padding-top: 18px !important;
      padding-bottom: 10px;
      padding-left: 0 !important;
      border-bottom: none !important;
      a.moren {
        display: inline-block;
        padding-left: 10px;
        color: #333;
      }
      .zm {
        color: #717171;
        padding-left: 15px;
      }
      a.moren:hover {
        color: #0077ff;
        text-decoration: underline;
      }
    }
  }
  .icon-load {
    display: inline-block;
    width: 15px;
    height: 20px;
    background: url("../../../assets/img/icon/icon-load.png") center center
      no-repeat;
    cursor: pointer;
    margin-left: 10px;
    background-size: 100% 100%;
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>