<template>
<div>
  <div class="heardbox">
      <v-head>
        <el-dropdown trigger="click" @command="operaterCommand"  class="passwordEdit">
          <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <slot></slot>
          <el-dropdown-menu slot="dropdown"  class="passwordEdit">
            <el-dropdown-item command="edit">
                <i class="icon-edit-word"></i>修改密码
            </el-dropdown-item>
            <el-dropdown-item command="exit">
              <i class="icon-exit"></i>退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </v-head>
  </div>
  <div id = "class_acivity">
    <div id="orgLayer">
      <section class="relative wrapper">
          <div v-if="!!this.avatar && this.avatar !=''">
            <img :src="this.avatar" class="org-logo" alt="">
          </div>
          <div v-else>
            <img src="../../assets/img/common/clazz-logo.png" class="org-logo" alt="">
          </div>
          <div class="org-menu" >
            <div class="clazz">班级</div>
            <h1>{{clazzName}}<br/><div style="display: none">当前位置：班级成员</div></h1>
          </div>

      </section>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="item">
     <!--先做权限判断,只有admin可以看到-->
      <!-- <el-tab-pane label="班级首页" name="clazzIndex" v-if="getCurRole == 'ADMIN'">
      </el-tab-pane> -->
      <el-tab-pane label="班级首页" name="clazzIndex" v-if="getCurRole != 'PROFESSOR'">
      </el-tab-pane>
      <el-tab-pane class="wrapper" label="课程管理" name="courseAdmin">
      </el-tab-pane>
      <el-tab-pane label="成员管理" name="membersMaster">
      </el-tab-pane>
      <!--<el-tab-pane label="活动管理" name="activityRollcall">-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="班级管理" name="clazzNotice"></el-tab-pane>
      <el-tab-pane label="资源管理" name="resourceList"></el-tab-pane>
      <el-tab-pane label="问卷草稿" name="draft" v-if="getCurRole == 'PROFESSOR'"></el-tab-pane>
      <el-tab-pane label="模板库" name="template" v-else></el-tab-pane>
      <el-tab-pane label="总结报告" name="summaryReport" v-if="getCurRole !== 'PROFESSOR'"></el-tab-pane>
      <!--<el-tab-pane label="统计报告" name="staticData"></el-tab-pane>-->
    </el-tabs>
    <router-view  class="wrapper"></router-view>
  </div>
</div>  
</template>
<script>
  import model from 'model/clazz/list'
  import { getCurRole,exitSys } from "../../filters/userVerify"
  import vHead from 'components/header/header';
