<template>
<div>
     <div class="heardbox">
      <v-head ref="headerRef">
        <el-dropdown trigger="click" @command="operaterCommand">
          <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <slot></slot>
          <el-dropdown-menu slot="dropdown"  class="passwordEdit orgDropDown">
              <el-dropdown-item command="myInfo" class="vipInfo">
                  <img src="/static/img/avatar.png" alt="" class="orgImg">
                  <span class="orgText">朱雀鲨鱼</span>
              </el-dropdown-item>
              <el-dropdown-item command="edit">
                  <i class="icon-diamond"></i>VIP会员
                  <span class="toOpen">去申请开通<i class="el-icon-arrow-right rightArrow"></i></span>
              </el-dropdown-item>
              <el-dropdown-item command="accountCenter">
                  <i class="icon-org"></i>机构账户中心
                  <i class="el-icon-arrow-right rightArrow"></i>
              </el-dropdown-item>
              <el-dropdown-item command="edit">
                  <i class="icon-edit-word"></i>修改密码
                  <i class="el-icon-arrow-right rightArrow"></i>
              </el-dropdown-item>
              <el-dropdown-item command="exit">
                  <i class="icon-exit"></i>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </v-head>
  </div>

  <div id = "classList">
    <!--org 列表-->
    <org-layer @upVipInfo = "upVipInfo" ref="layerEl"></org-layer>
    <!--admin或机构管理员-->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="item" v-if = "role == 'ADMIN' || role == 'ORGADMIN'">
      <el-tab-pane class="wrapper" label="机构首页" name="objnav">
      </el-tab-pane>
      <el-tab-pane label="项目列表" name="proList">
      </el-tab-pane>
      <el-tab-pane label="机构成员" name="orgUser">
      </el-tab-pane>
      <el-tab-pane label="机构管理" name="orgManage">
      </el-tab-pane>

      <el-tab-pane label="模板及资源库" name="repository"></el-tab-pane>
      <el-tab-pane label="总结报告" name="finalReport"></el-tab-pane>
    </el-tabs>
    <!--非admin权限-->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="item" v-if = "role == 'CLAZZMANAGER' || role == 'PROFESSOR'|| role == 'PROJECTADMIN'">
     <!--  <el-tab-pane class="wrapper" label="项目列表" name="proList">
      </el-tab-pane> -->
      <el-tab-pane class="wrapper" :label="'项目列表'" name="proList">
      </el-tab-pane>
      <el-tab-pane label="机构管理" name="orgManage">
      </el-tab-pane>
      <el-tab-pane v-if="role == 'PROJECTADMIN'" label="总结报告" name="finalReport"></el-tab-pane>
      <!-- <el-tab-pane label="机构简介" name="orgDetail">
      </el-tab-pane> -->
    </el-tabs>
    <router-view class = "wrapper"></router-view>

  </div>
