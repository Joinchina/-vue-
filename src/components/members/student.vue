<template>
  <div id="w-table">
      <div class="top mg-b16 clearfix">
        <span class="w-sum">学员：{{totalElements}}人
          </br>
          <span class="remainingStu" @click="toAccountCenter" v-if="!this.noLimit">机构剩余学员数：<em :class="{attention:(leaveUserCount<121)}">{{leaveUserCount}}</em></span>
        </span>
        
        <!--<button class="w-add" type="button" @click = "exportPersonalReport = true">-->
          <!--<i class="icon-circle-add"></i>-->
          <!--导出个人报告-->
        <!--</button>-->
        <!--<button class="w-add w-export" type="button" @click = "exportExcelStudent">-->
          <!--导出-->
          <!--<i class="icon-export"></i>-->
        <!--</button>-->
        <el-dropdown placement="bottom-start" class="right"  @command="dropDownExport">
          <button class="w-add w-export" type="button">
            导出
            <i class="icon-export"></i>
          </button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="student">
              <span class="vipExportLogo"></span>
              导出学员名单
            </el-dropdown-item>
            <el-dropdown-item command="personal">
              <img src="../../assets/img/expert/vipLogo.png" class="vipExportLogo">
              导出个人报告
            </el-dropdown-item>
            <el-dropdown-item command="simpletable">
              <span class="vipExportLogo"></span>
              导出学员简表
            </el-dropdown-item>

            <el-dropdown-item command="message">
              <span class="vipExportLogo"></span>
              删除学员信息
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>

        <button class="w-add w-import" type="button" @click="importStudentHandler" v-if="getRole !== 'PROFESSOR'">
          <i class="icon-import"></i>
          导入学员
        </button>
        <button class="w-add" type="button" @click="addStudent" v-if="getRole !== 'PROFESSOR'">
          <i class="icon-circle-add"></i>
          新增学员
        </button>
        <div class="right">
          <el-select class="jtype" v-model="value" placeholder="使用APP"   @change = "appStatusSearch">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="账号/姓名/手机号" @keyup.13="getStudentList()" /><i class="el-icon-search" @click.stop="getStudentList('search')"></i>
          
        </div>
    </div>
  <el-table class="list"
    :data = "tableData"
    :empty-text="loading_font"
    stripe>
    <el-table-column
      prop="username"
      label="账号"
      fixed="left"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      fixed="left"
      width="150">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      fixed="left"
      width="120">
    </el-table-column>
     <el-table-column
      prop="userIntegral"
      label="积分"
      width="110">
    </el-table-column>

     <el-table-column
      prop="appStatus"
      label="使用APP" width="120">
       
    </el-table-column>
    <el-table-column
      prop="organizationName"
      label="所在机构"
      :show-overflow-tooltip="true"
      width="150">
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="所在项目"
      :show-overflow-tooltip="true"
      width="150">
    </el-table-column>
    <el-table-column
      prop="clazzName"
      label="所在班级"
      :show-overflow-tooltip="true"
      width="150">
    </el-table-column>
    <el-table-column
      label="操作"
      width="180" >
      <template slot-scope="scope">
        <el-button type="text" @click.native="pesonalReportC(scope.$index, scope.row)">个人报告</el-button>
        <el-button type="text" @click.native="handleEdit(scope.$index, scope.row)" v-if = "getRole !== 'PROFESSOR'">编辑</el-button>
        <el-dropdown class="more"  placement="bottom-start"  v-if = "getRole !== 'PROFESSOR'">
						<span class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu class="more-menu" slot="dropdown">
            <el-dropdown-item @click.native="handlePwd(scope.$index, scope.row)">
              <i class="icon-reset"></i>
              密码重置
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleDel(scope.$index, scope.row, tableData)">
              <i class="icon-del"></i>
              删除账号
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column >
  </el-table>
    <p class="page-sum">共{{totalElements}}条 每页20条</p>
    <!-- 创建机构管理员 -->
    <add-class
      :dialogAddClass.sync="addClass"
      :clazzId = "clazzId"
      role = "STUDENT"
      @updateClassUserList="getStudentList"></add-class>

    <!-- 编辑机构管理员 -->
    <edit-class
      :dialogEditClass.sync="editClass"
      :userId = "rowUserId"
      :clazzId = "clazzId"
      role = "STUDENT"
      @updateClassUserList="getStudentList"></edit-class>
    <!--查看个人报告-->
    <personal-report :dialogPersonalReport.sync="personalReport"
                     :userId = "rowUserId"
                     :personalName = "personalName"
                     :personalPlace = "personalPlace"
                     :personalPhoto = "personalPhoto"
    >

    </personal-report>
    <!--导入学员-->
    <import-student :dialogImportStudent.sync="importStudent" :overLimit.sync="overLimit"  :clazzId = "clazzId" @updateClassUserList="getStudentList">

    </import-student>

    <!--导出个人报告-->
    <export-personal-report :dialogExportPreport.sync="exportPersonalReport">

    </export-personal-report>

    <!-- 密码重置 -->
    <pwd-reset
      :dialogPwdReset.sync="pwdShow"
      :userId = "rowUserId"
    ></pwd-reset>

    <!--删除原因-->
    <student-del-reason
    :userId = "rowUserId"
    @delStudent = "getStudentList"
    :dialogDelStudent.sync ="stuDelReason">
      
    </student-del-reason>

    <overLimitPop 
      :overLimitDialog.sync = "overLimit" 
      :text = "'该机构剩余学员数量不足，'+overLimitTip+'失败'" 
      :footerText = "'增加学员数量'" 
      :param="'stuNum'"></overLimitPop>

    <!--分页-->
    <div class="pagination">
      <el-pagination
        :page-size="20"
        :current-page="cur_page"
        @current-change ="handleCurrentChange"
        layout="prev, pager, next"
        :total="totalElements">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import model from 'model/members/members'
  import pwdReset from 'components/user/pwd_reset'
  import addClass from 'components/members/student_create'
  import user from 'model/user/user_manage'
  import editClass from 'components/members/student_edit'
  import personalReport from 'components/members/personal_report'
  import importStudent from 'components/members/student_import'
  import exportPersonalReport from 'components/members/student_export_preport'
  import { getToken } from '@/filters/userVerify'
  import { delTip } from '@/global/open'
  import API from '@/global/resource'
  import { getCurRole } from  '@/filters/userVerify'

  import studentDelReason from 'components/members/student_del_reason'
  import httpRequest from '@/model/orgAccount/index'

  import overLimitPop from "@/base/overLimitPop/index"

  export default {
    data(){
      return {
        tableData:[],
        clazzId:"",
        cur_page: 1,
        totalElements:0,
        searchQuery: "",
        stuDelReason:false,//学员删除原因
        pwdShow: false,		//密码重置弹出框
        rowUserId:"",		// 当前row userid
        addClass: false,		// 添加机构弹出框
        editClass: false,		// 编辑机构弹出框
        personalReport:false, //添加个人报告
        personalName:"",//添加个人报告-名字
        personalPlace:"",//添加个人报告-单位
        personalPhoto:"",//添加个人报告-头像
        importStudent:false, //导入学员
        exportPersonalReport:false,//导出个人报告
        getRole:"",
        app:"",
        options: [{
          value: "",
          label: "全部"
        }, {
          value: "TRUE",
          label: "是"
        }, {
          value: "FALSE",
          label: "否"
        }],
        value: "使用APP",
        loading_font:this.$globalParam.loadText,
        vipInfo : {}, 	// 账号vip信息
        overLimit : false,   // 增加学员超出
        overLimitTip : "新增" ,
        leaveUserCount : "",
        noLimit:true,
      }
    },
    created(){
        this.getRole = getCurRole();
        this.getStudentList();
  
    },
    mounted(){
      // this.vipInfo = this.$store.getters.getOrgVipInfo;
      // let allCount = this.vipInfo.studentCount ? this.vipInfo.studentCount : 0;
      // let useCount = this.vipInfo.useStudentCount ? this.vipInfo.useStudentCount : 0;
      // if(allCount>useCount){
      //   this.leaveUserCount = allCount - useCount;
      // }else {
      //   this.leaveUserCount = 0;
      // }
    },
    methods:{
      appStatusSearch(value){
          this.app = value;
          this.cur_page = 1;
          this.getStudentList();
      },

      handleCurrentChange(val){
          this.cur_page = val;
          this.getStudentList(this.app);
      },
      handlePwd(index,row) {
          this.pwdShow = true;
          this.rowUserId = row.id;
      },
      dropDownExport(value){
          if(value == "student"){
            //导出学员名单
             this.exportExcelStudent();
          }else if(value == 'simpletable'){
             this.exportsimpletable();
          }else if(value == 'personal'){
            //导出个人报告
            if(!this.$store.getters.getOrgVipInfo.vip){
              this.$store.state.vipFuncPopFalg = true;
              return;
            }
            this.exportPersonalReport = true;
          }else{

            //导出学员信息
            this.exportMessage();
          }
      },
      handleEdit(index, row) {
          this.editClass = true;
          this.rowUserId = row.id;
      },

      handleDel(index,row,rows){

          this.stuDelReason = true;
          this.rowUserId = row.id;


      },
      // handleDel(index, row, rows) {
      //   this.rowUserId = row.id;
      //   let str = "确定要删除该账号吗？";
      //   delTip(this, str, this.delUser, index);
      // },
      // delUser(index) {
      //   let _this = this;
      //   let data = {
      //     id: this.rowUserId
      //   }
      //   user.deleteUser(data, ( res => {

      //     if(res.status == 200) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功',
      //         duration: 1000,
      //         onClose() {
      //             _this.tableData.splice(index, 1);
      //             if(_this.tableData.length == 0) {

      //                   let val = _this.cur_page-1;
      //                   _this.cur_page = val;
      //                   _this.getStudentList('page', val);

      //             } else {
      //                     _this.getStudentList();
      //             }
      //         }
      //       });


      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   }));

      // },
      pesonalReportC(index,row){
        this.personalReport = true;
        this.rowUserId = row.id;
        if(!!this.tableData[index]["name"]){
          this.personalName=this.tableData[index]["name"];
        }
        if(!!this.tableData[index]["workPlace"]) {
          this.personalPlace = this.tableData[index]["workPlace"];

        }
        if(!!this.tableData[index]["miniAvatar"]) {
          this.personalPhoto = this.tableData[index]["miniAvatar"];
        }
      },
      getStudentList(type, cur_page){
        this.clazzId = this.$route.query.clazzId;

        var data = {
              keyword:this.searchQuery,
              clazzId:this.clazzId,
              number:cur_page || this.cur_page,
              size:20,
              appStatus:this.app
         }

        if(type == 'search') {
            data.number = 1;
        }
       
        model.getClazzStudentList(data, (res => {
            this.tableData = res.data.content;
            this.loading_font=this.$globalParam.dataEmpty;
            this.tableData.forEach(function(item,index,arr){
                arr[index].appStatus =item.appStatus == 1?"是":"否"
            })
            this.totalElements = res.data.totalElements;
            setTimeout(()=>{this.getVipInfo();},500);
            this.vipInfo = this.$store.getters.getOrgVipInfo;
            
        }))

      },
      //导出学员
      exportExcelStudent(){
        window.open(API.urls.exportExcelStudent+"?clazzId="+this.clazzId+"&token="+getToken());
      },
      //导出简表
      exportsimpletable(){
        window.open(API.urls.exportsimple+"?clazzId="+this.clazzId+"&token="+getToken());
      },

      //导出学员信息
      exportMessage(){
        console.log("导出学员信息");
        console.log(API.urls.studentDeleted);
        window.open(API.urls.studentDeleted+"?clazzId="+this.clazzId+"&token="+getToken());
      },

      //增加学员
      addStudent(){
        if(this.noLimit || this.leaveUserCount >0){
          this.addClass = true;
        }else{
          this.overLimit = true;
        }
        
      },
      importStudentHandler(){
        if(this.noLimit || this.leaveUserCount >0){
          this.importStudent = true;
        }else{
          this.overLimit = true;
        }
      },
      toAccountCenter(){
        this.$router.push({path: "/orgAccount/index",query:{clazzId: this.clazzId}})
      },
      getVipInfo(){
        let data = {}
        let orgId = !!this.$route.query.orgId ? this.$route.query.orgId : localStorage.orgId ? JSON.parse(localStorage.orgId).identification : '';
        let clazzId = !!this.$route.query.clazzId ? this.$route.query.clazzId : '';
        if(Boolean(orgId)){
          data.orgId = orgId;
        }else if(Boolean(clazzId)){
          data.clazzId = clazzId;
        }else{
          return
        }
        httpRequest.getAccountInfo(data,(res)=>{
            if(res.status==200){
                // if(JSON.parse(localStorage.exp_role).data == "ADMIN"){
                //   res.data.vip = true;
                // }
                // store.state.orgVipInfo = res.data;
                this.noLimit = res.data.studentCount == -1;
                let allCount = res.data.studentCount ? res.data.studentCount : 0;
                let useCount = res.data.useStudentCount ? res.data.useStudentCount : 0;
                if(allCount>useCount){
                  this.leaveUserCount = allCount - useCount;
                }else {
                  this.leaveUserCount = 0;
                }
            }else{
                // this.$message.error(res.message);
                if(JSON.parse(localStorage.exp_role).data == "ADMIN"){
                  store.state.orgVipInfo = {vip: true}
                }
            }
        })
      }
    },
    filters:{
      vipInfoFliter :(obj)=>{
        setTimeout(()=>{
          let allCount = obj.studentCount ? obj.studentCount : 0;
          let useCount = obj.useStudentCount ? obj.useStudentCount : 0;
          let value = 0;
          if(allCount>useCount){
            value = allCount - useCount;
          }else {
            value = 0;
          }
          console.log(value)
          return value
        })
      }
    },
    components: {
      pwdReset,
      addClass,
      editClass,
      personalReport,
      importStudent,
      exportPersonalReport,
      studentDelReason,
      overLimitPop
    }
  }
