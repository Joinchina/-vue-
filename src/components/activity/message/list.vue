<template>
  <div>
    <div>
      <bread-crumb
        :activityId="activityId"
        :courseId="courseId"
        :clazzId="clazzId"
        :leveMessage="1"
        :btnMessage = "1"
      ></bread-crumb>
      <!--<button class="btn-export" type="button" @click="messageExport">-->
        <!--<i class="icon-export-white"></i>-->
        <!--导出留言-->
      <!--</button>-->
    </div>
    <div class="round-layout">
      <h1><span><span style="font-weight: bold">&nbsp;[</span>留言板<span style="font-weight: bold">]</span>&nbsp;本节课留言</span></h1>
      <!--table_start-->
      <div class="messsage">
      <el-table class="list"
          :empty-text = "loadText"
          :data = "tableData"
          stripe
          style="width: 100%">
        <el-table-column
          prop="userName"
          label="账号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="150">
          <template slot-scope="scope" >

              <a href="javascript:void(0)" @click="stuMsgView(scope.$index, scope.row)">{{ scope.row.name }}</a>

          </template>
        </el-table-column>
        <el-table-column
          prop="messageContent"
          label="留言内容" >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="时间" width="200">
        </el-table-column>
        <el-table-column
          label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click.native="detailMethod(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)" class="delete">删除</el-button>
          </template>
        </el-table-column >
      </el-table>
        <div class="footer-page">
           共{{totalElements}}条<span>每页20条</span>
        </div>
      </div>
      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change ="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalElements"
          :page-size="20"
         >
        </el-pagination>
      </div>
      <!--table_end-->
    </div>
    <!--详情弹出框_start-->
    <el-dialog title="留言板详情" :visible.sync="dialogTableVisible" class="dialog-form">
      <div class="answer_con">
        <!--头部_start-->
        <ul class="con con_none">
          <li class="clearfix">
            <div class="clearfix">
              <div class="image" v-if="miniAvatar!=''"><img :src="miniAvatar" width="40" height="40"/></div>
              <div class="image" v-else><img src="../../../assets/img/activity/example2.png"/></div>
              <div class="text">
                <h2>{{name}} {{userName}}<span class="gray">{{createDate}}</span></h2>
              </div>
            </div>
            <div class="answer-detail margin16">
              <p class="icon-con">{{ messageContent }}</p>
            </div>
          </li>
        </ul>
        <!--头部_end-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--详情弹出框_end-->

    <!--查看学员-->
    <stu-msg
      :dialogStuMsg.sync="stuMsgFlag"
      :stuId="identification"
    >

    </stu-msg>
  </div>
</template>
<script>
  import model from 'model/activity/result'
  import { delTip } from '@/global/open'
  import breadCrumb from 'components/course/breadcrumb'
  import stuMsg from 'components/clazz/stumsg'
//  import { getToken } from '@/filters/userVerify'
//  import API from '@/global/resource'
export default {
  data(){
    this.dialogTableVisible = true;
    return{
      courseId:"",
      activityId:"",
      identification:"",
      tableData:[],
      totalElements:0,
      cur_page:1,
      id:"",
      imgSrc:"",
      dialogTableVisible:false,
      stuMsgFlag:false,
      userName:"",
      name:"",
      createDate:"",
      messageContent:"",
      miniAvatar:"",

      loadText:this.$globalParam.loadText
    }

  },
  created(){
     this.getMessageList();
  },
  methods:{
    stuMsgView(index,scope){
      this.identification = scope.userId;
      this.stuMsgFlag = true;
    },
    handleCurrentChange(val){
      this.cur_page = val;
      this.getMessageList();
    },
    delUser(index) {
      let _this = this;
      let data = {
        id: this.id
      }
      model.courseMessageDelete(data, ( res => {
        if(res.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1000,
            onClose() {
              // _this.tableData.splice(index, 1);
              _this.getMessageList();
            }
          });


        } else {
          this.$message.error(res.message);
        }
      }));



    },
    handleEdit(index,row){
      this.id = row.id;
      let str = "确定要删除该留言吗";
      delTip(this, str, this.delUser, index);
    },
    getMessageList:function () {
      if(!!this.$route.query.courseId){
        this.courseId = this.$route.query.courseId;
        this.clazzId = this.$route.query.clazzId;
        var data = {
          courseId:this.courseId,
          number:this.cur_page,
          size:20
        }
        this.courseMes(data);
      }
      if(!!this.$route.query.activityId){
        this.courseId = this.$route.query.courseId;
        this.activityId = this.$route.query.activityId;
        this.clazzId = this.$route.query.clazzId;
        var data = {
          activityId:this.activityId,
          number:this.cur_page,
          size:20
        }
        this.activityMes(data);
      }


    },
    courseMes(data){
      model.courseMessagelist(data, (res => {
        var _this = this;
        if(res.status == 200) {
          this.tableData = res.data.content;
          this.totalElements = res.data.totalElements;

          //暂无数据
          if(this.totalElements == 0){
            this.loadText = this.$globalParam.dataEmpty;
            return;
          }

          _this.activityId = this.tableData[0]["activityId"];

        }else{
          this.$message.error(res.message);
        }
      }))
    },
    activityMes(data){
      model.courseActMessagelist(data, (res => {
        var _this = this;
        if(res.status == 200) {
          this.tableData = res.data.content;
          this.totalElements = res.data.totalElements;

          //暂无数据
          if(this.totalElements == 0){
            this.loadText = this.$globalParam.dataEmpty;
            return;
          }

          _this.activityId = this.tableData[0]["activityId"];
        }else{
          this.$message.error(res.message);
        }
      }))
    },
    detailMethod(index,row){
      this.miniAvatar = "";
      this.dialogTableVisible = true;
      this.userName = row.userName;
      this.name = row.name;
      this.messageContent = row.messageContent;
      this.createDate = row.createDate;
      if(!!row.miniAvatar){
        this.miniAvatar = row.miniAvatar;
      }


    },
    messageExport(){
      let data = {
        activityId:this.activityId
      }
      window.open(API.urls.courseMessageExportExcel+"?activityId="+this.activityId+"&token="+getToken());
    }
  },
  filters:{
      filterFun(val,row){
//          var timeFomate = val.split(",");
//        timeFomate.forEach(function(item,index){
//          console.log(item);
//        })
         // return val;
      }
  },
  components: {
    breadCrumb,
    stuMsg
  }
}
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/activity.less";
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/reset-element-ui/user-table.css";
  @import "../../../assets/less/icon.less";

  .messsage{
    padding:28px 52px 36px 52px;
  }
</style>