</div>  
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import OrgLayer from "components/organization/layer"
  import storage from '@/global/storage'
  import { menu } from '@/global/open'
  import vHead from 'components/header/header';
  import { exitSys } from "../../filters/userVerify"
  export default {
    data () {
      return {
        active: '',
        orgAdmin: false,
        clazzManager: false,
        role: "",
        adminUserId:"",
        orgUserIds: "",
        orgId: this.$route.query.orgId || "",
        flag:false
      }
    },
    computed:{
      stats(){
         return this.$store.getters.showOrgObj;
      },
      //监控路由的变化返回不同的activeName
      activeName:{
        get:function(){
          let thisrouter = JSON.stringify(this.$route.path);
          let avtive='';
          if(thisrouter.indexOf("objnav") > -1){
              avtive = 'objnav';
          }else if (thisrouter.indexOf("prolist") > -1) {
              avtive = 'proList';
          } else if (thisrouter.indexOf("orguser") > -1) {
              avtive = 'orgUser';          
          } else if (thisrouter.indexOf("manage") > -1 || thisrouter.indexOf("org/detail") > -1 || thisrouter.indexOf("app") > -1 ||thisrouter.indexOf("/org/certificate") > -1) {
              avtive = 'orgManage';
          } else if(thisrouter.indexOf("repository") > -1){
              avtive = 'repository';                  
          } else if(thisrouter.indexOf("orgreport") > -1) {
              avtive = "finalReport"
          }else{
            avtive = 'objnav';
          }
          return avtive
        },
        set:function(){
          
        }
      }
    },    
    watch:{
      stats(cur,old){                
        if(this.flag == true){
          this.flag = false;
          return;
        }
        this.orgId = cur.identification;
        this.menuRole(cur.role);
        // 判断权限跳转
        let rou = JSON.stringify(this.$route.path);
          if(this.role=='ORGADMIN' || this.role=='ADMIN'){
              this.$router.push("/project/objnav?orgId="+this.orgId);
              this.activeName = "objnav";
          }else{
              this.$router.push("/project/prolist");
              this.activeName = 'proList';
              
          }        
      }
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(vm.role == 'ADMIN' && !vm.orgId) {
          vm.$router.push('/organization/list/');
        }
      })
    },

    created () {


          this.adminUserId = storage.get("exp_userId");

          if(!!storage.get("orgId")){
              this.orgId = storage.get("orgId").identification;
          }
        

          // console.log(this.orgId)

          //判断角色
          this.menuRole();

          //admin登录
          if (this.role == "ADMIN") {
            this.orgId = this.$route.query.orgId;
            this.orgUserIds = this.$route.query.userId;
          } 
          //登录第一次进来走watch,获取机构id,否则机构id为空
          if(!!this.orgId){
             this.flag = true;
          }
          
      
    },
    mounted(){
      setTimeout(() => {
        this.$refs.layerEl.getAccountInfo();
        this.$refs.headerRef.getAccountInfo();
      }, 500);
    },
    methods: {
     
      menuRole (role) {
        var role = role || storage.get("exp_role");
        // console.log("菜单role" + role);
        this.role = role;
      },
      refreshActive: function () {
        var resId = sessionStorage.getItem("resId");
        var thisrouter = JSON.stringify(this.$route.path);


        if (this.role == "ADMIN") {
            if(thisrouter.indexOf("objnav") > -1){
                this.activeName = 'objnav';
            }else if (thisrouter.indexOf("prolist") > -1) {
                this.activeName = 'proList';
            } else if (thisrouter.indexOf("orguser") > -1) {
                this.activeName = 'orgUser';
              
            } else if (thisrouter.indexOf("manage") > -1) {
                this.activeName = 'orgManage';
            } else if(thisrouter.indexOf("repository") > -1){

                this.activeName = 'repository';
                if(thisrouter.indexOf("queslist") > -1) {
                    this.$router.push("/org/repository/queslist?orgId=" + this.orgId);
                } else if (thisrouter.indexOf("reposilist") > -1) {
                    this.$router.push("/org/repository/reposilist?orgId=" + this.orgId);
                } else if (thisrouter.indexOf("depth_list") > -1 && !!resId) {
                    this.$router.push("/org/repository/depth_list?clazzId=&orgId=" + this.orgId + "&resId=" + resId);
                } else {
                    this.$router.push("/org/repository/menu?orgId=" + this.orgId);
                } 
                
            } else if(thisrouter.indexOf("orgreport") > -1) {
                this.activeName = "finalReport"
            }


        } else if(this.role == "ORGADMIN"){


            if(thisrouter.indexOf("objnav") > -1){
                this.activeName = 'objnav';
                this.$router.push("/project/objnav?orgId=" + this.orgId);
            }else if (thisrouter.indexOf("prolist") > -1) {
                this.activeName = 'proList';
                this.$router.push("/project/prolist");
            } else if (thisrouter.indexOf("orguser") > -1) {
                this.activeName = 'orgUser';
                this.$router.push("/orguser/pro_list?orgId=" + this.orgId);
       
            } else if (thisrouter.indexOf("manage") > -1) {
                this.activeName = 'orgManage';
                this.$router.push("/org/manage?orgId=" + this.orgId);
            } else if(thisrouter.indexOf("repository") > -1){
                console.log("机构管理严");
                this.activeName = 'repository';

                if(thisrouter.indexOf("queslist") > -1) {
                    this.$router.push("/org/repository/queslist?orgId=" + this.orgId);
                } else if (thisrouter.indexOf("reposilist") > -1) {
                    this.$router.push("/org/repository/reposilist?orgId=" + this.orgId);
                } else if (thisrouter.indexOf("depth_list") > -1 && !!resId) {
                    this.$router.push("/org/repository/depth_list?clazzId=&orgId=" + this.orgId + "&resId=" + resId);
                } else {
                    this.$router.push("/org/repository/menu?orgId=" + this.orgId);
                } 

            } else if(thisrouter.indexOf("/orgreport/menu") > -1) {
                this.activeName = "finalReport";
                this.$router.push("/orgreport/menu?orgId=" + this.orgId);
            }

        } else {
            if (thisrouter.indexOf("prolist") > -1) {
                this.activeName = 'proList';
            } else if (thisrouter.indexOf("orguser") > -1) {
                this.activeName = 'orgUser';
                this.$router.push("/orguser/pro_list?orgId=" + this.orgId);

            } else if (thisrouter.indexOf("manage") > -1) {
                this.activeName = 'orgManage';
                this.$router.push("/org/manage?orgId=" + this.orgId);

            } else if(thisrouter.indexOf("orgreport") > -1) {
                this.activeName = "finalReport";
                this.$router.push("/orgreport/menu?orgId=" + this.orgId);
            }
 
        }

        // 定义标签位置
        switch(true) {
          // 机构管理下
          case thisrouter.indexOf('/org/detail') > -1:
            this.activeName = 'orgManage';
            break;
          case thisrouter.indexOf('/app') > -1:
            this.activeName = 'orgManage';
            break;
          case thisrouter.indexOf('/org/certificate') > -1:
            this.activeName = 'orgManage';
            break;
          // 总结报告下
          case thisrouter.indexOf('/orgreport/itemstat') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/expertstate') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/itemscore') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/coursescore') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/itemsat') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/coursesat') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/taskstate') > -1:
            this.activeName = 'finalReport';
            break;
          case thisrouter.indexOf('/orgreport/leavemsg') > -1:
            this.activeName = 'finalReport';
            break;
        }

      },


      handleClick (tab, event) {

          if (tab.name == "orgUser") {
              //admin权限
              if(this.role == 'ADMIN'){
                  this.$router.push("/orguser/org_list?orgId=" + this.orgId);
              }
              //机构权限
              if(this.role == 'ORGADMIN'){
                  this.$router.push("/orguser/pro_list?orgId=" + this.orgId);
              }
             
          } else if (tab.name == "proList") {
              if(this.role == "ADMIN"){
                 this.$router.push("/project/prolist?orgId=" + this.orgId + "&userId="+this.adminUserId);
              }else{
                 this.$router.push("/project/prolist");
              }
              
          } else if (tab.name == "orgManage"){
              this.$router.push("/org/manage?orgId=" + this.orgId);  
        
          } else if (tab.name == 'objnav') {
              this.$router.push("/project/objnav?orgId=" + this.orgId);
          } else if (tab.name == 'repository') {
              this.$router.push("/org/repository/menu?orgId=" + this.orgId);
          } else if (tab.name == 'finalReport') {
                this.$router.push("/orgreport/menu?orgId=" + this.orgId)
          }
      },
      operaterCommand(command){
          if(command == "edit"){
              this.$router.push({
                path:"/project/password?type=project"
              })
          }else if(command == "accountCenter"){
              this.$router.push({
                path:"/orgAccount/index",
                query:{orgId: localStorage.orgId?JSON.parse(localStorage.orgId).identification:""}
              })
          }
          if(command == "exit"){
              exitSys();
          }
      },
      upVipInfo(){
        this.$refs.headerRef.getAccountInfo();
      }
    },
    components: {
      OrgLayer,
       vHead

    }
  }
</script>
<style scoped lang="less">
  @import "../../assets/reset-element-ui/item.css";
  @import "../../assets/reset-element-ui/password.css";
  @import "../../assets/less/icon.less";
  .item{
    color: #333;
  }
  .heardbox{
    width:100%;
        height: 118px;
        background-image: url('../../assets/img/common/banner_2.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
  }
  .passwordEdit.orgDropDown{
    width: 230px;
    padding-right:10px; 
    .el-dropdown-menu__item{
      color: #333 !important;
      &.vipInfo{
        background: url("../../assets/img/expert/vipLogo.png") center right no-repeat;
        background-size: 36px 18px;
      }
      .rightArrow{
        float: right;
        font-size: 16px;
        margin-right: -20px;
        margin-top: 10px;
        font-weight: bold;
        color:#333;
      }
      .toOpen{
        font-size: 14px;
        color: #4A90E2;
        float: right;
      }
    }
    
    .orgImg{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orgText{
      font-size: 16px;
      color: #333333;
      vertical-align: middle;
    }
  }
</style>