export default {
  data(){
    return {
      activeName: 'courseAdmin',
      clazzId:"",
      clazzName:"",
      avatar:"",
      getCurRole:getCurRole()
    }
  },
  created(){
     this.clazzId = this.$route.query.clazzId;
     this.refreshActive();
     //获取班级信息
     this.clazzInfo();
    window.addEventListener("popstate", this.refreshActive.bind(this));
  },
  methods:{
    clazzInfo(){
      let clazzId = this.$route.query.clazzId;
      let data = {
        id: clazzId
      }

      model.getClassInfor(data, ( res => {
        // console.log(res.data)
        if(res.status == 200) {
          this.clazzName = res.data.name;

          //存储当前班级名称 
          this.$store.state.curClazzName = this.clazzName;
          //存储当前班级所在的机构
          this.$store.state.clazzOrgid=res.data.organizationId;

          //存储当前clazzId
          this.$store.commit('curClazzId',res.data.id);

          this.avatar = res.data.logo;

        } else {
          this.$message.error(res.message);
        }
      }),false);
    },
    refreshActive:function () {
      let reg = /([^\s]+)\?.*/;
      let thisrouter = window.location.hash.replace(reg, "$1");
      if(thisrouter.indexOf("index") > -1){
        this.activeName = 'clazzIndex';
      }else if(thisrouter.indexOf("course") > -1 || thisrouter.indexOf("activity") > -1){
        this.activeName =  'courseAdmin';
      }else if(thisrouter.indexOf("members") > -1){
        this.activeName =  'membersMaster';
      }else if(thisrouter.indexOf("clazz") > -1){
        this.activeName =  'clazzNotice';
      }else if(thisrouter.indexOf("resource") > -1){
        this.activeName =  'resourceList';
      }else if(thisrouter.indexOf("draft") > -1){
        
        if(getCurRole == 'PROFESSOR'){
          this.activeName =  'draft';
        }else{
          this.activeName =  'template';
        }
        
      }else if(thisrouter.indexOf("evaltemp") > -1){
        this.activeName =  'template';
      }else if(thisrouter.indexOf("report") > -1) {
        this.activeName = 'summaryReport'
      }
    },
    handleClick(tab, event){
      if(tab.name == "clazzIndex") {
        this.$router.push("/clazz/index?clazzId="+this.clazzId);
      } else if(tab.name == "courseAdmin"){
        this.$router.push("/course/all?clazzId="+this.clazzId);
      }else if(tab.name == "membersMaster"){
         //机构管理员、admin和项目管理员
        if( this.getCurRole == 'ORGADMIN' || this.getCurRole == 'ADMIN' || this.getCurRole == 'PROJECTADMIN'){
          this.$router.push("/members/master?clazzId="+this.clazzId);
          //班主任
        }else if(this.getCurRole == 'CLAZZMANAGER'){
          this.$router.push("/members/pfessor?clazzId="+this.clazzId);
          //专家
        }else{
          this.$router.push("/members/student?clazzId="+this.clazzId);
        }

      }else if(tab.name == "clazzNotice"){
        this.$router.push("/clazz/menu?clazzId="+this.clazzId);
      }else if(tab.name == "resourceList"){
        this.$router.push("/resource/list?clazzId="+this.clazzId);
      }else if(tab.name == "draft"){
        this.$router.push("/questionare/draft?clazzId="+this.clazzId);
      }else if(tab.name == "template"){
        this.$router.push("/evaltemp/admin?clazzId="+this.clazzId);
      }else if(tab.name == "summaryReport") {
         this.$router.push("/report/menu?clazzId="+this.clazzId);
      }
    },
    operaterCommand(command){
          if(command == "edit"){
              this.$router.push({
                  path:"/project/password?type=clazz"
              })
          }
          if(command == "exit"){
              exitSys();
          }
      }

  },
  components: {
    vHead
  }

}
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/item.css";
  @import "../../assets/reset-element-ui/password.css";
  @import "../../assets/less/icon.less";
  @img: "../../assets/img/item";
  @borderColor: #f0f0f0;
  .heardbox{
    width:100%;
        height: 118px;
        background-image: url('../../assets/img/common/banner_3.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
  }
  .org_list{
    background-color: #fff;
    border: 1px solid @borderColor;
    border-radius: 6px;
    box-shadow: -2px 0 3px #f0f0f0,
    2px 0 3px #f0f0f0,
      0 -2px 3px #f0f0f0,
    0 2px 3px #f0f0f0;
    margin: 0 auto;
    max-width: 1190px;
  }
#class_acivity li{
  float: left;
  width: 100px;
  height: 30px;
  line-height: 30px;
  background: #ccc;
  list-style: none;
}
#orgLayer {
  width: 100%;
  height: 78px;
  margin-top: -78px;
}
  .org-logo {
    position: absolute;
    width: 57px;
    height: 57px;
    border-radius: 90px;
    top:50%;
    margin-top:-28px;
    margin-left: 10px;
  }
  .org-menu {
    display: block;
    height: 100%;
    margin-left: 80px;
    >.clazz{
      background: #FD7E23;
      border-radius: 100px;
      width: 41px;
      height: 18px;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      line-height: 18px;
      float: left;
      margin-top: 32px;
      margin-right: 8px;
    }
    >h1 {
      margin-right: 30px;
      font-size: 18px;
      color: #fff;
      float: left;
    }
    >h1 {
      display: inline-block;
      margin-top: 30px;
    }


  }
  .el-icon-arrow-down:before{
      content:"\E60B"!important;
      color: #fff;
      width: 9px;
      height: 7px;
  }
  .el-dropdown-menu{
    background: rgba(0,0,0,0.5)!important;
    border: none;
  } 
  .el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:rgba(0,0,0,0.7)!important;
    top: 0px!important;
  }
</style>
