<template>
  <div class="j-group-detail">
    <!--面包屑-->
    <Goback :passtitle="passtitle"></Goback>
    <!--头部-->
    <div class="round-layout">
       <div class="title clearfix">
          <div class="left">
            <div class="img"  v-if="!!imageUrl" >
              <img :src="imageUrl" id="avatarProfessor" class="avatar">
            </div>
            <div v-else class="img">
              <img src="../../../assets/img/clazz/group-pic.png"/>
            </div>
            <label for="file" class="sel2 choose" v-show="isVisible">选择图片</label>
            <input class="sel1" id="file"  type="file" name="ruleAddProfessor.photo" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">
          </div>
          <div class="right">
            <!--<p>-->
              <!--组名：<span>小学语文第一组444</span>-->
            <!--</p>-->
            <!--<p>-->
              <!--空号：<span>无</span>-->
            <!--</p>-->
            <!--<p>-->
              <!--组长：<span>未指定</span>-->
            <!--</p>-->
            <el-form :model="ruleEditGroup" :rules="rules" ref="ruleEditGroup" class="j-group-slogan">
              <el-form-item label="组名：" :label-width="labelWidth" prop="name">
                <span v-show="isTextVisible">{{ruleEditGroup.name}}</span>
                <el-input v-show="isVisible" v-model.trim="ruleEditGroup.name" placeholder="" auto-complete="off" ></el-input>
              </el-form-item>
              <el-form-item label="口号：" :label-width="labelWidth" prop="slogan">
                <el-input v-show="isVisible" type="textarea" v-model="ruleEditGroup.slogan" placeholder="100字以内" ></el-input>
                <span v-show="isTextVisible" v-if="!!ruleEditGroup.slogan" class="sloganText">{{ruleEditGroup.slogan}}</span>
              </el-form-item>
              <el-form-item label="组长：" :label-width="labelWidth" prop="leader">
                <span v-if="!!ruleEditGroup.leaderName">{{ruleEditGroup.leaderName}}</span>
                <span v-else id="leaderName">未指定</span>
              </el-form-item>
            </el-form>
          </div>
         <div class="edit">
            <span v-show="isTextVisible" @click="groupEdit('edit')">
              <i class="icon-group-edit"></i>编辑
            </span>
           <div v-show="isVisible">
             <button type="button" class="btn-cancle" @click="groupEdit('cancel')">
               取消
             </button>
             <button type="button" class="btn-group-save" @click="groupEdit('save','ruleEditGroup')">
               保存
             </button>
           </div>
            <!--<input type="button" value="编辑" @click="editGroupDetail"/>-->
         </div>
       </div>
    </div>
    <!--列表-->
    <div class="round-layout mt12 mg-b16">

      <!--头部-->
      <div class="top mg-b16 clearfix">
        <span class="w-sum">小组成员：（{{totalElements}}）人</span>
        <div class="right">

          <button class="btn-group-leader" type="button" @click="chooseLeaderM">
            <i class="icon-import"></i>
            选择组长
          </button>
          <button class="btn-group-save ml10" type="button" @click="studentSelectM">
            <i class="icon-circle-add"></i>
            添加组员
          </button>
           <button class="btn-exp btn-green-line ml10" type="button" style="display:inline-block" @click="discusDetailChat">
            小组讨论
          </button>

        </div>
      </div>

      <!--列表-->
      <div class="el-table-width">
        <el-table class="list"
                  :data = "addStudents" stripe>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span class="btn-group-assign"
                    v-if="scope.row.isLeader">
                组长
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="integral"
            label="积分"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="transferGroupM(scope.row)">调组</el-button>
              <el-button type="text" @click="moveGroup(scope.$index,scope.row)">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--footer-->
        <!--<div class="j-page-footer">-->
          <!--<p class="p-nodis">共{{totalElements}}条&nbsp;每页20条</p>-->
        <!--</div>-->
        <!--&lt;!&ndash;分页&ndash;&gt;-->
        <!--<div class="pagination">-->
          <!--<el-pagination-->
            <!--@current-change ="handleCurrentChange"-->
            <!--layout="prev, pager, next"-->
            <!--:page-size="20"-->
            <!--:total="totalElements">-->
          <!--</el-pagination>-->
        <!--</div>-->
      </div>

    </div>
    <!--选择组长-->
    <choose-leader
      @groupLeaderAssign = "successData"
      :dialogChooseLeader.sync="chooseLeader">
    </choose-leader>
    <!--添加组员-->
    <student-select
      :dialogStudentSelect.sync = "studentSelect"
      :groupTitles = "groupTitle"
      :groupTime = "getTime"
      :clazzId="clazzId"
      :groupId="groupId"
      @StudentSelectData="selectDataMthod"
    ></student-select>
    <!--调组-->
    <allot-group
      :transferGroupTitle = "transferTitle"
      :transfer="1"
      :studentIdCur = "studentId"
      :dialogAllotGroup.sync="transferGroup"
      @groupAssgin = "selectDataMthod"
    >
    </allot-group>


  </div>