</script>
<style  scoped lang="less">
  @import "../../assets/less/icon.less";
  @import "../../assets/less/btn-search.less";
  @import "../../assets/reset-element-ui/user-table.css";
.el-table__fixed{
    box-shadow: 0 0 10px  rgba(0,0,0,0.2);
}
.el-table__body-wrapper.is-scrolling-left~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right, .el-table__body-wrapper.is-scrolling-right~.el-table__fixed-right {
    -webkit-box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
    box-shadow: 0 0 10px  rgba(0,0,0,0.2);
} 
  #w-table {
    .w-sum {
      display: inline-block;
      margin-top: 8px;
    }
    .remainingStu{
			font-size: 16px;
			color: #FD7E23;
      cursor: pointer;
			.attention{
				color: #CC3300;
			}
		}
    .w-export{
      font-size: 16px;
    }
    .w-export i{
      vertical-align: middle!important;
    }

  }
  .down {
    .icon-reset,.icon-del {
      vertical-align: text-bottom;
      background-size: 90% 90%;
    }

    .el-dropdown-menu__item{
      font-size: 14px;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .jtype {
        float: left;
        width: 105px;
        outline: 0;
        margin-left: 10px;
 }
  .el-dropdown-menu__item{
    .vipExportLogo{
      display: inline-block;
      width: 26px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
</style>