</template>
<script>
  import breadCrumb from 'components/course/breadcrumb';
  import model from '@/model/clazz/group';
  import chooseLeader from  "components/clazz/group/leader-choose";
  import studentSelect from 'components/activity/discuss/student_select_group'
  import allotGroup from  "components/clazz/group/allot"
  import bus from "@/global/bus";
  import { delTip } from '@/global/open';
  import Goback from 'base/goback/goback'
export default {
  data(){
    return{
      passtitle:'分组管理',
      clazzId:"",
      groupId:"",
      studentId:"",
      imId:"",
      imageUrl:"",
      addStudents:[],
      isVisible:false,
      isTextVisible:true,
      totalElements:0,
      chooseLeader:false,
      studentSelect:false,
      transferGroup:false,
      transferTitle:"调组",
      getTime:"",
      groupTitle:["未分组学员","已选择学员"],
     // selectData:[],
      rules: {
        name: [
          { required: true, message: '请填写小组名称', trigger: 'blur' },
          { max: 12, message: '姓名不能超过12字'}
        ],
        slogan: [
          { required: true, message: '请填写口号', trigger: 'blur' },
          { max: 100, message: '口号不能超过100字'}
        ]
      },
      ruleEditGroup:{
        name:"",
        slogan:"",
        leader:"",
        photo:""
      },
      labelWidth: "100px"
    }
  },
  created(){
    this.clazzId = this.$route.query.clazzId;
    this.groupId = this.$route.query.groupId;
    this.getTime = new Date().getTime();
    //分组头部
    this.getDetailList();
    //分组列表
    this.userList();
  },
  methods:{
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
    getDetailList(){
      var data = {
        clazzId:this.clazzId,
        id:this.groupId
      }
      model.groupFindById(data, (res => {
        if(res.status == 200) {
            this.ruleEditGroup = res.data;
            this.imId = res.data.imId;
            if(!!res.data.miniLogo){
              this.imageUrl = res.data.miniLogo;
            }
        } else {
          this.$message.error(res.message);
        }
      }));
    },
    //小组讨论聊天页
    discusDetailChat(){
       this.$router.push({
            path: '/clazz/group/result',
            query: {
              imId:this.imId,
              groupId:this.groupId,
              clazzId:this.clazzId
            }
        })
    },
    studentSelectM(){
      this.getTime = new Date().getTime();
      this.studentSelect = true;

    },
    transferGroupM(row){
       this.studentId = row.id;
       this.transferGroup  = true;
    },
    chooseLeaderM(){
      this.chooseLeader = true;
    },
    successData(){
      this.userList();
      this.getDetailList();
    },
    selectDataMthod(data){
      //this.selectData = data;
      this.userList();
    },
    userList(){
      var data = {
        clazzId:this.clazzId,
        id:this.groupId
      }
      model.groupUserList(data, (res => {
        if(res.status == 200) {
          // console.log(res.data)
           if(res.data.length !=0){
              this.addStudents = res.data;
              this.totalElements = res.data.length;
           }else{
             this.addStudents = [];
             this.totalElements = 0;
           }
        } else {
          this.$message.error(res.message);
        }
      }));
    },
    selAvatar (event) {
      let _this = this;
      let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
      if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
        _this.ruleEditGroup.photo = event.target.files[0];
        let objUrl = event.target.files[0];
        let windowURL = window.URL || window.webkitURL;
        let imageUrl = windowURL.createObjectURL(objUrl);
        _this.imageUrl = imageUrl

      }

    },
    moveGroup(index,row){
      let str = "确定将该学员从小组中移出吗？";
      delTip(this, str, this.moveGroupM, index);
      this.studentId = row.id;

    },
    moveGroupM(){
      var _this = this;
      var data = {
        clazzId:_this.clazzId,
        groupId:_this.groupId,
        ids:[""+_this.studentId+""]
      }
      model.groupUserDelete(data, (res => {
        if(res.status == 200) {
          this.$message({
            type: 'success',
            message: '移出成功',
            duration: 1000,
            onClose() {
              _this.userList();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      }));
    },
    groupEdit(type,formName){
      if(type == "edit"){
        this.isTextVisible = false;
        this.isVisible = true;
      }else if(type == "cancel"){
        this.getDetailList();
        this.isTextVisible = true;
        this.isVisible = false;
        //保存
      }else if(type == "save"){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.saveGroup();
          }else{
            console.log('error submit!!');
            return false;
          }
        })


      }

    },
    saveGroup(){
      var data = {
        file:this.ruleEditGroup.photo,
        groupId:this.groupId,
        clazzId:this.clazzId,
        name:this.ruleEditGroup.name,
        slogan:this.ruleEditGroup.slogan
      }
      model.groupUpdate(data, (res => {
        if(res.status == 200) {
         /// this.ruleEditGroup = res.data;
          this.isTextVisible = true;
          this.isVisible = false;
        } else {
          this.$message.error(res.message);
        }
      }));
    }

  },
  components:{
    breadCrumb,
    chooseLeader,
    studentSelect,
    allotGroup,
    Goback
  }

}
</script>
<style scoped="" lang="less">
  @import "../../../assets/less/icon.less";
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/btn-search.less";
 .j-group-detail{
   .choose{
     background-color: #f7fbfb;
     border:1px solid #91cac6;
     color: #319c95;
     font-size: 16px;
     line-height: 30px;
     text-align: center;
     border-radius: 3px;
     margin-top:12px;
   }
   .btn-group-save i{
     vertical-align: middle;
   }
    .title{
       padding:0 0 15px 28px;
      .left{
        float: left;
        padding-top: 36px;
        .img{
          width: 127px;
          height: 127px;
          border-radius: 5px;
          border: 5px solid #b8e0dd;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .right{
        float: left;
        margin-left: 34px;
        padding-top: 36px;
        font-size: 20px!important;
        font-weight: bold;
        width: 65%;

        span{
          font-size:20px;
          color: #333;
          display: inline-block;
          font-weight: normal!important;
        }
      }
      .edit{
        float: right;
        padding-left: 20px;
        padding-right: 34px;
        padding-top:22px;
        color: #3182d9;
        span{
          cursor: pointer;
          i{
            vertical-align: middle;
            margin-right:10px;
            display: inline-block;
          }
        }

      }
    }
   .top{
     padding:16px 44px 16px 20px;
     border-bottom: 1px solid #e6e6e6;
   }
   .w-sum{
     margin-top:8px;
     display: inline-block;
   }
   .el-table-width{
     width: 60%;
     margin-left: 35px;
     padding-bottom: 20px;
   }
  }
  .el-form-item__content{
      padding:11px 12px 11px 0
  }

</style>
